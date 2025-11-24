const productsModel = require("../models/productsModel");

const getProductsById = async (req, res) => {
  const id = parseInt(req.params.id);
  const product = await productsModel.getProductsById(id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
};

const getCategories = async (req, res) => {
  const categories = await productsModel.getCategories();
  res.json(categories);
};

const getProductsByCategory = async (req, res) => {
  const id = parseInt(req.params.id);
  const products = await productsModel.getProductsByCategory(id);
  if (products) {
    res.json(products);
  } else {
    res.status(404).json({ message: "Categoria no encontrada" });
  }
};

const getComentsByProduct = async (req, res) => {
  const id = parseInt(req.params.id);
  const comments = await productsModel.getComentsByProduct(id);
  if (comments) {
    res.json(comments);
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
};

module.exports = {
  getProductsById,
  getCategories,
  getProductsByCategory,
  getComentsByProduct
};