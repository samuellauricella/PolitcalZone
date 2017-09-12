// Make middleware to push blog content to homepage
const mongoose = require('mongoose')
const Article = mongoose.model('Article')
const multer = require('multer')
const jimp = require('jimp')
const uuid = require('uuid')
const slug = require('slug')
const cheerio = require('cheerio')
const pug = require('pug')

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter: function(req, file, next){
        const isPhoto = file.mimetype.startsWith('image/')
        if(isPhoto){
            return next(null,true)
        }else{
            return next({message: 'That filetype is not allowed'}, false)
        }
    }
}


exports.homePage = (req,res) => {
    res.render('index', { success: req.flash('success'), title:'The Political Zone' })
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
        return next()
    }catch(error){
        return error
    }
}

exports.createArticle = async (req, res) => {
        try{
            req.body.author = req.user._id
            const article = await (new Article(req.body)).save()
            req.flash('success', `Successfully created article`)
            res.redirect(`/article/${article.slug}`)
        }catch(error){
            req.flash('error', `Unable to create ${article.name}.`)
            res.render('back')
            return error
        }
};

///HOMEPAGE ARTICLES
exports.getArticles = async (req, res) => {
    try{
       const articles = await Article.find();
        res.render('index',{articles})
    } catch (error){
        req.flash('error', `Unable to get articles at this time}.`)
        res.render('back')
        return error
    }
}

// ARTICLES PAGE
exports.getArticlesByTag = async (req,res)=>{
    try{
        const tag = req.params.tag
        const tagQuery = tag || { $exists: true}
        const tagsPromise = await Article.getTagsList()
        const articlesPromise = Article.find({tags:tagQuery})

        const [tags, articles] = await Promise.all([tagsPromise, articlesPromise])
        res.render('articles', {tags, title: 'The Political Zone', tag,articles})
    }catch(error){
        req.flash('error', `Unable to get articles at this time}.`)
        res.render('back')
        return error
    }
}

// ARTICLES EDIT

const confirmOwner = (article, user) =>{
    if(!article.author.equals(user._id) && user && user.authLevel !=1  ){
        throw Error('You must be the owner of this article to edit it')
    }
}
exports.editArticle = async (req, res) => {
    try{
        const article = await Article.findOne({_id:req.params.id})
        confirmOwner(article, req.user)
        res.render('editArticle', {title: `Edit ${article.name}`, article})
    }catch(error){
         req.flash('error', 'Unable to edit article, Please make sure you are the owner of this article')
         res.redirect('back')
    }
}

// ARTICLES UPDATE
exports.updateArticle = async (req,res) => {
    try{
        
        const updates = {
            name: req.body.name,
            description: req.body.description,
            content: req.body.content,
            tags: req.body.tags,
            slug: slug(req.body.name),
            photo: req.body.photo
        }
        const article= await Article.findOneAndUpdate({_id: req.params.id}, {$set: updates},{
            new: true,
            runValidators: true,
            context: 'query'
        }).exec()

        req.flash('success', `Successfully updated ${article.name}. <a href="/article/${article.slug}"> View Article</a>`)

        res.redirect(`/${article._id}/edit`)
    }catch(error){
        console.log(error)
         req.flash('error', 'Unable to update article')
         res.render('back')
    }
}

// INDI ARTICLE PAGE
exports.getArticleBySlug = async (req, res, next) =>{
    const article = await Article.findOne({slug: req.params.slug}).populate('author')

    if(!article) return next()

    res.render('article', {article, title: article.name})
}



exports.searchArticles = async(req,res)=>{
    try{
    const articles = await Article
    .find({
        $text: {
            $search: req.query.q
        }
    }, {
        score: { $meta: 'textScore'}
    })
    .sort({
        score: {$meta: 'textScore'}
    })
    res.json(articles)
    }catch(errors){
        throw Error
    }
}
