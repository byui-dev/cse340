const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util;
