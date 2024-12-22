const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const cors = require('cors'); 
app.use(cors({ origin: 'http://localhost:4200' })); 

app.use(cors());
const SECRET_KEY = "Omkar_Warule@123";
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Admin@123',
  database: 'product',
});
app.get('/data', (req, res) => 
{
  const query = 'SELECT * FROM cet limit 5'; 
  db.query(query, (err, results) => 
    {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).send('Error fetching data');
      return;
    }
 
    res.json(results);
  });
});
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database.');
});
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.post('/api/colleges', (req, res) => {
  const { caste, percentile, branch, locations } = req.body;

  const query = `
      SELECT *,
             CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(??, '(', -1), ')', 1) AS DECIMAL(10, 5)) AS value
      FROM cet
      WHERE CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(??, '(', -1), ')', 1) AS DECIMAL(10, 5))
            BETWEEN ? AND ?
            ${branch && branch.length > 0 ? `AND branch IN (${branch.map(() => '?').join(', ')})` : ''}
            ${locations && locations.length > 0 ? `AND Location IN (${locations.map(() => '?').join(', ')})` : ''}
      ORDER BY value DESC
  `;

  // Calculate percentile limits
  const lowerLimit = percentile - 10;
  const upperLimit = percentile + 10;

  // Build the query parameters
  const queryParams = [
    caste, // First ?? placeholder for dynamic column
    caste, // Second ?? placeholder for WHERE clause
    lowerLimit, // Lower percentile limit
    upperLimit, // Upper percentile limit
    ...(branch || []), // Branch array values
    ...(locations || []), // Location array values
  ];

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});
// 1. **Signup Route**
app.post("/api/signup", (req, res) => {
  const { name, email, password, age, profile_photo_url } = req.body;

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Insert into the database
  const query = "INSERT INTO users (name, email, password, age, profile_photo_url) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [name, email, hashedPassword, age, profile_photo_url], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Email already exists" });
      }
      return res.status(500).json({ message: "Server error", error: err });
    }
    res.status(201).json({ message: "User registered successfully" });
  });
});
// 2. **Login Route**
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Compare hashed passwords
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  });
});
// 3. **Get Profile Route**
app.get("/api/profile", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    const query = "SELECT id, name, email, age, profile_photo_url FROM users WHERE id = ?";
    db.query(query, [decoded.id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Server error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(results[0]);
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
