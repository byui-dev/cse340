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
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities")
const path = require("path")

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

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

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

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes - MOVED HERE BEFORE app.listen()
app.use("/inv", require("./routes/inventoryRoute"))

// Account routes
app.use("/account", require("./routes/accountRoute")) 

/******************************************
 * File Not Found Route must be placed last
 * Week 4 Activities
 *******************************************/
app.use(async (req, res, next) => {
  next({ 
    status: 404, 
    message: "Sorry, we appear to have lost that page." 
  })
})


 /* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  console.error(`Error at: ${req.originalUrl}: ${err.message}`)
  const status = err.status || 500
  const message = status === 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?'
  const nav = await utilities.getNav()
  res.status(status).render("errors/error", {
    title: status + ' Error',
    message,
    nav
  })
})

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