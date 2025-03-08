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


app.post('/api/jee', (req, res) => {
  const { percentile, branch, locations } = req.body;

  const query = `
      SELECT *, 
             CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(Percentile, '(', -1), ')', 1) AS DECIMAL(10,5)) AS extracted_percentile
      FROM jee
      WHERE CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(Percentile, '(', -1), ')', 1) AS DECIMAL(10,5))
            BETWEEN ? AND ?
            ${branch && branch.length > 0 ? `AND Branch IN (${branch.map(() => '?').join(', ')})` : ''}
            ${locations && locations.length > 0 ? `AND Location IN (${locations.map(() => '?').join(', ')})` : ''}
      ORDER BY extracted_percentile DESC
  `;

  const lowerLimit = percentile - 10;
  const upperLimit = percentile + 10;
  const queryParams = [
      lowerLimit,
      upperLimit,
      ...(branch || []),
      ...(locations || []),
  ];

  console.log('Generated Query:', query);
  console.log('Query Parameters:', queryParams);

  db.query(query, queryParams, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Server error');
      } else {
          res.json(results);
      }
  });
});


app.post('/api/colleges', (req, res) => {
  const { caste, percentile, branch, locations, minority } = req.body;

  // Determine lower and upper limits based on percentile range
  let lowerLimit, upperLimit;

  if (percentile >= 94 && percentile <= 100) {
    lowerLimit = 89;
    upperLimit = 100;
  } else if (percentile >= 88 && percentile <= 93) {
    lowerLimit = percentile - 20;
    upperLimit = percentile + 20;
  } else if (percentile >= 75 && percentile <= 87) {
    lowerLimit = percentile - 25;
    upperLimit = percentile + 25;
  } else if (percentile >= 60 && percentile < 75) {
    lowerLimit = percentile - 30;
    upperLimit = percentile + 30;
  } else {
    lowerLimit = 0;
    upperLimit = 60;
  }

  const query = `
    SELECT *,
           CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(??, '(', -1), ')', 1) AS DECIMAL(10, 5)) AS value
    FROM cet
    WHERE CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(??, '(', -1), ')', 1) AS DECIMAL(10, 5))
          BETWEEN ? AND ?
          ${branch && branch.length > 0 ? `AND branch IN (${branch.map(() => '?').join(', ')})` : ''}
          ${locations && locations.length > 0 ? `AND Location IN (${locations.map(() => '?').join(', ')})` : ''}
          ${minority && minority.length > 0 ? `AND Minority IN (${minority.map(() => '?').join(', ')}) AND Minority != ''` : ''}
    ORDER BY value DESC
  `;

  const queryParams = [
    caste, // First ?? placeholder for dynamic column
    caste, // Second ?? placeholder for WHERE clause
    lowerLimit, // Lower percentile limit
    upperLimit, // Upper percentile limit
    ...(branch || []), // Branch array values
    ...(locations || []), // Location array values
    ...(minority || []), // Minority array values
  ];

  console.log('Generated Query:', query);
  console.log('Query Parameters:', queryParams);

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
  const { name, email, password, age, city, profile_picture, mhtcet_percentile, jee_percentile, cast_category, minority } = req.body;
  console.log('Received data:', req.body);

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Insert into the database
  const query = "INSERT INTO users (name, email, password, age, city, profile_picture, mhtcet_percentile, jee_percentile, cast_category, minority) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(query, [name, email, hashedPassword, age, city, profile_picture, mhtcet_percentile, jee_percentile, cast_category, minority], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Email already exists" });
      }
      return res.status(500).json({ message: "Server error", error: err });
    }

    // Generate JWT token
    const token = jwt.sign({ id: result.insertId, email }, SECRET_KEY, { expiresIn: "1h" });

    res.status(201).json({ message: "User registered successfully", token });
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



app.get("/api/profile", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token
  console.log("Received token:", token); // ✅ Check if token is received

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "Omkar_Warule@123"); // Verify token
    console.log("Decoded Token:", decoded); // ✅ Check decoded data

    const query = "SELECT id, name, email, age, city, profile_picture, mhtcet_percentile, jee_percentile, cast_category, minority FROM users WHERE id = ?";
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
    console.log("JWT Verification Error:", error); // ✅ Log if verification fails
    res.status(401).json({ message: "Invalid token" });
  }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
