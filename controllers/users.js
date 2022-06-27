
const User = require('../models/user');

module.exports.renderRegistrationForm = (req,res) => {
    res.render('users/register')
}

module.exports.logout = (req, res, next) => {
    req.logOut(err => {if (err)  return next(err); })
      req.flash('success', "Successfully logged out!");
      res.redirect('/');
}

module.exports.register = async (req,res) => {
    try {
        const {email , username, password} = req.body;
        const newUser = new User({email,username});
        const regUser = await User.register(newUser,password);
        req.logIn(regUser, err => {
            if(err) return next(err);
            req.flash('success',`Welcome to TouroGram @${username}!`);
            res.redirect('/destinations');
        })
    } catch (err) {
        req.flash('error',err.message);
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render('users/login');
}

module.exports.login = async(req,res) => {
    const {username} = req.body;
    req.flash('success',`Welcome back @${username}`);
    console.log(req.session.returnTo)
    const redirectUrl = req.session.returnTo || '/destinations';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}