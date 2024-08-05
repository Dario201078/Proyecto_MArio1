const express = require('express');
const mysql2 = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fs = require('fs');
const https = require('https');
const path = require('path');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

const jwtSecret = 'tokensabrosojuasjuas';

// Configuración de SSL
const sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname, '../../../SSL/privatekey.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../../../SSL/cert.crt'))
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configurar Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Outlook',
  auth: {
    user: '201078@utags.edu.mx',
    pass: 'Darioperfil1'
  }
});

function getExpirationDate() {
  const date = new Date(Date.now() + 3600000); // Token válido por 1 hora
  return date.toISOString().slice(0, 19).replace('T', ' '); // Formato 'YYYY-MM-DD HH:MM:SS'
}

// Ruta para solicitar restablecimiento de contraseña
app.post('/forgot-password', (req, res) => {
  const { username } = req.body;
  const token = Math.random().toString(36).substring(2);
  const expirationTime = getExpirationDate();

  const sql = 'UPDATE users SET resetToken = ?, resetTokenExpires = ? WHERE username = ?';

  db.query(sql, [token, expirationTime, username], (err, result) => {
    if (err || result.affectedRows === 0) {
      console.error('Error en la consulta de actualización:', err);
      return res.status(400).send({ message: 'Usuario no encontrado' });
    }
    sendPasswordResetEmail(username, token);
    res.send({ message: 'Correo de restablecimiento de contraseña enviado' });
  });
});

// Función para enviar el correo de restablecimiento
function sendPasswordResetEmail(email, token) {
  const resetLink = `https://localhost:4200/reset-password?token=${token}&username=${email}`;

  const mailOptions = {
    from: '201078@utags.edu.mx',
    to: email,
    subject: 'Restablecimiento de contraseña',
    text: `Haz clic en este enlace para restablecer tu contraseña: ${resetLink}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error enviando el correo:', error);
    } else {
      console.log('Correo de restablecimiento enviado:', info.response);
    }
  });
}

// Ruta para restablecer la contraseña
app.post('/reset-password', (req, res) => {
  const { username, token, newPassword } = req.body;
  console.log('Solicitud para restablecer la contraseña recibida:', { username, token, newPassword });

  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  const sql = 'SELECT * FROM users WHERE username = ? AND resetToken = ? AND resetTokenExpires > ?';

  db.query(sql, [username, token, Date.now()], (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL:', err);
      return res.status(500).send({ message: 'Error del servidor.' });
    }

    if (results.length === 0) {
      console.error('Token inválido o expirado');
      return res.status(400).send({ message: 'Token inválido o expirado' });
    }

    const updateSql = 'UPDATE users SET password = ?, resetToken = NULL, resetTokenExpires = NULL WHERE username = ?';
    db.query(updateSql, [hashedPassword, username], (err, result) => {
      if (err) {
        console.error('Error al actualizar la contraseña:', err);
        return res.status(500).send({ message: 'Error del servidor.' });
      }
      console.log('Contraseña actualizada exitosamente');
      res.send({ message: 'Contraseña restablecida exitosamente' });
    });
  });
});

// Función para enviar correo de verificación
function sendVerificationEmail(email, token) {
  const verificationLink = `https://localhost:${port}/verify-email?token=${token}&email=${email}`;
  const mailOptions = {
    from: '201078@utags.edu.mx',
    to: email,
    subject: 'Verifica tu correo electrónico',
    text: `Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico: ${verificationLink}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error enviando el correo:', error);
    } else {
      console.log('Correo de verificación enviado:', info.response);
    }
  });
}

// Configurar conexión a MySQL
const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '1234',
    database: 'Proyecto_Mario1'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Registrar usuario (Crear)
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const verificationToken = Math.random().toString(36).substring(2);

  const user = { username, password: hashedPassword, isEmailVerified: false, verificationToken };
  const sql = 'INSERT INTO users SET ?';

  db.query(sql, user, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    sendVerificationEmail(username, verificationToken);
    res.status(201).send({ message: 'Usuario registrado exitosamente. Por favor, verifica tu correo electrónico.' });
  });
});

// Verificar correo electrónico
app.get('/verify-email', (req, res) => {
  const { token, email } = req.query;
  const sql = 'UPDATE users SET isEmailVerified = true, verificationToken = NULL WHERE username = ? AND verificationToken = ?';

  db.query(sql, [email, token], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(400).send({ message: 'Token de verificación inválido o expirado.' });
    }
    res.send({ message: 'Correo electrónico verificado exitosamente.' });
  });
});

// Inicio de sesión (Login)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ?';

  db.query(sql, [username], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(401).send({ message: 'Usuario no encontrado' });
    }

    const user = results[0];

    if (!user.isEmailVerified) {
      return res.status(403).send({ message: 'Correo electrónico no verificado' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Contraseña incorrecta' });
    }

    // Generar un token JWT
    const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '1h' });

    res.send({ message: 'Login exitoso', token: token, role: user.role });
  });
});

app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';

  db.query(sql, (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send(results);
  });
});

// Obtener un usuario por ID (Leer)
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM users WHERE id = ?';

  db.query(sql, [id], (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }
      if (results.length === 0) {
          return res.status(404).send({ message: 'Usuario no encontrado' });
      }
      res.send(results[0]);
  });
});

// Actualizar rol de un usuario (solo administradores)
app.put('/users/:id/role', (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).send({ message: 'Rol no válido' });
  }

  const sql = 'UPDATE users SET role = ? WHERE id = ?';

  db.query(sql, [role, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    res.send({ message: 'Rol actualizado exitosamente' });
  });
});


// Actualizar un usuario (Actualizar)
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  const sql = 'UPDATE users SET username = ? WHERE id = ?';

  db.query(sql, [username, id], (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      if (result.affectedRows === 0) {
          return res.status(404).send({ message: 'Usuario no encontrado' });
      }
      res.send({ message: 'Usuario actualizado exitosamente' });
  });
});

// Eliminar un usuario (Eliminar)
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';

  db.query(sql, [id], (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      if (result.affectedRows === 0) {
          return res.status(404).send({ message: 'Usuario no encontrado' });
      }
      res.send({ message: 'Usuario eliminado exitosamente' });
  });
});

https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Servidor corriendo en https://localhost:${port}`);
});
