const mongoose= require('mongoose')
const slug = require('slug')
mongoose.Promise = global.Promise



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
    photo: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author'
    },
    featured: [String]
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})


// define indexes

articleSchema.index({
    name: 'text',
    description: 'text'
})

articleSchema.pre('save', async function(next){
    try{
        this.slug = slug(this.name)

        console.log(this.slug)

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


articleSchema.statics.getFeaturesList = function(){
    return this.aggregate([
        { $unwind: '$featured'},
        { $group: {_id: '$featured', count: {$sum:1}}},
        { $sort: {count: -1}}
    ])
}


articleSchema.statics.getTagsList = function(){
    return this.aggregate([
        { $unwind: '$tags'},
        { $group: {_id: '$tags', count: {$sum:1}}},
        {$sort: {count: -1}}
    ])
}


articleSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'article'
})


module.exports = mongoose.model('Article', articleSchema)