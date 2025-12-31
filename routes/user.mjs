import express from "express";
import {
  registerUser,
  loginUser,
  updateUser,
  getUser,
  changePassword,
  deleteUser,
} from "../controllers/user.mjs";
import { authenticate, authorize } from "../middlewares/auth.mjs";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/:id", authenticate, updateUser);
router.get("/:id", authenticate, getUser);
router.put("/change-password", authenticate, changePassword);
router.delete("/:id", authenticate, authorize("admin"), deleteUser);
export default router;
