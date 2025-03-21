import mongoose from 'mongoose';


const courseSchema = mongoose.Schema({
   courseTitle:{
    type:String,
    required:true
   },    
   subTitle:{
    type:String,
   },
   description:{
    type:String,
   },
   category:{
    type:String,
    required:true
   },
   courseLevel:{
    type:String,
    enum:["Beginner","Medium", "Advanced"]
   },
   coursePrice:{
    type:Number,
    // required:true
   },
   courseThumbnail:{
    type:String

   },
   enrolledStudent:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
   ],
   lecture:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lecture'
    }
   ],
   creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isPublished:{
        type:Boolean,
        default:false
    }
   
  
   
    
},{timestamps:true})

export const courseModel =  mongoose.model('Course',courseSchema)