const express = require('express');
const app = express();
// import { v4 as uuidv4 } from "uuid";
const { v4: uuidv4, validate } = require("uuid");
const Joi = require('joi');

app.use(express.json());



const product = [
    { id: 1, name: 'product1', price: 100 },
    { id: 2, name: 'product2', price: 200 },
    { id: 3, name: 'product3', price: 300 },
    { id: 4, name: 'product4', price: 400 },
    { id: 5, name: 'product5', price: 500 }
    
]


app.get('/', (req, res) => {    
    res.send('Hello World!');
});
// Get all products
app.get('/api/products', (req, res) => {
    res.json(product);
});
// Get single product
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    const products = product.find(p => p.id === parseInt(id));
    if (!products) {
        return res.status(404).json({
            message: 'Product not found'
        });      
    }
    return res.json(products);
});
// build validate function
function validateProduct(body) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        price: Joi.number().min(1).required()
    });
    return schema.validate(body);
}




// Create product
app.post('/api/products', (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

//   return res.json(result);
  // console.log(req.body);
  const { name, price } = req.body;
  // console.log(name, price);
  const newProduct = {
      // id: product.length + 1,
      id: uuidv4(),
      name,
      price
  }
  console.log(newProduct);
  product.push(newProduct);
  return res.status(200).json(newProduct);
});

// Update product
app.put('/api/products/:id', (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const { id } = req.params;
    const { name, price } = req.body;
    const products = product.find(p => p.id === parseInt(id));
    if (!products) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }
    products.name = name;
    products.price = price;
    return res.json(products);
});
//update product with patch method
// app.patch('/api/products/:id', (req, res) => {
//     const { error } = validateProduct(req.body);
//         if (error) {
//           return res.status(400).json({
//             message: error.details[0].message,
//           });
//     }
//     if (error) return res.status(400).send(error.details[0].message);
    
//     const { id } = req.params;

//     const { name, price } = req.body;
//     const products = product.find(p => p.id === parseInt(id));
//     if (!products) {
//         return res.status(404).json({
//             message: 'Product not found'
//         });
//     }
//     products.name = name;
//     products.price = price;
//     return res.json(products);
// });
//patch method
app.patch('/api/products/:id', (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    const index = product.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }
    const { name, price } = req.body;
    let updateProduct = {
        ...product[index],
        ...req.body
    }
    product[index] = updateProduct;
    return res.json(updateProduct);
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const products = product.find(p => p.id === parseInt(id));
    if (!products) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }
    const index = product.indexOf(products);
    product.splice(index, 1);
    return res.json({
        message: 'Product deleted successfully'
    });
});

//delete all product
app.delete('/api/products', (req, res) => {
    product.splice(0, product.length);
    return res.json({
        message: 'All product deleted successfully'
    });
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});