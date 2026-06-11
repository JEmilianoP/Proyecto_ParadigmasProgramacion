const User = require('../models/user.model');

class AuthController {
    static async register(req, res) {
        try {
            const { username, password, role } = req.body;
            const newUser = new User({ username, password, role });
            await newUser.save();
            res.status(201).json({ message: 'Usuario registrado exitosamente', role: newUser.role });
        } catch (error) {
            res.status(400).json({ error: 'Error al registrar usuario. Puede que el nombre ya exista.' });
        }
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username, password });
            
            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }
            
            res.status(200).json({ message: 'Login exitoso', role: user.role, username: user.username });
        } catch (error) {
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
}

module.exports = AuthController;