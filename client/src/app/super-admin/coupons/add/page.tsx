"use client";

import { protectCouponFormAction } from "@/actions/coupon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCouponStore } from "@/store/useCouponStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function SuperAdminManageCouponsPage() {
  const [formData, setFormData] = useState({
    code: "",
    discountPercent: 0,
    startDate: "",
    endDate: "",
    usageLimit: 0,
  });

  const { createCoupon, isLoading } = useCouponStore();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateUniqueCoupon = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    setFormData((prev) => ({
      ...prev,
      code: result,
    }));
  };

  const handleCouponSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    const checkCouponFormvalidation = await protectCouponFormAction();
    if (!checkCouponFormvalidation.success) {
      toast.error(checkCouponFormvalidation.error);
      return;
    }

    const couponData = {
      ...formData,
      discountPercent: parseFloat(formData.discountPercent.toString()),
      usageLimit: parseInt(formData.usageLimit.toString()),
    };

    const result = await createCoupon(couponData);
    if (result) {
      toast.success("Coupon created successfully");
      router.push("/super-admin/coupons/list");
    }
  };
  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1>Create New Coupon</h1>
        </header>
        <form
          // onSubmit={handleFormSubmit}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-1"
        >
          <div className="space-y-4">
            <div>
              <Label>Start Date</Label>
              <Input
                name="startDate"
                type="date"
                className="mt-1.5 hover:cursor-pointer"
                onChange={handleInputChange}
                value={formData.startDate}
                required
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                name="endDate"
                type="date"
                className="mt-1.5 hover:cursor-pointer"
                onChange={handleInputChange}
                value={formData.endDate}
                required
              />
            </div>
            <div>
              <Label>Coupon Code</Label>
              <div className="flex justify-between items-center gap-2 ">
                <Input
                  name="code"
                  type="text"
                  className="mt-1.5 "
                  onChange={handleInputChange}
                  value={formData.code}
                  placeholder="Enter coupon code"
                  required
                />
                <Button type="button" onClick={handleCreateUniqueCoupon}>
                  Generate Coupon Code
                </Button>
              </div>
            </div>
            <div>
              <Label>Discount Percentage</Label>
              <Input
                name="discountPercent"
                type="number"
                min={1}
                max={100}
                className="mt-1.5 "
                placeholder="Enter discount percentage"
                onChange={handleInputChange}
                value={formData.discountPercent}
                required
              />
            </div>
            <div>
              <Label>Usage Limits</Label>
              <Input
                name="usageLimit"
                type="number"
                className="mt-1.5 "
                min={0}
                placeholder="Enter usage limits"
                onChange={handleInputChange}
                value={formData.usageLimit}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={handleCouponSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Coupon"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SuperAdminManageCouponsPage;
