const express = require('express');
const router = express.Router();

//Importo el controlador de cart
const cartController = require("../controllers/cartController");

router.get("/", (req, res) => {
    res.send("Carts OK")
});

router.post("/", cartController.createCart);

module.exports = router;