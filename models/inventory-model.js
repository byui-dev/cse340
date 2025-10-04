const pool = require("../database");

/* ***************************
 *  Get all classification data
 *************************** */
async function getClassifications() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );
    return data.rows;
  } catch (error) {
    console.error("[InventoryModel] getClassifications error:", error.message);
    return [];
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 *************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT 
        i.inv_id, 
        i.inv_make, 
        i.inv_model, 
        i.inv_year,
        i.inv_description,
        i.inv_image, 
        i.inv_thumbnail, 
        i.inv_price,
        i.inv_miles,
        i.inv_color,
        c.classification_name
       FROM public.inventory AS i
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1
       ORDER BY i.inv_make, i.inv_model`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("[InventoryModel] getInventoryByClassificationId error:", error.message);
    return [];
  }
}

/******************************************************************
 * Get inventory item by inventory_id
 ******************************************************************/
async function getInventoryById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inventory_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("[InventoryModel] getInventoryById error:", error.message);
    return null;
  }
}

async function updateImagePaths() {
  try {
    await pool.query(`
      UPDATE public.inventory
      SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
          inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
      WHERE inv_image NOT LIKE '%/vehicles/%'
        AND inv_thumbnail NOT LIKE '%/vehicles/%'
    `);
  } catch (error) {
    console.error("[InventoryModel] updateImagePaths error:", error.message);
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  updateImagePaths
};