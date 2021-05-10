const express = require("express");

const { register, login } = require("../controllers/auth");

//Create the routers
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
