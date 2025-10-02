const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invControl = {};

/* ************************
 * Builds inventory view by classification ID
 ************************** */
invControl.buildByClassificationId = async function (req, res, next) {
  const classificationId = req.params.classificationId;

  if (!Number.isInteger(classificationId)) {
    const nav = await utilities.getNav();
    return res.status(400).render("errors/400", {
      title: "Invalid Classification ID",
      nav,
    });
  }  
  
  try {
    const inventory = await invModel.getInventoryByClassificationId(classificationId);
    const grid = utilities.buildClassificationGrid(inventory);
    const nav = await utilities.getNav();

    const title = inventory.length > 0
      ? `${inventory[0].classification_name} Vehicles`
      : "No Vehicles Found";

    const messages = inventory.length === 0 ? ["No vehicles found for this classification."] : [];
    
    res.render("inventory/classification", {
      title,
      nav,
      grid,
      messages
    });
  } catch (error) {
    console.error(`[invControl] buildByClassificationId failed for ID=${classificationId}:`, error.message);
    next(error);
  }
};


/**********************************************
 * Builds inventory detail view by Item ID
 **********************************************/
invControl.buildByItemId = async function (req, res, next) {
  const itemId = Number(req.params.itemId);
  
  if (!Number.isInteger(itemId)) {
    const nav = await utilities.getNav();
    return res.status(400).render("errors/400", {
      title: "Invalid Item ID",
      nav,
    });
  }

  try {
    const item = await invModel.getInventoryById(itemId); 
    const nav = await utilities.getNav();

    if (!item) {
      return res.status(404).render("errors/404", {
        title: "Item Not Found",
        nav,
      });
    }

    res.render("inventory/detail", {
      title: `${item.inv_make} ${item.inv_model}`, 
      nav,
      item,
    });
  } catch (error) {
    console.error(`[invControl] buildByItemId failed for ID=${itemID}:`, error.message);
    next(error);
  }
};

module.exports = invControl;