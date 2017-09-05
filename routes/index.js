var express = require('express');
var router = express.Router();
const blogsController = require('../controllers/blogsController')
const userController = require('../controllers/userController')

const {catchErrors} = require('../handlers/errorHandlers')

/* GET home page. */
router.get('/', blogsController.getArticles)


router.get('/articles', blogsController.getArticlesByTag)
router.get('/articles/:tag', blogsController.getArticlesByTag)


// This is from the example not using tags page, just articles
// router.get('/tags', blogsController.getArticlesByTag)

// router.get('/tags/:tag', blogsController.getArticlesByTag)


router.get('/add',blogsController.addArticle)


router.post('/add',
	blogsController.upload, 
	blogsController.resize, 
	blogsController.createArticle)



router.post('/add/:id', 
	blogsController.upload, 
	blogsController.resize, 
	blogsController.updateArticle)


router.get('/:id/edit', blogsController.editArticle)

router.get('/article/:slug', blogsController.getArticleBySlug)


router.get('/login', userController.loginForm)
router.get('/register', userController.registerForm)

// 1.validate registration data
// 2. Register user
// 3. Login
router.post('/register', userController.validateRegister )

module.exports = router;
