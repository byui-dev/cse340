const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/item/:itemId", invController.buildByItemId);

module.exports = router;
