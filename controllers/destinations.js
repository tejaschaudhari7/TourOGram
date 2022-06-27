const Destination = require('../models/destination')
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async(req,res) => {
    var destinations = await Destination.find({});
    console.log(destinations.length);
    destinations = destinations.reverse();
    res.render('destinations/index',{destinations})
}

module.exports.renderNewForm = (req,res) => {
    res.render('destinations/new');
}

module.exports.createNew = async (req,res) => {
    const geoData = await geoCoder.forwardGeocode({
        query : req.body.destination.location,
        limit : 1
    }).send()
    const destination = new Destination(req.body.destination);
    destination.geometry = geoData.body.features[0].geometry
    destination.author = req.user._id;
    destination.image = req.files.map(f => ({url: f.path, filename: f.filename}));
    await destination.save();
    console.log(destination);
    req.flash('success','Successfully Created a new campground');
    res.redirect(`/destinations/${destination._id}`);
}

module.exports.show = async(req,res) => {
    const destination = await Destination.findById(req.params.id)
    .populate({
        path : 'reviews',
        populate : { 
            path : 'author'
        }
    })
    .populate('author');
    if(!destination) {
        req.flash('error','Destination not found');
        return res.redirect('/destinations')
    }
    res.render('destinations/show',{destination});
}

module.exports.renderEditForm = async (req,res) => {
    const {id} = req.params;
    const destination = await Destination.findById(id);
    if(!destination) {
        req.flash('error','No matching destination found')
        return res.redirect('/destinations')
    }
    res.render('destinations/edit',{destination});
}

module.exports.edit = async (req,res) => {
    // res.send('Success!')
    const {id} = req.params;
    const destination = await Destination.findByIdAndUpdate(id,{...req.body.destination})
    const originalLocation = destination.location;
    const images = req.files.map(f => ({url: f.path, filename: f.filename}));
    destination.image.push(...images);
    if(req.body.deleteImages) {
        for(let file of req.body.deleteImages) {
           await cloudinary.uploader.destroy(file);
        }
        await destination.updateOne({$pull : {image : {filename : {$in : req.body.deleteImages}}}});
    }
    if(req.body.destination.location !== originalLocation)
    {
        const geoData = await geoCoder.forwardGeocode({
            query : req.body.destination.location,
            limit : 1
        }).send()
        destination.geometry = geoData.body.features[0].geometry
    }
    await destination.save();    
    req.flash('success','Successfully edited destination');
    res.redirect(`/destinations/${destination._id}`);
}

module.exports.delete = async (req,res) => {
    const {id} = req.params;
    const destination = await Destination.findById(id);
    await Destination.findByIdAndDelete(id)
    req.flash('success','Successfully deleted destination');
    res.redirect('/destinations')
}