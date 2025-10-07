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
/*************************************************************
 * Deliver registration view
**************************************************************/
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

async function buildAccountHome(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/home", {
        title: "My Account",
        nav,
     })
}

module.exports = { buildLogin, buildRegister, buildAccountHome };