const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const TEST_SERVER_BASE_URL = 'http://20.244.56.144/test';
app.get('/categories/:categoryname/products', async (req, res) => {
    const { categoryname } = req.params;
    const { top, minPrice, maxPrice, page = 1, sort } = req.query;

    try {
        const url = `${TEST_SERVER_BASE_URL}/companies/AMZ/categories/${categoryname}/products`;
        const params = {
            top,
            minPrice,
            maxPrice,
            page,
            sort
        };
        const response = await axios.get(url, { params });

        const products = response.data.map((product, index) => ({
            id: `${categoryname}_${index + 1}`, 
            productName: product.productName,
            price: product.price,
            rating: product.rating,
            discount: product.discount,
            availability: product.availability
        }));

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/categories/:categoryname/products/:productid', async (req, res) => {
    const { categoryname, productid } = req.params;

    try {
        const [category, index] = productid.split('_');
        const url = `${TEST_SERVER_BASE_URL}/companies/AMZ/categories/${category}/products`;
        const response = await axios.get(url);

        const product = response.data[index - 1]; 
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const detailedProduct = {
            id: productid,
            productName: product.productName,
            price: product.price,
            rating: product.rating,
            discount: product.discount,
            availability: product.availability
        };

        res.json(detailedProduct);
    } catch (error) {
        console.error('Error fetching product details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
