/******************************************************
 * Account Routes
 * Week 4, deliver login view activity 
 * ****************************************************/
 // Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Redirect to /account/login 
router.get("/", (req, res) => {
    res.redirect("/account/login");
});

// Serve the account home page
router.get("/home", utilities.handleErrors(accountController.buildAccountHome));

// Serve the account registration view
router.get("/register", async (req, res) => {
    const nav = await utilities.getNav();
    res.render("account/register", {
        title: "Register Account",
        nav,
    });
});

/***************************************************** 
 * Deliver login View
 * Week 4, deliver login view activity
 * ****************************************************/
router.get("/login", utilities.handleErrors(accountController.buildLogin));

module.exports = router;

