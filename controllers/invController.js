const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invControl = {};

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

/**********************************************
 Builds inventory detail view by Item ID
 **********************************************/
invControl.buildByItemId = async function (req, res, next) {
  const ItemId = req.params.ItemId;

  try {
    const item = await invModel.getItemById(itemId);
    const nav = await utilities.getNav();

    if (!item) {
      return res.status(404).render("errors/404", {
        title: "Item Not Found",
        nav,
      });
    }

    res.render("inventory/detail", {
      title: `${item.make} ${item.model}`,
      nav,
      item,
    });
  } catch (error) {
    console.error("error building item detail view:", error);
    next(error);
  }
};    

module.exports = invCont;
