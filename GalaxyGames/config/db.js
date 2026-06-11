const mongoose = require('mongoose');
const User = require('../models/user.model');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/galaxygames', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB conectado a Galaxy Games');

        // Crear administrador por defecto si no existe
        const adminExists = await User.findOne({ role: 'Administrador' });
        if (!adminExists) {
            await User.create({
                username: 'admin',
                password: 'adminpassword123',
                role: 'Administrador'
            });
            console.log('Administrador por defecto creado (Usuario: admin, Contraseña: adminpassword123)');
        }
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;