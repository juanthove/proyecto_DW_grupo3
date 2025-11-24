const express = require('express');
const router = express.Router();

//Importo el controlador de producto
const productsController = require("../controllers/productsController");

router.get("/:id", productsController.getProductsById);

router.get("/cats/getAll", productsController.getCategories);

router.get("/cats_products/:id", productsController.getProductsByCategory);

router.get("/products_comments/:id", productsController.getComentsByProduct);



module.exports = router;