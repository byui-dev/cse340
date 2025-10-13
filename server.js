/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")
const env = require("dotenv").config()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
const flash = require('connect-flash')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

/* ***********************
 * Create Express App
 *************************/
const app = express()

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Middleware
 * (Order is critical!)
 *************************/

// 1. Body parser middleware (parse request bodies)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 2. Cookie parser middleware (must come before session)
app.use(cookieParser())

// 3. Session middleware (depends on cookies)
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

// 4. Flash messages middleware (depends on session)
app.use(flash())

// 5. Make flash messages available in all views
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// 6. JWT token verification (depends on cookies/session)
app.use(utilities.checkJWTToken)

/* ***********************
 * Static Resources
 * (Should come before routes)
 *************************/
app.use(express.static(path.join(__dirname, "public")))
app.use("/css", express.static(path.join(__dirname, "public/css")))
app.use("/js", express.static(path.join(__dirname, "public/js")))
app.use("/images", express.static(path.join(__dirname, "public/images")))

/* ***********************
 * Routes
 *************************/
app.use(static) // Static routes

// Index/Home route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

// Account routes
app.use("/account", accountRoute)

/* ***********************
 * Error Handling
 *************************/

// File Not Found Route - Must be last route
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

// Express Error Handler - Must be after all other middleware
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  
  const message = err.status === 404
    ? err.message
    : 'Oh no! There was a crash. Maybe try a different route?'

  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})