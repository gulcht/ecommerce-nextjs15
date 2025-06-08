"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { useCouponStore } from "@/store/useCouponStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
function SuperAdminCouponListingPage() {
  const { isLoading, couponList, fetchCoupons, deleteCoupon } =
    useCouponStore();
  const router = useRouter();
  const fetchCouponRef = useRef(false);
  useEffect(() => {
    if (!fetchCouponRef.current) {
      fetchCoupons();
      fetchCouponRef.current = true;
    }
  }, [fetchCoupons]);

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [couponIdToDelete, setCouponIdToDelete] = useState<string | null>(null);
  const onTriggerDelete = (id: string) => {
    setCouponIdToDelete(id);
    setIsAlertDialogOpen(true);
  };

  // ฟังก์ชันสำหรับยืนยันการลบ
  const handleConfirmDelete = async () => {
    if (couponIdToDelete) {
      const result = await deleteCoupon(couponIdToDelete);
      if (result) {
        toast.success("Coupon deleted successfully");
        await fetchCoupons(); // โหลดข้อมูลใหม่หลังจากลบ
      } else {
        toast.error("Failed to delete coupon."); // เพิ่ม error toast
      }
      setIsAlertDialogOpen(false); // ปิด AlertDialog
      setCouponIdToDelete(null); // ล้าง ID ที่จะลบ
    }
  };

  if (isLoading) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1>All Coupons</h1>
          <Button onClick={() => router.push("/super-admin/coupons/add")}>
            Add New Coupon
          </Button>
        </header>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {couponList &&
            Array.isArray(couponList) &&
            couponList.length > 0 ? (
              couponList.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <p className="font-semibold">{coupon.code}</p>
                  </TableCell>
                  <TableCell>
                    <p>{coupon.discountPercent}%</p>
                  </TableCell>
                  <TableCell>
                    <p>
                      {coupon.usageCount}/{coupon.usageLimit}
                    </p>
                  </TableCell>
                  <TableCell>
                    {format(new Date(coupon.startDate), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(coupon.endDate), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        new Date(coupon.endDate) > new Date()
                          ? "default"
                          : "destructive"
                      } // เปลี่ยนสีตามสถานะ
                    >
                      {new Date(coupon.endDate) > new Date()
                        ? "Active"
                        : "Expired"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {/* ใช้ AlertDialogTrigger หุ้ม Button */}
                    <Button
                      onClick={() => onTriggerDelete(coupon.id)} // เรียกฟังก์ชันเปิด AlertDialog
                      variant="ghost"
                      size={"sm"}
                      className="text-gray-500 hover:text-red-500" // เพิ่ม hover color
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // แสดงข้อความเมื่อไม่มีคูปอง
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No coupons found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* AlertDialog Component */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              coupon and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SuperAdminCouponListingPage;
