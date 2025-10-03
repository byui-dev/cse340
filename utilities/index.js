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
    return "<p>No inventory available for this classification.</p>";
  }

  let grid = '<table>';
  grid += '<thead><tr><th>Vehicle</th><th>Price</th><th>Description</th></tr></thead>';
  grid += '<tbody>';
  inventory.forEach((item) => {
    grid += `<tr>
      <td><a href="/inv/detail/${item.inv_id}">${item.inv_make} ${item.inv_model}</a></td>
      <td>$${item.inv_price}</td>
      <td>${item.inv_description}</td>
    </tr>`;
  });
  grid += '</tbody></table>';
  return grid;
};

/***************************************************************** *
 * Builds a single vehicle detail view
*******************************************************************/
Util.buildVehicleDetail = function (vehicle) {
  if (!vehicle) {
    return "<p>Vehicle not found.</p>";
  }

  let detail = `
    <div class="vehicle-detail">
      <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      <p><strong>Price: </strong> $${vehicle.inv_price.toLocaleString()}</p>
      <p><strong>Year: </strong> ${vehicle.inv_year}</p>
      <p><strong>Mileage: </strong> ${vehicle.inv_miles.toLocaleString()} miles</p>
      <p><strong>Description: </strong> ${vehicle.inv_description}</p>  
    </div>
  `;

  return detail;
};



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util;
