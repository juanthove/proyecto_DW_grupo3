const cartModel = require("../models/cartModel");

const createCart = async (req, res) => {
    //console.log("BODY RECIBIDO:", req.body); //QUITAR DESPUES-----------------------------------------------
    try{
        //Insertar metodo de pago
        const createdPayment = await cartModel.createPayment(req.body.payment);

        //Insertar carrito
        const createdCart = await cartModel.createCart(req.body.cart, createdPayment.id);

        //Insertar productos
        for(const p of req.body.products){
            await cartModel.createCartProducts(createdCart.id, p);
        }

        if (createdPayment && createdCart) {
            res.json(createdCart);
        } else {
            res.status(500).json({ message: "Se rompió el servidor" });
        }
    } catch(error){
        res.status(500).json({ message: "Se rompió el servidor" });
    }
};

module.exports = {
  createCart
};