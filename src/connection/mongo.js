import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config()

export const mongoConnection= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL, { dbName: 'Ecommerce'})
        console.log('Base de datos conectada');
        
    } catch (e) {
        console.log('Error al conectar con la base de datos');
        
    }
}