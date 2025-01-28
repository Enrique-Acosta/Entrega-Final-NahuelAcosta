import { model, Schema } from "mongoose"
import Paginate from 'mongoose-paginate-v2'
const productsCollection='product'
const productSchema= new Schema({
    title: String,
    description: String,
    code:String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String
})
productSchema.plugin(Paginate)
export const ProductModel= model(productsCollection, productSchema)
