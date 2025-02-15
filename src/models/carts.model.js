import { model, Schema } from "mongoose"

const cartCollection='carts'
const cartSchema= new Schema({
    fecha: String,
    monto: Number,
    products:{
        type: [{
            product:{
                type: Schema.Types.ObjectId,
                ref:'product'
            },
            quantity: { 
                type: Number, 
                default: 1 
            },
        }],
        default: []
    }
})

export const CartModel= model(cartCollection, cartSchema)