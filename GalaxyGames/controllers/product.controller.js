const Product = require('../models/product.model');

class ProductController {
    // Para Clientes y Administradores
    static async getAll(req, res) {
        try {
            const products = await Product.find({ stock: { $gt: 0 } }); // Solo muestra con stock a clientes
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener productos' });
        }
    }

    // Para Administradores (Dar de alta)
    static async create(req, res) {
        try {
            const newProduct = new Product(req.body);
            await newProduct.save();
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(400).json({ error: 'Error al crear producto' });
        }
    }

    // Para Administradores (Actualizar inventario)
    static async updateStock(req, res) {
        try {
            const { id } = req.params;
            const { stock } = req.body;
            const updatedProduct = await Product.findByIdAndUpdate(id, { stock }, { new: true });
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(400).json({ error: 'Error al actualizar inventario' });
        }
    }

    // Para Administradores (Dar de baja)
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await Product.findByIdAndDelete(id);
            res.status(200).json({ message: 'Producto eliminado' });
        } catch (error) {
            res.status(400).json({ error: 'Error al eliminar producto' });
        }
    }
}

module.exports = ProductController;