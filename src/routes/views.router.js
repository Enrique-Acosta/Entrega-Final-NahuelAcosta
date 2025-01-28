import { Router } from "express";
import fs from 'fs/promises';
 
const router= Router()


// router.get('/', async (req,res)=>{
//     const data= await fs.readFile(rutaProducts, 'utf8')
//     const products= JSON.parse(data)

//     res.render('home', {products})
// })


// router.get('/realtimeproducts', (req,res)=>{
//     res.render('realTimeProducts',{})
// })

// export default router