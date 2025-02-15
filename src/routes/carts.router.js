import { Router } from "express";
import { CartModel } from "../models/carts.model.js";
const router=Router();

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
      // Se usa populate para reemplazar el ObjectId de cada producto con el documento completo
      const cart = await CartModel.findById(cid).populate('products.product');
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  });


router.post('/', async (req, res) => {
    // Puedes enviar desde el cliente: fecha, monto y opcionalmente products (o dejarlo vacío)
    const { fecha, monto, products } = req.body;
    try {
      const newCart = new CartModel({ fecha, monto, products });
      const savedCart = await newCart.save();
      res.status(201).json({ message: "Nuevo carrito creado", cart: savedCart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear el carrito" });
    }
  });


router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
      // Buscar el carrito por su id
      let cart = await CartModel.findById(cid);
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
  
      let productInCart = cart.products.find(item => item.product.toString() === pid);
  
      if (productInCart) {
       
        productInCart.quantity += 1;
      } else {
       
        cart.products.push({ product: pid, quantity: 1 });
      }
      await cart.save();
  
      cart = await CartModel.findById(cid).populate('products.product');
      res.json({ message: "Producto agregado o actualizado en el carrito", cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al agregar el producto" });
    }
  });


  router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
  
    try {
      if (!Array.isArray(products)) {
        return res.status(400).json({ error: "El campo 'products' debe ser un arreglo." });
      }
  
      for (const item of products) {
        if (!item.product) {
          return res.status(400).json({ error: "Cada producto debe tener la propiedad 'product'." });
        }
        if (item.quantity !== undefined && typeof item.quantity !== 'number') {
          return res.status(400).json({ error: "La propiedad 'quantity' debe ser un número." });
        }
      }
  
      // Buscar el carrito por su id
      const cart = await CartModel.findById(cid);
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado." });
      }

      cart.products = products;
  
      const updatedCart = await cart.save();
  
      const populatedCart = await CartModel.findById(updatedCart._id).populate('products.product');
  
      res.status(200).json({
        message: "Carrito actualizado correctamente.",
        cart: populatedCart
      });
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      res.status(500).json({ error: "Error al actualizar el carrito." });
    }
  });

  router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body; 
  
    try {
      // Buscar el carrito por su ID
      const cart = await CartModel.findById(cid);
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
  
      const productInCart = cart.products.find(item => item.product.toString() === pid);
      if (!productInCart) {
        return res.status(404).json({ error: "Producto no encontrado en el carrito" });
      }
  
      if (typeof quantity !== 'number') {
        return res.status(400).json({ error: "La cantidad debe ser un número" });
      }
  
      productInCart.quantity = quantity;
  
      await cart.save();
  
      const updatedCart = await CartModel.findById(cid).populate('products.product');
  
      res.status(200).json({
        message: "Cantidad del producto actualizada correctamente.",
        cart: updatedCart
      });
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
      res.status(500).json({ error: "Error al actualizar la cantidad del producto." });
    }
  });


  router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
      let cart = await CartModel.findById(cid);
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
  
      const index = cart.products.findIndex(item => item.product.toString() === pid);
      if (index === -1) {
        return res.status(404).json({ error: "Producto no encontrado en el carrito" });
      }
  
      cart.products.splice(index, 1);
  
      await cart.save();

      res.status(200).json({ message: "Producto eliminado del carrito", cart });

    } catch (error) {
      console.error("Error eliminando el producto:", error);
      res.status(500).json({ error: "Error al eliminar producto del carrito" });
    }
  });


  router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
      const cart = await CartModel.findById(cid);
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      cart.products = [];
  
      await cart.save();
  
      res.status(200).json({
        message: "Todos los productos han sido eliminados del carrito.",
        cart
      });
    } catch (error) {
      console.error("Error al eliminar los productos del carrito:", error);
      res.status(500).json({ error: "Error al eliminar los productos del carrito" });
    }
  });
 export default router