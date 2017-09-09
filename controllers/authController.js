const passport = require('passport')
const crypto = require('crypto')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const promisify = require('es6-promisify')
const mail = require('../handlers/mail')

exports.login = passport.authenticate('local',{
	failureRedirect: '/login',
	failureFlash: 'Failed Login',
	successRedirect: '/',
	successFlash: 'You are now logged in'
})

exports.logout = (req, res) =>{
	req.logout()
	req.flash('success', 'You are now logged out')
	res.redirect('/')
}

exports.isLoggedIn = (req, res, next)=>{
	if(req.isAuthenticated()){
		return next()
	}
	req.flash('error', 'Oops you must be logged in')
	res.redirect('/login')
}



exports.forgot = async(req, res) =>{

	try{
		const user = await User.findOne({email: req.body.email})

		if(!user){
			req.flash('success','A password reset has been mailed to you')
			return res.redirect('/login')
		}

		user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
		user.resetPasswordExpires = Date.now() + 3600000

		await user.save()
		const resetUrl = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`

		await mail.send({
			user,
			subject: 'Password Reset',
			resetUrl,
			filename: 'password-reset',
			resetUrl
		})
		req.flash('success', `You have been emailed a password reset link`)
		res.redirect('/login')

	}catch(error){

	}
	
}

exports.reset = async(req, res) =>{

	try{
		const user = await User.findOne({
			resetPasswordToken: req.params.token,
			resetPasswordExpires: {$gt: Date.now()}
		})

		if(!user){
			req.flash('error', 'Password reset is invalid or has expired')
			return res.redirect('/login')
		}

		res.render('reset', {title: 'Reset your Password'})
	}catch(error){

	}
}


exports.confirmedPasswords = (req,res, next) =>{
	if (req.body.password === req.body['password-confirm']){
		return next()
	}

	req.flash('error', 'Passwords do not match!')
	res.redirect('back')
}

exports.update = async(req, res) =>{
	try{
		const user = await User.findOne({
			resetPasswordToken: req.params.token,
			resetPasswordExpires: {$gt: Date.now()}
		})
		if(!user){
			req.flash('error', 'Password reset is invalid or has expired')
			return res.redirect('/login')
		}

		const setPassword = promisify(user.setPassword, user)
		await setPassword(req.body.password)
		user.resetPasswordExpires = undefined
		user.resetPasswordToken = undefined

		const updatedUser = await user.save()
		await req.login(updatedUser)
		req.flash('success', 'Your password has been reset')
		res.redirect('/')
	}catch(error){

	}
}