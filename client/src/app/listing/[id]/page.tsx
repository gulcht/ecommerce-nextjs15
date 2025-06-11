"use client";

import { Suspense, use } from "react";
import ProductDetailsSkeleton from "./productSkeleton";
import ProductDetailsContent from "./productDetails";

function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // <-- unwrap Promise here

  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailsContent id={id} />
    </Suspense>
  );
}
export default ProductDetailsPage;
