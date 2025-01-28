import express from 'express';
import prodRouter from './routes/poducts.router.js'
import cartRouter from './routes/carts.router.js'
import __dirname from './utils.js'
import  handlebars  from 'express-handlebars';
import path from 'node:path'
// import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io';
import prods from './manager/products.js'
import { mongoConnection } from './connection/mongo.js'

const PORT=8080;
const app=express();
mongoConnection()

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname +'/public'))
//CONFIGURACION DEL MOTOR DE PLANTILLAS//
app.engine('hbs', handlebars.engine({
    extname:'hbs'
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'src', 'views') )
//-------------------------------------------------------//
// app.use('/', viewsRouter )
app.use('/api/products', prodRouter)
app.use('/api/carts', cartRouter)

const ServerHttp=  app.listen(PORT, ()=>{ console.log(`El servido se encuentra en el puerto: ${PORT}`);})
const IoServer= new Server(ServerHttp)
IoServer.on('connection', async socket=>{
    console.log('Nuevo usuario conectado', socket.id);

    prods.getAll().then((products) => {
      socket.emit('updateProducts', products);
  });

  socket.on('addProduct', async (product) => {
      await prods.addProduct(product);
      const updatedProducts = await prods.getAll();
      IoServer.emit('updateProducts', updatedProducts);
  });

  socket.on('deleteProduct', async (productId) => {
      const deletedId = await prods.deleteProduct(productId);
      if (deletedId) {
          const updatedProducts = await prods.getAll();
          IoServer.emit('updateProducts', updatedProducts); 
      } else {
          console.log(`Producto con id ${productId} no encontrado.`);
      }
  });
})
    