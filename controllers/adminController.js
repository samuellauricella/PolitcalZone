const passport = require('passport')
const crypto = require('crypto')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const promisify = require('es6-promisify')
const Article = mongoose.model('Article')
const pug = require('pug')

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



exports.featuredArticles = async (req,res)=>{
    try{
        const feature = req.params.feature
        const featureQuery = feature || { $exists: true}
        const featuresPromise = await Article.getFeaturesList()
        const articlesPromise = Article.find({featured:featureQuery})

        const [features, articles] = await Promise.all([featuresPromise, articlesPromise])

        res.render('featuredArticles', {features, title: 'The Political Zone', feature,articles})
    }catch(error){
        req.flash('error', `Unable to get articles at this time}.`)
        res.redirect('back')
        return error
    }
}


exports.getUsers = async (req,res) =>{
	try{
		const users = await User.find()
		res.render('users', {title:"User Accounts", users})
	}catch(errors){
		req.flash('error', `Unable to get users at this time}.`)
        res.render('back')

	}
}


exports.getUser= async(req,res)=>{
    try{
        user = await User.findOne({_id:req.params.id})
        res.render('user', {user})
    }catch(error){
    	req.flash('error', `Unable to get user at this time}.`)
        res.render('back')
    }
}


exports.deleteUser = async (req,res) =>{
	try{
		const user= await User.remove({_id: req.params.id})
		req.flash('success', 'Successfully deleted user')
		res.redirect('back')
	}catch(errors){
		req.flash('error', `Unable to delete user at this time}.`)
        res.render('back')
	}
}


exports.deleteArticle = async (req,res) =>{
	try{
		const article= await Article.remove({_id: req.params.id})
		req.flash('success', 'Successfully deleted article')
		res.redirect('/')
	}catch(errors){
		req.flash('error', `Unable to delete at this time}.`)
        res.render('back')
	}
}


exports.getAdminArticles = async (req, res) => {
    try{
       const articles = await Article.find();
        res.render('adminArticles',{articles})
    } catch (error){
        req.flash('error', `Unable to get articles at this time}.`)
        res.render('back')
    }
}


exports.deleteArticleAdmin = async (req,res) =>{
	try{
		const article= await Article.remove({_id: req.params.id})
		console.log(article)
		req.flash('success', 'Successfully deleted article')
		res.redirect('back')
	}catch(errors){
		req.flash('error', `Unable to get delete at this time}.`)
        res.render('back')
	}
}





