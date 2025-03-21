import mongoose from 'mongoose';


const coursePurchaseSchema = new mongoose.Schema({
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{  
        type:String,
        enum:['pending', 'completed', 'cancelled'],
        default:'pending'
    },                                                                                              
    purchaseDate:{
        type:Date,
        default:Date.now
    },
    amount:{
        type:Number,
        required:true
    },
    paymentId:{
        type:String,
        required:true
    }
},{timestamps:true});

export const CoursePurchase = mongoose.model('CoursePurchase', coursePurchaseSchema);






