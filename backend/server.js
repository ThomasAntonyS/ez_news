const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const axios = require('axios')
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const allowedOrigins = [
  "http://localhost:5173",
  "https://eznews-site.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error("CORS policy does not allow this origin"), false);
      }
  },
  credentials: true
}));

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_host,
  user: process.env.DB_user,
  password: process.env.DB_password,
  database: 'ez_news',
  port: process.env.DB_port,
  waitForConnections: true,
  queueLimit: 0,
  idleTimeout: 30000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

async function initializeDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('SELECT 1 + 1 AS solution');
    console.log("Aiven MySQL Pool: Successfully connected and tested.");
  } catch (error) {
    console.error('Aiven MySQL Pool: Initial connection test failed!');
    console.error('Details:', error);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

initializeDatabase();

app.get("/category/:category", async (req, res) => {
  const category = req.params.category;
  const API_KEY = process.env.API_KEY
  const getCategoryQuery = `
    SELECT category_data, entry_time
    FROM data_table
    WHERE category = ?
  `;
  const insertOrUpdateQuery = `
    INSERT INTO data_table (category, category_data, entry_time)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
        category_data = VALUES(category_data),
        entry_time = VALUES(entry_time)
  `;
  let connection;
  try {
      connection = await pool.getConnection();
      const [rows] = await connection.query(getCategoryQuery, [category]);
      const now = new Date();
      if (rows.length > 0) {
        const { category_data, entry_time } = rows[0];
        const storedEntryTime = new Date(entry_time);  
        const storedEntryTimeUTC_ms = storedEntryTime.getTime(); 
        const nowUTC_ms = now.getTime(); 
        const hoursDiff = (nowUTC_ms - storedEntryTimeUTC_ms) / (1000 * 60 * 60);
        if (hoursDiff < 3) {
          return res.json(category_data); 
        }
      }

      const apiUrl = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&apikey=${API_KEY}`;
      const apiResponse = await axios.get(apiUrl);
      const freshData = apiResponse.data;
      const currentTimeForDB = new Date().toISOString();
      await connection.query(insertOrUpdateQuery, [category, JSON.stringify(freshData), currentTimeForDB]);
      res.json(freshData);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
})

app.get("/category/top-headlines", async (req, res) => {
  const category = "top-headlines";
  const API_KEY = process.env.API_KEY;
  const getCategoryQuery = `
    SELECT category_data, entry_time
    FROM data_table
    WHERE category = ?
  `;
  const insertOrUpdateQuery = `
    INSERT INTO data_table (category, category_data, entry_time)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
        category_data = VALUES(category_data),
        entry_time = VALUES(entry_time)
  `;
  let connection;
  try {
      connection = await pool.getConnection();
      const [rows] = await connection.query(getCategoryQuery, [category]);
      const now = new Date();
      if (rows.length > 0) {
        const { category_data, entry_time } = rows[0];
        const storedEntryTime = new Date(entry_time);
        const nowUTC_ms = now.getTime();
        const storedEntryTimeUTC_ms = storedEntryTime.getTime();
        const hoursDiff = (nowUTC_ms - storedEntryTimeUTC_ms) / (1000 * 60 * 60);
        if (hoursDiff < 3) {
          return res.json(category_data);
        }
      }
    const apiUrl = `https://gnews.io/api/v4/top-headlines?lang=en&max=10&apikey=${API_KEY}`;
    const apiResponse = await axios.get(apiUrl);
    const freshData = apiResponse.data;
    const currentTimeForDB = new Date().toISOString();
    await connection.query(insertOrUpdateQuery, [category, JSON.stringify(freshData), currentTimeForDB]);
    res.json(freshData);
  } catch (error) {
    console.error("Error fetching top headlines:", error);
    res.status(500).json(null);
  } finally {
    if (connection) connection.release();
  }
});

app.get("/search/:query", async (req, res) => {
  const query = req.params.query;
  const API_KEY = process.env.API_KEY;

  const cacheKey = `search-${query}`; 
  const getSearchQuery = `
      SELECT category_data, entry_time
      FROM data_table
      WHERE category = ?
  `;
  const insertOrUpdateQuery = `
      INSERT INTO data_table (category, category_data, entry_time)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
          category_data = VALUES(category_data),
          entry_time = VALUES(entry_time)
  `;
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(getSearchQuery, [cacheKey]);
    const now = new Date(); 
    if (rows.length > 0) {
      const { category_data, entry_time } = rows[0];
      const storedEntryTime = new Date(entry_time);
      const nowUTC_ms = now.getTime();
      const storedEntryTimeUTC_ms = storedEntryTime.getTime();
      const hoursDiff = (nowUTC_ms - storedEntryTimeUTC_ms) / (1000 * 60 * 60);
      if (hoursDiff < 3) {
        return res.json(category_data);
      }
    }

    const apiUrl = `https://gnews.io/api/v4/search?q=${query}&lang=en&in=title&apikey=${API_KEY}`;
    const apiResponse = await axios.get(apiUrl);
    const freshData = apiResponse.data;
    const currentTimeForDB = new Date().toISOString();
    await connection.query(insertOrUpdateQuery, [cacheKey, JSON.stringify(freshData), currentTimeForDB]);
    res.json(freshData);
  } catch (error){
    console.error("Error fetching search results:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
   finally {
    if (connection) connection.release();
  }
});


app.get("/", async (req, res) => {
  res.send("Welcome to ez news backend.")
});

if (process.env.NODE_ENV !== "production") {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;