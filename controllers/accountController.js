/************************************************************
 * Account Controller
 * Week 4, deliver login view activity
 * **********************************************************/
const utilities = require('../utilities')
 
/********************************************************* *
 * Deliver login view
 * Week 4, Deliver login view activity
 ************************************************************/
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

async function buildAccountHome(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/home", {
        title: "My Account",
        nav,
     })
}

module.exports = { buildLogin, buildAccountHome };