const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'palazzocle@gmail.com',
        pass: process.env.EMAIL_PASS || 'yqbw fihb jjdr tipu'
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para el formulario
app.get('/formulario', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'formulario.html'));
});

// Ruta de prueba
app.get('/test', (req, res) => {
    res.json({ 
        status: 'success',
        message: 'El servidor está funcionando correctamente.',
        timestamp: new Date().toISOString()
    });
});

// Ruta para enviar emails
app.post('/send', async (req, res) => {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
        return res.status(400).json({
            status: 'error',
            message: 'Todos los campos son requeridos'
        });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER || 'palazzocle@gmail.com',
        to: process.env.EMAIL_USER || 'palazzocle@gmail.com',
        subject: 'Nueva inscripción a la lista de espera',
        text: `Nombre: ${nombre}\nEmail: ${email}\nMensaje: ${mensaje}`,
        html: `
            <h2>Nueva inscripción a la lista de espera</h2>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensaje:</strong> ${mensaje}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({
            status: 'success',
            message: 'Email enviado correctamente'
        });
    } catch (error) {
        console.error('Error al enviar el email:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al enviar el email',
            error: error.message
        });
    }
});

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

// Para Vercel
module.exports = app;