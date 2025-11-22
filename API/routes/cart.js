const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Carts OK")
});

module.exports = router;