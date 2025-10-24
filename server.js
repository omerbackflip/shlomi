require('dotenv').config(); // Load environment variables from .env file

const express = require("express");
const cors = require("cors");
const google = require("./google");              // <-- ADD THIS LINE

const app = express();
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// ✅ INIT GOOGLE (reads from .env by default)
google.init({
  clientId: process.env.GOOGLE_CLIENT_ID,        // <-- ADD (optional: can omit, module reads .env)
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI
});

// ✅ GOOGLE AUTH ROUTES
app.get("/api/google/auth", (req, res) => {
  const url = google.generateAuthUrl();
  return res.redirect(url);
});

app.get("/api/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const tokens = await google.getTokens(code);
    google.saveTokens(tokens); // persist locally (google_token.json in app root)
    return res.json({ success: true });
  } catch (err) {
    console.error("Google OAuth error:", err);
    return res.status(500).json({ success: false, error: 'OAuth failed' });
  }
});

// Don’t forget to call connect() method in server.js (here, this file):
const db = require("./app/models");

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to tools repair application." });
});

require("./app/routes/specific.routes")(app);
require("./app/routes/generic.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
