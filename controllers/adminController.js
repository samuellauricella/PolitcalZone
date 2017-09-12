const passport = require('passport')
const crypto = require('crypto')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const promisify = require('es6-promisify')

exports.getAdminPage = (req, res)=>{
	res.render('adminPage')
}

exports.registerForm = (req,res) =>{
	res.render('adminRegister', {title: 'Register'})
}

exports.register = async(req,res)=>{
	try{
		const user = new User({email: req.body.email, name: req.body.name, authLevel: req.body.authLevel});
		const register = promisify(User.register, User)
		await register(user, req.body.password)
		req.flash('success', 'Successfully created new admin')
		res.redirect('back')
	}catch(errors){
		req.flash('danger', 'Could not create new admin')
		res.redirect('back')
	}

}

exports.isLoggedInAdmin = (req, res, next)=>{
	if( req.user && req.user.authLevel == 1){
		return next()
	}
	req.flash('danger', 'Oops you must be an admin')
	res.redirect('/')
}

exports.isLoggedInSubAdmin = (req, res, next)=>{
	if( req.user && req.user.authLevel <= 2){
		return next()
	}
	req.flash('danger', 'Oops you must be an admin')
	res.redirect('/')
}