const {body, validationResult} = require("express-validator")
const utilities = require(".")
const invModel = require("../models/inventory-model")

const validate = {}

/***************************************
 * Classification Data Validation Rules 
 * **************************************/
validate.classificationRules = () => {
  return [
    // classification name is required and must be string with no spaces and special charaacters
    body("classification_name")
    .trim()
    .isLength({ min: 1})
    .withMessage("Please provide a classification name.")
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("Classification name cannot contain spaces or special characters."
    .custom(async (classification_name) => {
      const classificationExists = await invModel,checkExistingClassification(classification_name) 
      if (classificationExists){
        throw new Error('Classification already exists. Please use a different name.')
      }    
    }),
  ]  
}

/**********************************
 * Check data and return errors or continue to add classification
 * **********************************/
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
      messages: req.flash()  
    })
    return
  }
  next()
}

/********************************
 * Inventory Data Validation Rules
 * *******************************/
validate.inventory = () => {
  return [
    body("inv_make")
       .trim()
       .isLength({ min: 3})
       .withMessage("Please provide a make name with at least 3 characters."),

    body("inv_model")
       .trim()
       .isLength({ min: 3})
       .withMessage("Please provide a make name with at least 3 characters.")
    
    body("inv_year")
       .trim()
       .isLength({ min: 4, max: 4})
       .withMessage("Year must be 4 digits.")
       .matches(/^\d{4}/)
       .withMessage("Year must contain only numbers."),      
    
   body("inv_description")
       .trim()
       .isLength({ min: 1 })
       .withMessage("Please provide a description"),

    body("inv_image")
       .trim()
       .isLength({ min: 1 })
       .withMessage("Please provide an image path."),
    
    body("inv_thumbnail")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a thumbnail path."),

    body("inv_price")
       .trim()
       .isNumeric()
       .withMessage("Price must be a number.")
       .isFloat({ min: 0 })
       .withMessage("Price must be a positive number."),

    body("inv_miles")
       .trim()
       .isInt({ min: 0 })
       .withMessenger("Miles must be a positive whole number."),   
    
    body("inv_color")
       .trim()
       .isLength({ min: 1 })
       .withMessage("Please provide a color."),

    body("classification_id")
       .trim()
       .isInt({ min: 1 }) 
       .withMessage("Please select a valid classification".),  
    ] 
}

/**********************************
 * Check data and return errors or continue to add inventory
 * ***********************************/
validate.checkInventoryData = async (req, res, next) => {
  const = {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      messages: req.flash()  
    })
    return
  } 
  next()
}

module.expoets = validate