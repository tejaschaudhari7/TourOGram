const mongoose = require('mongoose');
const cities = require('./cities');
//console.log(cities.length);
const {places,descriptors} = require('./seedhelpers');
const Destination = require('../models/destination');

mongoose.connect('mongodb+srv://user01:SGecNTgg9ciUZOit@culster1.yelvjwe.mongodb.net/?retryWrites=true&w=majority')

const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error"));
db.once('open',()=>{
    console.log('Database Connected')
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Destination.deleteMany({});
    for(let i = 0;i < 50;i++){
        const random200 = Math.floor(Math.random() * 213);
        const price = Math.floor(Math.random() * 1000);
        const dest = new Destination({
            location:`${cities[random200].City},${cities[random200].State}`,
            geometry: { type : "Point", coordinates : [ cities[random200].Longitude, cities[random200].Latitude ] },
            title:`${sample(descriptors)} ${sample(places)}`,
            image : [
                
                {
                    url: 'https://res.cloudinary.com/tourogram/image/upload/v1656310250/TourOGram/sage-friedman-HS5CLnQbCOc-unsplash_ew2ne9.jpg',
                    filename: 'TourOGram/sage-friedman-HS5CLnQbCOc-unsplash_ew2ne9',
                },
                {
                    url: 'https://res.cloudinary.com/tourogram/image/upload/v1656310202/TourOGram/tim-foster-dxmCzpnKQQ0-unsplash_k6jtzr.jpg',
                    filename: 'TourOGram/tim-foster-dxmCzpnKQQ0-unsplash_k6jtzr',
                }
    
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium animi nemo nesciunt optio aliquam atque? Quibusdam libero, voluptas nemo nobis ut non, sit accusamus expedita magnam illo itaque odio consequuntur.',
            price,
            author : '62b95d700aeb75e7161b97ed'
        })
    await dest.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
// console.log('executed!')