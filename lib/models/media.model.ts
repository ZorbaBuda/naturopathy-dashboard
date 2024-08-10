import {Schema, model, models} from 'mongoose'


const MediaSchema = new Schema({

    imageId : {type : String, required: true},
    imageUrl : {type : String, required: true},
    imageTitle : {type : String, required: true},
    altText : {type : String, required: true},
    userId: {type: String, required: true}
}, {
    timestamps: true
})

const Media  = models.Media || model('Media', MediaSchema);

export default Media;