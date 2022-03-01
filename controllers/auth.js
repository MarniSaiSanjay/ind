const { status } = require('express/lib/response');
const User = require('../models/hr');

module.exports.login_get = (req,res) => {
    res.render('auth/login');
}

module.exports.login_post = async (req,res) => { 
    // req.flash('success', 'Welcome');
    res.redirect('/home');
 }

module.exports.register_get = (req,res) => { 
    const { username, email } = req.query;
    if (username && email) res.render('auth/register', { username, email });
    else res.render('auth/register');
}

module.exports.register_post = async (req, res, next) => {
    console.log(req.body);
    const { email, username, password, password2 } = req.body;

    if (!username || !email || !password2 || !password) {
        // req.flash('error', `Fill all the fields`);
        res.redirect(`/users/register`);
    }
    else if (password != password2) {
        // req.flash('error', `Passwords don't match`);
        res.redirect(`/users/register?username=${username}&email=${email}`);
    }
    else if (password.length < 6) {
        // req.flash('error', 'Password should be atleast 6 characters');
        res.redirect(`/users/register?username=${username}&email=${email}`);
    }
    else{
        try{
            const user = new User({email, username});
            // register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique. This is provided by 'passport-local-mongoose'
            const registerUser = await User.register(user, password); // '.register' -> also checks if username exist in db or not. If it exists it throws an error that 'A user with the given username is already registered' . It will automatically save the user, so no need to use '.save()' . 
            req.login(registerUser, err => { // as we use isLoggedIn to home page, it will not take us to home page after singUp as we are not logged in, so to avoid to manually login after signUp we are loggin them here only.
                if(err) return next(err);
                // req.flash( 'success','Welcome');
                //res.redirect('/home');
                res.sendStatus(200);
            })
        }catch(e){
            // req.flash('error', e.message); // if error it would be better to flash it, than taking user to error page.
            res.redirect('/users/register');
        }
    }
}

module.exports.logout = (req, res) => {
    req.logOut();
    // req.flash('success', 'Bye');
    res.redirect('/users/login');
};

