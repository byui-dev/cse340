const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invControl = {};

/* ************************
 * Builds inventory view by classification ID
 ************************** */
invControl.buildByClassificationId = async function (req, res, next) {
  const classificationId = parseInt(req.params.classificationId);

  if (!Number.isInteger(classificationId)) {
    return res.status(400).send("Invalid classification ID.");
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
      messages,
      errors: null
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
  const itemId = parseInt(req.params.itemId, 10);
  
  if (!Number.isInteger(itemId)) {
    return res.status(400).send("Invalid Item ID.");
  }

  try {
    const item = await invModel.getInventoryById(itemId); 
   
    if (!item) {
      return res.status(404).send("Item Not Found.");
    }

    const nav = await utilities.getNav();
    const vehicleDetail = utilities.buildVehicleDetail(item);

    res.render("inventory/detail", {
      title: `${item.inv_year} ${item.inv_make} ${item.inv_model}`, 
      nav,
      vehicleDetail,
      errors: null
    });
  } catch (error) {
    console.error(`[invControl] buildByItemId failed for ID=${itemId}:`, error.message);
    next(error);
  }
};

module.exports = invControl;