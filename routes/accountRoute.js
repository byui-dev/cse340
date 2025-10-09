// accountRoute.js

const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

// Redirect root /account to login
router.get("/", (req, res) => {
  res.redirect("/account/login");
});

// Serve account home page
router.get("/home", utilities.handleErrors(accountController.buildAccountHome));

// Serve registration view
router.get("/register", (req, res) => {
  res.render("account/register", {
    title: "Register Account"
  });
});

// Serve login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Handle registration form submission
router.post("/register", utilities.handleErrors(accountController.registerAccount));

module.exports = router;
