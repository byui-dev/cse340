const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ************************
 * Builds inventory view by classification ID
 ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classificationId = req.params.classificationId;

  try {
    const inventory = await invModel.getInventoryByClassificationId(classificationId);
    const grid = utilities.buildClassificationGrid(inventory);
    const nav = await utilities.getNav();

    const title = inventory.length > 0
      ? `${inventory[0].classification_name} Vehicles`
      : "No Vehicles Found";

    res.render("inventory/classification", {
      title,
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error building classification view:", error);
    next(error);
  }
};

module.exports = invCont;
