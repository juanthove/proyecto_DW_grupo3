const express = require('express');
const router = express.Router();
const categories = require('../JSON/cats/cat.json');


router.get("/:id", (req, res) => {
    const id = req.params.id; 
    const product = require(`../JSON/products/${id}.json`);
    res.send(product)
});

router.get("/cats/getAll", (req, res) => {
    res.send(categories);
});

router.get("/cats_products/:id", (req, res) => {
    const id = req.params.id;
    const products = require(`../JSON/cats_products/${id}.json`);

    res.send(products);
});

router.get("/products_comments/:id", (req, res) => {
    const id = req.params.id;
    const products_comments = require(`../JSON/products_comments/${id}.json`);

    res.send(products_comments);
});



module.exports = router;