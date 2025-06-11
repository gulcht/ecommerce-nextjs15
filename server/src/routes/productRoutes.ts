import express from "express";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import {
  createProduct,
  deleteProduct,
  fetchAllProductsForAdmin,
  getProductById,
  getProductsForClient,
  updateProduct,
} from "../controllers/productContoller";

const router = express.Router();

router.get("/fetch-client-products", authenticateJwt, getProductsForClient);
router.get(
  "/admin-products",
  authenticateJwt,
  isSuperAdmin,
  fetchAllProductsForAdmin
);
router.get("/:id", authenticateJwt, getProductById);

router.post(
  "/create-product",
  authenticateJwt,
  isSuperAdmin,
  upload.array("images", 5),
  createProduct
);

router.put("/:id", authenticateJwt, isSuperAdmin, updateProduct);
router.delete("/:id", authenticateJwt, isSuperAdmin, deleteProduct);

//
export default router;
