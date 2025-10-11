const utilities = require("../utilities/")

const baseController = {}

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("index", {
    title: "Home",  
    nav,
    currentPage: "Home",
    messages: req.flash()
  })
}

module.exports = baseController