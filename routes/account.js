const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Account Home'); // Placeholder response
});

module.exports = router;    
