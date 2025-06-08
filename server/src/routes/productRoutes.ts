import express from "express";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import {
  createProduct,
  deleteProduct,
  fetchAllProductsForAdmin,
  getProductById,
  updateProduct,
} from "../controllers/productContoller";

const router = express.Router();

router.post(
  "/create-product",
  authenticateJwt,
  isSuperAdmin,
  upload.array("images", 5),
  createProduct,
);

router.get(
  "/admin-products",
  authenticateJwt,
  isSuperAdmin,
  fetchAllProductsForAdmin,
);
router.put("/:id", authenticateJwt, isSuperAdmin, updateProduct);
router.delete("/:id", authenticateJwt, isSuperAdmin, deleteProduct);

router.get("/:id", authenticateJwt, getProductById);
// router.get("/fetch-client-products", authenticateJwt, getProducts);
//
export default router;
