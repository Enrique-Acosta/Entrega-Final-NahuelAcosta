import { Router } from "express";
import fs from 'fs/promises';
import crypto from 'crypto';

const router=Router();
const rutaProducts='src/products.json'
const rutaCart='src/carts.json';

router.get('/:cid', async (req,res)=>{
    const cartId=req.params.cid
     try {
        const data= await fs.readFile(rutaCart,'utf8');
        const carts= JSON.parse(data);
        const cart= carts.find(cart=> cart.id===cartId)
        res.status(200).send(cart.products)
     } catch (error) {
        res.status(404).send('Carrito no encontrado')
     }
})


router.post('/', async (req,res)=>{
    const cartId= crypto.randomBytes(10).toString('hex');
    const {products}=req.body;
    console.log(cartId);
    
    try {
        const newCart={
            id:cartId,
            products:products 
        };
        const data= await fs.readFile(rutaCart,'utf8');
        const carts=JSON.parse(data);
        carts.push(newCart);
        //GUARDA EL NUEVO CARRITO
        await fs.writeFile(rutaCart, JSON.stringify(carts));
        res.status(201).send(`Nuevo carrito creado con el id: ${cartId}`)

        
    } catch (error) {
        res.status(500).send('Error al crear carrito')
    }

})


router.post('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;

    try {
        // Buscar el carrito seleccionado
        const dataCart = await fs.readFile(rutaCart, 'utf8');
        const carts = JSON.parse(dataCart);
        const cart = carts.find(cart => cart.id === cartId);

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');  // Comprobación si el carrito existe
        }

        // Asegúrate de que 'products' esté definido como un array
        if (!cart.products) {
            cart.products = [];
        }

        // Buscar producto seleccionado
        const dataProd = await fs.readFile(rutaProducts, 'utf8');
        const productList = JSON.parse(dataProd);
        const prod = productList.find(prod => prod.id === prodId);

        if (prod) {
            // Comprobar si el producto ya está en el carrito
            const prodInCart = cart.products.find(prod => prod.id === prodId);
            if (prodInCart) {
                // Si ya está, aumentar la cantidad
                prodInCart.quantity += 1;
                await fs.writeFile(rutaCart, JSON.stringify(carts)); // Guardar cambios
                return res.send('El producto ya estaba en el carrito. Se agregó uno más');
            } else {
                // Si no está, agregarlo al carrito
                cart.products.push({ id: prodId, quantity: 1 });
                await fs.writeFile(rutaCart, JSON.stringify(carts)); // Guardar cambios
                return res.send('Producto agregado al carrito');
            }
        } else {
            return res.status(404).send('El producto no existe');
        }
    } catch (error) {
        console.error('Error al agregar producto:', error);
        return res.status(500).send('Error al agregar producto');
    }
});

// router.post('/:cid/products/:pid', async (req, res)=>{
//     const cartId=req.params.cid;
//     const prodId=req.params.pid;
//     try {
//         //BUSCAR EL CARRITO SELECIONADO
//     const dataCart= await fs.readFile(rutaCart,'utf8');
//     const carts= JSON.parse(dataCart);
//     const cart= carts.find(cart=> cart.id===cartId)

//     if(!cart){
//         return res.status(404).send ('Carrito no encontrado')}
//     if (!cart.products){
//         cart.products=[];
//     };
//     //BUSCAR PRODUCTO SELECCIONADO
//     const dataProd= await fs.readFile(rutaProducts, 'utf8')
//     const productList= JSON.parse(dataProd)
//     const prod= productList.find(prod=>prod.id===prodId)
//     if(prod){
//         const prodInCart= cart.products.find(prod=>prod.id===prodId)
//         if(prodIncart){
//             prodInCart.quantity+=1
//             await fs.writeFile(rutaCart, JSON.stringify(carts))
//             res.send('El producto ya estaba en el carrito. Se agrego uno más')
//         }else{
//             cart.products.push({id:prodId, quantity:1})
//             await fs.writeFile(rutaCart, JSON.stringify(carts))
//             res.status(200).send('Producto agregado con exito')
//         }
        
//     }else{
//         res.status(404).send('El producto no exite')
//     }
//     } catch (error) {
//         res.status(500).send('Error al agregar producto')
//     }
    
// })



 export default router