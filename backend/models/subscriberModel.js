import mongoose from "mongoose";

const subscribeSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    subscribedAt:{
        type:String,
        default:Date.now,

    }
})

const subscribe = mongoose.model("Subscriber", subscribeSchema)
export default subscribe;