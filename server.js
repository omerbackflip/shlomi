require('dotenv').config();
const { createGoogleRouter } = require('./google/backend');
const { googleService } = require('./app/services/google-submodule-service');
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use('/api/google', createGoogleRouter({
  scopes: process.env.GOOGLE_SCOPES,
  googleService
}));

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
const mongooseRouter = require("./app/shared/mongoose/routes/generic.routes");
app.use("/api/generic", mongooseRouter);

// set port, listen for requests
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
