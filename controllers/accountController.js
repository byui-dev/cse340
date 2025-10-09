// accountController.js

const accountModel = require("../models/account-model");

/************************************************************
 * Deliver login view
 ************************************************************/
function buildLogin(req, res) {
  res.render("account/login", {
    title: "Login"
  });
}

/************************************************************
 * Deliver registration view
 ************************************************************/
function buildRegister(req, res) {
  res.render("account/register", {
    title: "Register",
    errors: null
  });
}

/************************************************************
 * Deliver account home view
 ************************************************************/
function buildAccountHome(req, res) {
  res.render("account/home", {
    title: "My Account"
  });
}

/************************************************************
 * Process registration form
 ************************************************************/
async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login"
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration"
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  buildAccountHome,
  registerAccount
};
