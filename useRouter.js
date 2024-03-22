const { login,
    register,
    verifyToken,
    refreshToken,
    logout,
    getUser,

} = require("./controller/userController");
const express = require("express");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/user", verifyToken, getUser)
router.get("/refresh", refreshToken, verifyToken, getUser)
router.post("/logout", verifyToken, logout)

module.exports = router;
