//Import
const User = require('../models/user.js');

module.exports.renderRegister = (req, res) =>
{
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) =>
{
    try {
        const {username, email, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err =>
        {
            if(err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        });
    }
    catch (error)
    {
        req.flash('error', error.message);
        res.redirect('/register');
    }
}

module.exports.loginUser = (req, res) =>
{
    res.render('users/login');
}

module.exports.loginAlert = (req, res) =>
{
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) =>
{
    req.logout(function (err)
    {
        if(err)
        {
            return next(err);
        }
        req.flash('success', 'Goodbye, come back soon!');
        res.redirect('/campgrounds');
    });
}