const express = require('express');
const mysql2 = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fs = require('fs');
const https = require('https');
const path = require('path');

const app = express();
const port = 3000;

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

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Registrar usuario (Crear)
app.post('/register', (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = { username, password: hashedPassword, role };
    const sql = 'INSERT INTO users SET ?';

    db.query(sql, user, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send({ message: 'Usuario registrado exitosamente' });
    });
});

// Login usuario
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
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Contraseña incorrecta' });
        }

        res.send({ message: 'Logueo exitoso', user: { username: user.username, role: user.role } });
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

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
