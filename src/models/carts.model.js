import { model, Schema } from "mongoose"

const cartCollection='cart'
const cartSchema= new Schema({
    fecha: String,
    monto: Number,
    products:{
        type: [{
            product:{
                type: Schema.Types.ObjectId,
                ref:'product'
            }
        }],
        default: []
    }
})

export const CartModel= model(cartCollection, cartSchema)