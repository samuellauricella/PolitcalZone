const mongoose= require('mongoose')
mongoose.Promise = global.Promise
const slug = require('slugs')

const articleSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: 'Please enter an article name'
    },
    slug: String,
    description:{
        type: String,
        trim: true,
        required: 'Please enter an description'
    },
    content:{
        type: String,
        trim: true,
        required: 'Please enter article content'
    },
    tags: [String],
    created:{
        type: Date,
        default: Date.now
    },
    photo: String
})


articleSchema.pre('save', async function(next){

    try{
    if(!this.isModified('name')){
        next()
        return;
    }
    this.slug = slug(this.name)

    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`,'i')

    const articlesWithSlug = await this.constructor.find({slug: slugRegEx})

    if(articlesWithSlug.length){
      this.slug = `${this.slug}-${articlesWithSlug.length + 1}`
    }
    next()
    }catch(error){
        throw error
    }
})

articleSchema.statics.getTagsList = function(){
    return this.aggregate([
        { $unwind: '$tags'},
        { $group: {_id: '$tags', count: {$sum:1}}},
        { $sort: {count: -1}}
    ])
}


module.exports = mongoose.model('Article', articleSchema)