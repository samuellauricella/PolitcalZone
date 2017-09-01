// Make middleware to push blog content to homepage
const mongoose = require('mongoose')
const Article = mongoose.model('Article')
const multer = require('multer')
const jimp = require('jimp')
const uuid = require('uuid')


const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter: function(req, file, next){
        const isPhoto = file.mimetype.startsWith('image/')
        if(isPhoto){
            next(null,true)
        }else{
            next({message: 'That filetype is not allowed'}, false)
        }
    }
}


exports.homePage = (req,res) => {
    console.log('Home page')
    res.render('index', { success: req.flash('success') })
}

exports.addArticle = (req, res) => {
    res.render('editArticle', { title: 'Add Article'})
}

exports.upload = multer(multerOptions).single('photo')

exports.resize = async (req, res, next) => {
    try{
        if(!req.file){
            next();
            return
        }
        const extension = req.file.mimetype.split('/')[1]
        req.body.photo = `${uuid.v4()}.${extension}`
        const photo = await jimp.read(req.file.buffer)
        await photo.resize(800, jimp.AUTO)
        await photo.write(`./public/uploads/${req.body.photo}`)
        next()
    }catch(error){
        throw error
    }
}

exports.createArticle = async (req, res) => {
        try{
            const article = await (new Article(req.body)).save()
            req.flash('success', `Successfully created article`)
            res.redirect(`/article/${article.slug}`)
            // res.redirect('/')
        }catch(error){
            throw error
        }
};

exports.getArticles = async (req, res) => {
    try{
       const articles = await Article.find();
       console.log(articles)
        res.render('index',{articles})
    } catch (error){
        throw error
    }
}

exports.getRepublican = async (req, res) => {
    try{
       const articles = await Article.find();
       console.log(articles)
        res.render('republican',{articles})
    } catch (error){
        throw error
    }
}

exports.editArticle = async (req, res) => {
    try{
        const article = await Article.findOne({_id:req.params.id})
        res.render('editArticle', {title: `Edit ${article.name}`, article})
    }catch(error){
        throw error
    }
}

exports.updateArticle = async (req,res) => {
    try{
        const article = await Article.findOneAndUpdate({_id: req.params.id},req.body, {
            new: true,
            runValidators: true
        }).exec()
        req.flash('success', `Successfully updated ${article.name}. <a href="/${article.slug}"> View Article</a>`)
        res.redirect(`/${article._id}/edit`)
    }catch(error){
        throw error
    }
}

exports.getArticleBySlug = async (req, res, next) =>{
    const article = await Article.findOne({slug: req.params.slug})
    if(!article) return next()
    res.render('article', {article, title: article.name})
}