// Make middleware to push blog content to homepage
const mongoose = require('mongoose')
const Article = mongoose.model('Article')

//We switched this with get articles
// exports.homePage = (req,res)=>{
//     console.log('Home page')
//     res.render('index', { success: req.flash('success') })
// }

exports.addArticle = (req, res)=>{
    res.render('editArticle', { title: 'Add Article'})
}

exports.createArticle = async (req, res)=>{
        try{
            const article = await (new Article(req.body)).save()
            req.flash('success', `Successfully created ${article.name}`)
            res.redirect(`/article/${article.slug}`)
        }catch(error){
            throw error
        }
};

exports.getArticles = async (req, res) =>{
    try{
       const articles = await Article.find();
       console.log(articles)
        res.render('index',{articles})
    } catch (error){
        throw error
    }
}