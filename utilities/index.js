const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  const rows = await invModel.getClassifications();

  if (!Array.isArray(rows) || rows.length === 0) {
    console.error("Error: No classifications found", rows);
  }
  
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';

  rows.forEach((row) => {
    list += `<li><a href="/inv/type/${row.classification_id}" title="View our ${row.classification_name} inventory">${row.classification_name}</a></li>`;
  }); 
  
  list += "</ul>";
  return list;
};

/* ************************
 * Builds a classification grid from inventory array
 ************************** */
Util.buildClassificationGrid = function (inventory) {
  if (!Array.isArray(inventory) || inventory.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  let grid = '<ul id="inv-display">';

  inventory.forEach((vehicle) => {
    grid += '<li>';
    grid += `<a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;
    grid += `<img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors"/>`;
    grid += '</a>';
    grid += '<div class="namePrice">';
    grid += '<hr />';
    grid += '<h2>';
    grid += `<a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;
    grid += `${vehicle.inv_make} ${vehicle.inv_model}`;
    grid += '</a>';
    grid += '</h2>';
    grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`;
    grid += '</div>';
    grid += '</li>';
  });

  grid += '</ul>';
  return grid;
};

/* ************************
 * Builds a single vehicle detail view
 ************************** */
Util.buildVehicleDetail = function (vehicle) {
  if (!vehicle) {
    return '<p class="notice">Vehicle not found.</p>';
  }

  let detail = '<div class="vehicle-detail-wrapper">';

  // Left side - Image 
  detail += '<div class="vehicle-image">'; 
  detail += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}"/>`; 
  detail += '</div>';
  
  // Right side - Details
  detail += '<div class="vehicle-info">';
  detail += `<h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>`;
  
  detail += '<div class="vehicle-specs">';
  detail += `<p class="price"><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`;
  detail += `<p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>`;
  detail += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`;
  detail += '</div>';

  detail += '<div class="vehicle-description">';
  detail += '<h3>Description</h3>';
  detail += `<p>${vehicle.inv_description}</p>`;
  detail += '</div>';

  detail += '</div>'; // Close vehicle-info
  detail += '</div>'; // Close vehicle-detail-wrapper

  return detail;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;