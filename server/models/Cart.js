import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userID:[{type:mongoose.Schema.Types.ObjectId, ref:"users"}],
    products:[
        {
            productID: [{type:mongoose.Schema.Types.ObjectId, ref:"products"}],
            quantity:{type:Number, required:true},
        }],
    
})

export const cartModel = mongoose.model("cart", cartSchema);