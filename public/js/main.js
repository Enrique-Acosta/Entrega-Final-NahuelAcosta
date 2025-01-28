const socket= io()

socket.on('connect', () => {
    console.log('Conectado al servidor con ID:', socket.id);
});

const productsList = document.getElementById('productsList'); 
const addProductForm = document.getElementById('addProductForm'); 
const productNameInput = document.getElementById('productName');
// Agregar producto
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const productTitle = productNameInput.value.trim();
    if (productTitle) {
        socket.emit('addProduct', { title: productTitle }); 
        productNameInput.value = ''; 
    }
});

//Eliminar producto
function deleteProduct(id) {
    socket.emit('deleteProduct', id); 
}


socket.on('updateProducts', (products) => {
    productsList.innerHTML = ''; 
    products.forEach((product) => {
        const productItem = document.createElement('li');
        productItem.textContent = `${product.title} (ID: ${product.id})`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = () => deleteProduct(product.id);

        productItem.appendChild(deleteButton);
        productsList.appendChild(productItem);
    });
});