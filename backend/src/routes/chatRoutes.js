const express = require("express");
const { getUsers, getMessages } = require("../controllers/chatController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);
router.get("/users", getUsers);
router.get("/messages/:userId", getMessages);

module.exports = router;
