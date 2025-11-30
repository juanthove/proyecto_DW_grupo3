//Importo la base de datos
const pool = require("./dbservice.js");

const createPayment = async (payment) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const response = await conn.query(
      `INSERT INTO payment_method (type) VALUE(?)`,
      [payment.type]
    );

    const paymentId = parseInt(response.insertId);

    if(payment.type === "Tarjeta"){
        const methodCard = await conn.query(
            `INSERT INTO card_payment (id, number, name_lastname, expiration, cvv, installments) VALUE(?, ?, ?, ?, ?, ?)`,
            [paymentId, payment.number, payment.name_lastname, payment.expiration, payment.cvv, payment.installments]
        ); 
    }else{
        const methodTransfer = await conn.query(
            `INSERT INTO transfer_payment (id, image) VALUE(?, ?)`,
            [paymentId, payment.image]
        ); 
    }

    return { id: paymentId, ...payment };
  } catch (error) {
    console.log(error);
  } finally {
    if (conn) conn.release(); //release to pool
  }
  return false;
};

const createCart = async (cart, paymentId) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const response = await conn.query(
      `INSERT INTO cart(fee, department, city, street, street_number, corner, additional_comments, total_price, user_id, payment_method_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [cart.fee, cart.department, cart.city, cart.street, cart.street_number, cart.corner, cart.additional_comments, cart.total_price, 32, paymentId]
    );

    return { id: parseInt(response.insertId), ...cart };
  } catch (error) {
    console.log(error);
  } finally {
    if (conn) conn.release(); //release to pool
  }
  return false;
};

const createCartProducts = async (cartId, cartProducts) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const response = await conn.query(
      `INSERT INTO cart_products(cart_id, product_id, quantity) VALUES(?, ?, ?)`,
      [cartId, cartProducts.product_id, cartProducts.quantity]
    );

    return { id: parseInt(response.insertId), ...cartProducts };
  } catch (error) {
    console.log(error);
  } finally {
    if (conn) conn.release(); //release to pool
  }
  return false;
};


module.exports = {
    createPayment,
    createCart,
    createCartProducts
};