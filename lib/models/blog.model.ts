import {Schema, model, models} from "mongoose"

const BlogSchema = new Schema({
    title: { type: String, required: true, unique: true},
    slug: { type: String, required: true},
    userId : { type : String},
    body: { type: String},
    author: { type:String},
    metaDescription: {type: String},
    published: {type: Boolean},
    bodyImages: { type: [String]},
    featuredImage: { type: Object},
    categories: {type: [String]},
    categorySlug: {type: String},
    tags: {type: [String]}
  }
  ,{
    timestamps: true
  })
  
  const Blog = models.Blog || model("Blog", BlogSchema)

  export default Blog
  