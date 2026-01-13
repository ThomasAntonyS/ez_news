const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const axios = require('axios');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const SibApiV3Sdk = require("sib-api-v3-sdk");
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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

const generateToken = (email,id,name) => {
  return jwt.sign({ email: email, id:id, name:name}, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "SESSION EXPIRED." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err){
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      });
      return res.status(403).json({ message: "INVALID IDENTITY." });
    }
    req.user = user;
    next();
  });
};

const sendEmail = async (toEmail, subject, message) => {
  try {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { name: "EZ NEWS", email: process.env.sendSmtpEmail_sender };
    sendSmtpEmail.to = [{ email: toEmail }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.textContent = message;
    return await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    console.error("Brevo Email Error:", error);
    throw error;
  }
};

app.get("/check-auth", authenticateToken, (req, res) => {
  res.status(200).json({ 
    authenticated: true, 
    name: req.user.name, 
    id: req.user.id,
    email: req.user.email
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [data] = await pool.query(
      "SELECT email, password, name, id FROM users WHERE email = ? AND isVerified = 1",
      [email]
    );

    if (data.length === 0 || !(await bcrypt.compare(password, data[0].password))) {
      return res.status(401).json({ message: "INVALID CREDENTIALS." });
    }

    const token = generateToken(data[0].email,data[0].id,data[0].name);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none', 
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ message: "IDENTITY VERIFIED. Redirecting to home" });
  } catch (error) {
    return res.status(500).json({ message: "SYSTEM ERROR." });
  }
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.DOMAIN_URL 
    : 'http://localhost:5173';

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [data] = await connection.query("SELECT email FROM users WHERE email = ?", [email]);
    if (data.length > 0) {
      await connection.rollback();
      return res.status(409).json({ message: "EMAIL ALREADY EXIST. TRY LOGGING IN" });
    }

    const salt = parseInt(process.env.BCRYPT_SALT) || 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedEmail = Buffer.from(email).toString('hex');
    
    const verificationUrl = `${baseUrl}/verify?usp=${hashedEmail}&p=${encodeURIComponent(hashedPassword)}`;
    
    await sendEmail(email, "VERIFY IDENTITY", `Verify your account: ${verificationUrl}`);
    
    await connection.query(
      "INSERT INTO users (email, password, name, isVerified) VALUES (?, ?, ?, 0)",
      [email, hashedPassword, name]
    );

    await connection.commit();
    return res.status(200).json({message:`Verification mail send to ${email}. Click the url to verify account`})
  } catch (error) {
    if (connection) await connection.rollback();
    res.status(500).json({ message: "SYSTEM ERROR." });
  } finally {
    if (connection) connection.release();
  }
});

app.get("/verify", async (req, res) => {
  const { usp, p } = req.query;
  try {
      const email = Buffer.from(usp, 'hex').toString();
      const [result] = await pool.query(
        "UPDATE users SET isVerified = 1 WHERE email = ? AND password = ?",
        [email, p]
      );

      if (result.affectedRows === 0) {
        return res.status(400).json({ message: "INVALID OR EXPIRED LINK." });
      }

      return res.status(200).json({ message: "VERIFICATION SUCCESSFUL." });
  } catch (error) {
      return res.status(500).json({ message: "SERVER ERROR." });
  }
});

app.post("/logout", (req, res) => {
  if (!req.cookies || !req.cookies.token) {
    return res.status(400).json({ message: "NO ACTIVE SESSION FOUND." });
  }

  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    return res.status(200).json({ message: "LOGGED OUT." });
  } catch (err) {
    return res.status(500).json({ message: "LOGOUT ERROR." });
  }
});

app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT name, email FROM users WHERE email = ?",
      [req.user.email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "USER NOT FOUND." });
    }

    res.status(200).json({
      name: rows[0].name,
      email: rows[0].email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "SYSTEM ERROR." });
  }
});

app.post("/save-news", authenticateToken, async (req, res) => {
  const { articleId, articleData, pubDate } = req.body;
  const userId = req.user.id;

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    await connection.query(
      "INSERT IGNORE INTO news_data (news_id, news) VALUES (?, ?)",
      [articleId, JSON.stringify(articleData)]
    );

    await connection.query(
      "INSERT INTO user_news (user_id, news_id, date) VALUES (?, ?, ?)",
      [userId, articleId, pubDate]
    );

    await connection.commit();
    res.status(200).json({ message: "SUCCESS" });
  } 
  catch (error) {
    if (connection) await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "ALREADY_SAVED" });
    }
    
    res.status(500).json({ message: "SERVER_ERROR" });
  } finally {
    if (connection) connection.release();
  }
});

app.post("/unsave-news", authenticateToken, async (req, res) => {
  const { articleId } = req.body;
  const userId = req.user.id;

  try {
    
    await pool.query(
      "DELETE FROM user_news WHERE user_id = ? AND news_id = ?",
      [userId, articleId]
    );

    res.status(200).json({ message: "REMOVED" });
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
  }
});

app.get("/get-saved-news", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM user_news WHERE user_id = ?`,
      [userId]
    );

    const [articles] = await pool.query(
      `SELECT nd.news, nd.news_id 
       FROM news_data nd
       JOIN user_news un ON nd.news_id = un.news_id
       WHERE un.user_id = ?
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    res.status(200).json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "SERVER_ERROR" });
  }
});

app.get('/saved-news-ids', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const now = new Date();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const formatSql = (date) => date.toISOString().slice(0, 10);
    
    const startTime = formatSql(yesterday);
    const endTime = formatSql(now);

    const [rows] = await pool.query(
      `SELECT news_id 
       FROM user_news
       WHERE user_id = ? 
       AND date BETWEEN ? AND ?`,
      [userId, startTime, endTime]
    );

    const savedIds = rows.map(row => row.news_id);

    res.status(200).json(savedIds);
  } catch (error) {
    console.error("Error fetching saved IDs:", error);
    res.status(500).json({ message: "SERVER_ERROR" });
  }
});

app.delete("/delete-account", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      "DELETE FROM user_news WHERE user_id = ?",
      [userId]
    );

    const [result] = await connection.query(
      "DELETE FROM users WHERE id = ?",
      [userId]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "USER_NOT_FOUND" });
    }

    await connection.commit();

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });

    res.status(200).json({ message: "ACCOUNT_DELETED_SUCCESSFULLY" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "SERVER_ERROR" });
  } finally {
    connection.release();
  }
});

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
  const REFRESH_INTERVAL = 5 * 60 * 60 * 1000; 

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