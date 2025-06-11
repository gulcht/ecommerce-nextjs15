import cloudinary from "../config/cloudinary";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import { prisma } from "../server";
import fs from "fs";
import { Prisma } from "@prisma/client";

// create product
export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      brand,
      description,
      category,
      gender,
      sizes,
      colors,
      price,
      stock,
    } = req.body;

    const files = req.files as Express.Multer.File[];

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "ecommerce",
      })
    );
    const uploadedFiles = await Promise.all(uploadPromises);
    const imageUrls = uploadedFiles.map((result) => result.secure_url);

    const newlyCreatedProduct = await prisma.product.create({
      data: {
        name,
        brand,
        description,
        category,
        gender,
        sizes: sizes.split(","),
        colors: colors.split(","),
        price: parseFloat(price),
        stock: parseInt(stock),
        images: imageUrls,
        soldCount: 0,
        rating: 0,
      },
    });

    files.forEach((file) => fs.unlinkSync(file.path));
    res.status(201).json(newlyCreatedProduct);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Create Prduct failed, Some error occured",
    });
  }
};

// fetch all products (admin side)
export const fetchAllProductsForAdmin = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const fetchAllProducts = await prisma.product.findMany();
    res.status(200).json(fetchAllProducts);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Fetch all products failed, Some error occured",
    });
  }
};

// get product by id
export const getProductById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }
    res.status(200).json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "get product by id failed, Some error occured",
    });
  }
};

// update product by id (admin)
export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      description,
      category,
      gender,
      sizes,
      colors,
      price,
      stock,
      rating,
      // images,
    } = req.body;

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        brand,
        description,
        category,
        gender,
        sizes: sizes.split(","),
        colors: colors.split(","),
        price: parseFloat(price),
        stock: parseInt(stock),
        rating: parseInt(rating),
        // images
      },
    });
    res.status(200).json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Update product failed, Some error occured",
    });
  }
};

// delete product by id (admin)
export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: {
        id,
      },
    });
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Delete product failed, Some error occured",
    });
  }
};

// fetch product with filter (client)
export const fetchProductWithFilter = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Fetch product with filter failed, Some error occured",
    });
  }
};

// getProducts
export const getProductsForClient = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const categories = ((req.query.categories as string) || "")
      .split(",")
      .filter(Boolean);
    const brands = ((req.query.brands as string) || "")
      .split(",")
      .filter(Boolean);
    const sizes = ((req.query.sizes as string) || "")
      .split(",")
      .filter(Boolean);
    const colors = ((req.query.colors as string) || "")
      .split(",")
      .filter(Boolean);

    const minPrice = parseFloat(req.query.minPrice as string) || 0;
    const maxPrice =
      parseFloat(req.query.maxPrice as string) || Number.MAX_SAFE_INTEGER;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      AND: [
        categories.length > 0
          ? {
              category: {
                in: categories,
                mode: "insensitive",
              },
            }
          : {},
        brands.length > 0
          ? {
              brand: {
                in: brands,
                mode: "insensitive",
              },
            }
          : {},
        sizes.length > 0
          ? {
              sizes: {
                hasSome: sizes,
              },
            }
          : {},
        colors.length > 0
          ? {
              colors: {
                hasSome: colors,
              },
            }
          : {},
        {
          price: { gte: minPrice, lte: maxPrice },
        },
      ],
    };

    const [product, total] = await Promise.all([
      prisma.product.findMany({
        where: where,
        skip: skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.product.count({
        where: where,
      }),
    ]);

    res.status(200).json({
      success: true,
      products: product,
      currentPage: page,
      totalProducts: total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Fetch all products failed, Some error occured",
    });
  }
};
