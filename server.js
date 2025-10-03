/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config({ path: "/etc/secrets/.env" })
const app = express()
const static = require("./routes/static")
const session = require("express-session")
const pool = require('./database/')
const baseController = require("./controllers/baseController")
const inventoryRoutes = require("./routes/inventoryRoute")
const utilities = require("./utilities")

/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

const path = require("path")

/* ***********************
 * View engine and templates
 *************************/
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index  route
app.get("/", utilities.handleErrors(baseController.buildHome))

/* ***********************
 * Local Server Information
 * Values from .env (environment) file with fallbacks
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

// Inventory routes
app.use("/inv", inventoryRoutes)

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  console.error(`Error at: ${req.originalUrl}: ${err.message}`)
  const status = err.status || 500
  const message = status === 404 ? err.message : 'Sorry, something went wrong on the server'
    res.status(status).send(`${status} Error: ${ message }`)
})    

  
