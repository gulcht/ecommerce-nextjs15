"use client";

import { protectProductFormAction } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProductStore } from "@/store/useProductStore";
import { brands, categories, colors, sizes } from "@/utils/config";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

interface FormState {
  name: string;
  brand: string;
  description: string;
  category: string;
  gender: string;
  price: string;
  stock: string;
}

function SuperAdminManageProductPage() {
  const [formState, setFormState] = useState({
    name: "",
    brand: "",
    description: "",
    category: "",
    gender: "",
    price: "",
    stock: "",
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const searchParams = useSearchParams();
  const getCurrentEditProductId = searchParams.get("id");
  const isEditMode = !!getCurrentEditProductId;

  const router = useRouter();
  const { createProduct, updateProduct, getProductById, isLoading, error } =
    useProductStore();

  useEffect(() => {
    if (isEditMode) {
      getProductById(getCurrentEditProductId).then((product) => {
        if (product) {
          setFormState({
            name: product.name,
            brand: product.brand,
            description: product.description,
            category: product.category,
            gender: product.gender,
            price: product.price.toString(),
            stock: product.stock.toString(),
          });
          setSelectedSizes(product.sizes);
          setSelectedColors(product.colors);
        }
      });
    }
  }, [isEditMode, getCurrentEditProductId, getProductById]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleToggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const checkFirstLevelFormSanitization = await protectProductFormAction();

    if (!checkFirstLevelFormSanitization.success) {
      toast.error(checkFirstLevelFormSanitization.error);
      return;
    }

    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("sizes", selectedSizes.join(","));
    formData.append("colors", selectedColors.join(","));

    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    const result = isEditMode
      ? await updateProduct(getCurrentEditProductId, formData)
      : await createProduct(formData);
    console.log("result: ", result);
    if (result) {
      router.push("/super-admin/products/list");
    }
  };
  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1>Add Product</h1>
        </header>
        <form
          onSubmit={handleFormSubmit}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-1"
        >
          <Label
            htmlFor="file"
            className="cursor-pointer block p-4 " // เพิ่มสไตล์เพื่อให้คลิกได้ทั้งบล็อก
          >
            <div className="mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-400 p-12">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4 text-sm leading-6 text-gray-600">
                  <span>Click here to browse</span>
                </div>
                <input
                  id="file"
                  name="file"
                  type="file"
                  className="sr-only" // ยังคงซ่อน input ด้วย sr-only
                  multiple
                  onChange={handleFileChange}
                />
              </div>
              {selectedFiles.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        width={80}
                        height={80}
                        className="h-20 w-20 object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Label>
          <div className="space-y-4">
            <div>
              <Label>Product Name</Label>
              <Input
                name="name"
                placeholder="Product Name"
                className="mt-1.5"
                onChange={handleInputChange}
                value={formState.name}
              />
            </div>
            <div>
              <Label>Brand</Label>
              <Select
                name="brand"
                onValueChange={(value) => handleSelectChange("brand", value)}
                value={formState.brand}
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((item) => (
                    <SelectItem key={item} value={item.toLowerCase()}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Product Description</Label>
              <Textarea
                name="description"
                placeholder="Product Description"
                className="mt-1.5 min-h-[150px]"
                onChange={handleInputChange}
                value={formState.description}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                name="category"
                value={formState.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((item) => (
                    <SelectItem key={item} value={item.toLowerCase()}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Gender</Label>
              <Select
                name="gender"
                value={formState.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="kids">Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Size</Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {sizes.map((item) => (
                  <Button
                    key={item}
                    type="button"
                    size={"sm"}
                    className="hover:cursor-pointer"
                    onClick={() => handleToggleSize(item)}
                    variant={
                      selectedSizes.includes(item) ? "default" : "outline"
                    }
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Color</Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {colors.map((color) => (
                  <Button
                    key={color.name}
                    type="button"
                    size={"sm"}
                    className={`hover:cursor-pointer w-8 h-8 rounded-full ${
                      color.class
                    } ${
                      selectedColors.includes(color.name)
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }`}
                    onClick={() => handleToggleColor(color.name)}
                  ></Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Product Price</Label>
              <Input
                name="price"
                type="number"
                pattern="[0-9]+"
                min={0}
                placeholder="Enter Product Price"
                className="mt-1.5"
                onChange={handleInputChange}
                value={formState.price}
              />
            </div>
            <div>
              <Label>Product Stock</Label>
              <Input
                name="stock"
                type="number"
                pattern="[0-9]+"
                min={0}
                placeholder="Enter Product Stock"
                className="mt-1.5"
                onChange={handleInputChange}
                value={formState.stock}
              />
            </div>
            <Button
              disabled={isLoading}
              type="submit"
              className="mt-1.5 w-full"
            >
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SuperAdminManageProductPage;
