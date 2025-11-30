import React, { Dispatch, SetStateAction, useMemo } from "react";
import { Button } from "@/components/ui/button";
import ExpandItem from "@/components/checkout/CheckoutStepTwo/expand-item";
import { CartItem, useCartStore } from "@/store/slices/cart.slice";
import { formatCurrency } from "@/lib/utils";

interface ICheckoutStepTwoDesktopProps {
  setStep: Dispatch<SetStateAction<number>>;
  cartData?: CartItem[];
}

export default function CheckoutStepTwoDesktop({
                                                 setStep,
                                                 cartData,
                                               }: ICheckoutStepTwoDesktopProps) {
  const { voucher, clearCart } = useCartStore();

  const totalPrice = useMemo(() => {
    return cartData?.reduce((total, item) => {
      return total + (item?.product.course.discountedPrice * item?.quantity || 0);
    }, 0);
  }, [cartData]);

  const voucherSale = useMemo(() => {
    return 0;
  }, [totalPrice, voucher]);

  const totalSale = useMemo(() => {
    if (voucherSale && totalPrice) {
      return totalPrice - voucherSale;
    }
    return totalPrice;
  }, [voucherSale, totalPrice]);

  const handleSubmit = () => {
    setStep(2);
    clearCart();
  };

  return (
    <div
      className="flex gap-[40px] w-full px-[5%] mb-[100px] lg:flex-row flex-col"
      style={{ color: "#EDEDED" }}
    >
      {/* LEFT */}
      <div className="w-full lg:w-[75%] h-max">
        {/* ORDER DETAILS */}
        <div
          className="w-full h-max rounded-lg p-[24px] mb-5"
          style={{ backgroundColor: "#1A1A1C", border: "1px solid #2A2A2E" }}
        >
          <div className="text-2xl font-semibold mb-[12px]" style={{ color: "#FFFFFF" }}>
            Order details
          </div>

          <div>
            {cartData?.map((transaction, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-2 py-3"
                style={{
                  borderBottom: "1px solid #2A2A2E",
                }}
              >
                <div className="flex gap-4 items-center flex-1">
                  <img
                    className="h-12 w-16 rounded-sm"
                    src={transaction.product.thumbnail}
                    alt=""
                  />
                  <div className="text-sm flex-1" style={{ color: "#EDEDED" }}>
                    {transaction?.product.title}
                  </div>
                </div>

                <div className="py-3 px-4" style={{ color: "#FFFFFF" }}>
                  {transaction?.quantity}
                </div>

                <div
                  className="py-3 px-4 font-semibold text-sm w-1/4 text-end"
                  style={{ color: "#EDEDED" }}
                >
                  {formatCurrency(
                    transaction?.product.course.discountedPrice * transaction.quantity,
                  )}
                  đ
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div
          className="w-full h-max rounded-lg p-[24px]"
          style={{ backgroundColor: "#1A1A1C", border: "1px solid #2A2A2E" }}
        >
          <div className="text-2xl font-semibold mb-[24px]" style={{ color: "#FFFFFF" }}>
            Choose a payment method
          </div>

          <ExpandItem totalPrice={totalPrice} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1">
        <div
          className="pt-4 p-[24px] rounded-xl text-sm"
          style={{
            backgroundColor: "#1A1A1C",
            border: "1px solid #2A2A2E",
            color: "#EDEDED",
          }}
        >
          <h3 className="font-bold text-lg" style={{ color: "#FFFFFF" }}>
            Payment summary
          </h3>

          <div className="flex justify-between mt-4 gap-2">
            <span style={{ color: "#A1A1AA" }}>Items</span>
            <span>{cartData?.length} courses</span>
          </div>

          <div className="flex justify-between mt-4 gap-2">
            <span style={{ color: "#A1A1AA" }}>Subtotal</span>
            <span>{formatCurrency(totalPrice)}đ</span>
          </div>

          <div
            className="flex justify-between mt-4 gap-2 pb-4"
            style={{ borderBottom: "1px solid #2A2A2E" }}
          >
            <span style={{ color: "#A1A1AA" }}>Discount</span>
            <span>{formatCurrency(voucherSale)}đ</span>
          </div>

          <div className="flex justify-between mt-4 gap-2">
            <span className="font-semibold" style={{ color: "#FFFFFF" }}>
              Total
            </span>
            <span className="font-semibold" style={{ color: "#FFFFFF" }}>
              {formatCurrency(totalSale)}đ
            </span>
          </div>

          <div className="flex flex-col mt-[16px]">
            <Button
              className="px-4 py-2 rounded-lg text-white"
              style={{
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
              }}
              onClick={handleSubmit}
            >
              Payment completed
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
