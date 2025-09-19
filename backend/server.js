const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

const getAndCacheData = async (res, cacheKey, apiUrl) => {
  const getQuery = `
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
  const REFRESH_INTERVAL = 4 * 60 * 60 * 1000; 

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(getQuery, [cacheKey]);
    const now = new Date();

    if (rows.length > 0) {
      const { category_data, entry_time } = rows[0];
      const storedEntryTime = new Date(entry_time);
      const hoursDiff = (now.getTime() - storedEntryTime.getTime());

      if (hoursDiff < REFRESH_INTERVAL) {
        return res.json(category_data);
      }
    }

    const apiResponse = await axios.get(apiUrl);
    const freshData = apiResponse.data;
    const currentTimeForDB = new Date().toISOString();
    await connection.query(insertOrUpdateQuery, [cacheKey, JSON.stringify(freshData), currentTimeForDB]);
    res.json(freshData);

  } catch (error) {
    console.error("Error in getAndCacheData:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
};


app.get("/category/:category/:page", async (req, res) => {
  const { category, page } = req.params;
  const API_KEY = process.env.API_KEY;
  const cacheKey = `${category}_${page}`;
  const apiUrl = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&page=${page}&apikey=${API_KEY}`;
  
  await getAndCacheData(res, cacheKey, apiUrl);
});

app.get("/category/top-headlines", async (req, res) => {
  const API_KEY = process.env.API_KEY;
  const cacheKey = "top-headlines";
  const apiUrl = `https://gnews.io/api/v4/top-headlines?lang=en&max=10&apikey=${API_KEY}`;

  await getAndCacheData(res, cacheKey, apiUrl);
});

app.get("/search/:query/:page", async (req, res) => {
  const { query, page } = req.params;
  const API_KEY = process.env.API_KEY;
  const cacheKey = `search-${query}-${page}`;
  const apiUrl = `https://gnews.io/api/v4/search?q=${query}&lang=en&page=${page}&apikey=${API_KEY}`;

  await getAndCacheData(res, cacheKey, apiUrl);
});


app.get("/", async (req, res) => {
  res.send("Welcome to ez news backend.");
});

if (process.env.NODE_ENV !== "production") {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;