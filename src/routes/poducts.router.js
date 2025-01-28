
import {Router} from 'express'
import fs from 'fs/promises'
import crypto from 'crypto'
import { ProductModel } from '../models/products.model.js'

const router= Router();


router.get('/', async (req, res)=>{
    const query= req.query
    const sorted ={
        'asc': {price: 1},
        'des':{price: -1},
    }
    const filter = {};
    if (query.category) {
        filter.category = query.category; // Filtrar por categoría
    }
    if (query.available) {
        filter.status = query.available === 'true'; // Filtrar por disponibilidad usando "status"
    }
    const opcion ={
        limit: query.limit || 10,
        page: query.page || 1,
        sort: query.sort ? sorted[query.sort]: {}
    }
    
    try {
        const result= await ProductModel.paginate(filter, opcion)
        const response={
            count: result.totalDocs,
            payload: result.docs,
            totalPages: result.Pages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage? `/api/products?page=${result.prevPage}&limit=${opcion.limit}${query.sort ? '&sort=' + query.sort : ''}`: null,
            nextLink: result.hasNextPage? `/api/products?page=${result.nextPage}&limit=${opcion.limit}${query.sort ? '&sort=' + query.sort : ''}`: null
        }
        res.json({ response })
       } catch (error) {
        console.log('Error en lectura del archivo', error);
    }
});

router.get('/:pid', async (req,res)=>{
    const productId=req.params.pid;
    try {
        const data= await fs.readFile(rutaProducts, 'utf8')
        const listaDeProductos= JSON.parse(data);
        console.log(listaDeProductos);
        const product= listaDeProductos.find( prod=> prod.id===productId)
        if (product) {
            res.status(200).send(product)
        }else{
            res.status(404).send('Producto no encontrado');
        }

    } catch (error) {
        console.error('Error al leer el archivo de productos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
        }
    
});


router.post('/', async (req,res)=>{
    let {title, description, code , price ,status, stock , category}= req.body;
    const newProduct={
        id: crypto.randomBytes(10).toString('hex'),
        ...req.body
    }
   try {
        const data= await fs.readFile(rutaProducts, 'utf8');
        const productos= JSON.parse(data)
        productos.push(newProduct)
        await fs.writeFile(rutaProducts, JSON.stringify(productos))
        res.status(201).send(`Producto nuevo creado con el id ${newProduct.id}`)
    
   } catch (error) {
        res.status(500).send('Error al crear producto')
   }
});


router.put('/:pid', async (req,res)=>{

    const productId= req.params.pid;
    let {title, description, code , price ,status, stock , category}= req.body;
    try {
        const data= await fs.readFile(rutaProducts, 'utf8');
        const productos= JSON.parse(data)
        const indice= productos.findIndex(prod=>prod.id===productId)
        if (indice!= -1) {
            productos[indice].title=title;
            productos[indice].description=description;
            productos[indice].code=code;
            productos[indice].price=price;
            productos[indice].status=status;
            productos[indice].stock=stock;
            productos[indice].category=category;
        }
        await fs.writeFile(rutaProducts, JSON.stringify(productos))
        res.status(200).send(`Producto actualizado correcatamente`)

    } catch (error) {
        res.status(500).send('Error al actualizar producto')
    }


})

router.delete('/:pid', async (req,res)=>{
    const productId=req.params.pid
    try {
        const data= await fs.readFile(rutaProducts, 'utf8');
        const productos= JSON.parse(data)
        const indice= productos.findIndex(prod=>prod.id===productId)
        if(indice != -1){
            productos.splice(indice, 1)
            await fs.writeFile(rutaProducts, JSON.stringify(productos))
            res.status(200).send('Producto eliminado correctamente')
        }else{
            res.status(404).send('El producto no existe');
        }
        
    } catch (error) {
        res.status(500).send('Error al elimina el producto')
    }
})

export default router
