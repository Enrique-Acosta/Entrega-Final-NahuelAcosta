
 import path from 'path' 
 import fs from 'node:fs'
 import __dirname from '../utils.js'
 import crypto from 'crypto';

 class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    // Obtener todos los productos
    async getAll() {
        try {
            const response = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(response);
        } catch (error) {
            console.error('Error al leer el archivo:', error);
            return [];
        }
    }

    // Agregar un producto
    async addProduct(product) {
        
        const newProduct = {
            ...product,
            id: crypto.randomBytes(10).toString('hex') 
        };
        const products = await this.getAll();
        products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct; 
    }

    // Eliminar un producto por ID
    async deleteProduct(id) {
        try {
            const products = await this.getAll();
            const updatedProducts = products.filter(product => product.id !== id); 
            if (products.length === updatedProducts.length) {
                console.error('Producto no encontrado');
                return null;
            }
            await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts, null, 2));
            return id; 
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    }
}

const prods = new ProductManager(path.join(__dirname, 'src', 'products.json'));

export default prods;