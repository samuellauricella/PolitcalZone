var express = require('express');
var router = express.Router();
const blogsController = require('../controllers/blogsController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const {catchErrors} = require('../handlers/errorHandlers')

/* GET home page. */
router.get('/', blogsController.getArticles)

// Articles Page
router.get('/articles', blogsController.getArticlesByTag)

// Not sure if i need this route
router.get('/articles/:tag', blogsController.getArticlesByTag)



// Add article page
router.get('/add',
	authController.isLoggedIn,
	blogsController.addArticle)

// Adding an article
router.post('/add',
	blogsController.upload, 
	blogsController.resize, 
	blogsController.createArticle)


// Updating article
router.post('/add/:id', 
	blogsController.upload, 
	blogsController.resize, 
	blogsController.updateArticle)

// Edit page for individual article
router.get('/:id/edit', blogsController.editArticle)

// Getting individual article
router.get('/article/:slug', blogsController.getArticleBySlug)

// Login and Register Forms
router.get('/login', userController.loginForm)
router.post('/login', authController.login)
router.get('/register', userController.registerForm)

// 1.validate registration data
// 2. Register user
// 3. Login

// Saving user
router.post('/register', 
	userController.validateRegister,
	userController.register,
	authController.login )

// Logout 
router.get('/logout', authController.logout)

// Viewing account page
router.get('/account',
	authController.isLoggedIn,
	userController.account)


// Update Account
router.post('/account', userController.updateAccount)


// Reset Password
router.post('/account/forgot', authController.forgot)
router.get('/account/reset/:token', authController.reset)
router.post('/account/reset/:token',
	authController.confirmedPasswords,
	authController.update
	)

module.exports = router;
