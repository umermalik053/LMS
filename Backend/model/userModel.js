import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'student',
        enum:['instructor', 'student']
    },
    enrolledCourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        default:[]
}],
photoURL:{
    type:String,
    default: ''
}


},{timestamps:true})

export const userModel =  mongoose.model('User',userSchema)