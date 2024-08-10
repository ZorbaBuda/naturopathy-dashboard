import {Schema, model, models} from 'mongoose'



const CategorySchema = new Schema({
    categoryName: { type: String },
    slug: { type: String},
    description: { type: String},
    blogCount: { type: Number},
    userId: { type : String}
}
,{
    timestamps: true
})

const Category = models.Category || model("Category", CategorySchema)

export default Category