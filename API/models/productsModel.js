//Importo la base de datos
const pool = require("./dbservice.js");

const getProductsById = async (id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rowsProduct = await conn.query(
      "SELECT p.id, p.name, p.description, p.cost, p.currency, p.sold_count, c.`name` AS category, GROUP_CONCAT(pi.url ORDER BY pi.id SEPARATOR ',') AS images FROM product p JOIN category c ON p.category_id = c.id LEFT JOIN product_images pi ON pi.product_id = p.id WHERE p.id = ? GROUP BY p.id, p.name, p.description, p.cost, p.currency, p.sold_count, category;",
      [id]
    );

    const rowsRelated = await conn.query(
      "SELECT rp.product_id_related AS id, p.name, pi.url AS image FROM related_products rp JOIN product p ON rp.product_id_related = p.id LEFT JOIN product_images pi ON pi.product_id = p.id WHERE rp.product_id_base = ? GROUP BY rp.product_id_related;",
      [id]
    );

    const product = {
        id: rowsProduct[0].id,
        name: rowsProduct[0].name,
        description: rowsProduct[0].description,
        cost: rowsProduct[0].cost,
        currency: rowsProduct[0].currency,
        sold_count: rowsProduct[0].sold_count,
        category: rowsProduct[0].category,
        images: rowsProduct[0].images ? rowsProduct[0].images.split(',') : [],
        relatedProducts: rowsRelated
    };
    
    return product;
  } catch (error) {
    console.log(error);
  } finally {
    if (conn) conn.release(); //release to pool
  }
  return false;
};

const getCategories = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT id, name, description, product_count, imgSrc FROM category;"
    );

    return rows;
  } catch (error) {
  } finally {
    if (conn) conn.release(); //release to pool
  }
  return false;
};

const getProductsByCategory = async (id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rowsCategory = await conn.query(
      "SELECT id, name FROM category WHERE id=?;",
      [id]
    );

    const rowsProductsCategory = await conn.query(
      "SELECT p.id, p.name, p.description, p.cost, p.currency, p.sold_count, pi.url AS image FROM product p  LEFT JOIN product_images pi ON pi.product_id = p.id WHERE p.category_id=? GROUP BY p.id;",
      [id]
    );

    const category = {
        id: rowsCategory[0].id,
        name: rowsCategory[0].name,
        products: rowsProductsCategory
    };

    return category;
  } catch (error) {
    console.log(error);
  } finally {
    if (conn) conn.release(); //release to pool
  }
  return false;
};

const getComentsByProduct = async (id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT c.product_id, c.score, c.description, u.user, dateTime FROM comments c JOIN user u ON c.user_id = u.id WHERE product_id=?;",
      [id]
    );

    return rows;
  } catch (error) {
    console.log(error);
  } finally {
    if (conn) conn.release(); //release to pool
  }
  return false;
};


module.exports = {
    getProductsById,
    getCategories,
    getProductsByCategory,
    getComentsByProduct
};