const mongoose = require('mongoose')
const Comment = mongoose.model('Comment')


exports.addComment = async (req,res) =>{
	try{
		req.body.author = req.user._id
		req.body.article = req.params.id
		const newComment = new Comment(req.body)
		await newComment.save()
		req.flash('success', 'Comment Saved')
		res.redirect('back')
	}catch(errors){

	}
}