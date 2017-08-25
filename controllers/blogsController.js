// Make middleware to push blog content to homepage
const mongoose = require('mongoose')
const Article = mongoose.model('Article')

///form for both adding and editing//////
exports.addArticle = (req, res)=>{
    res.render('editArticle', { title: 'Add Article'})
}

//////// Saving article/////////
exports.createArticle = async (req, res)=>{
        try{
            const article = await (new Article(req.body)).save()
            req.flash('success', `Successfully created ${article.name}`)
            res.redirect(`/article/${article.slug}`)
        }catch(error){
            throw error
        }
};

//////////////// AKA HOME PAGE///////////
exports.getArticles = async (req, res) =>{
    try{
       const articles = await Article.find();
       console.log(articles)
        res.render('index',{articles})
    } catch (error){
        throw error
    }
}