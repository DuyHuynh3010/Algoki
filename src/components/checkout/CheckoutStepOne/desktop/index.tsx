import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes/routes";
import { CartItem, useCartStore } from "@/store/slices/cart.slice";
import { formatCurrency } from "@/lib/utils";
import { Add, Trash } from "iconsax-react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  useRefetchCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/hooks/queries/cart/useCartApi";
import { useCreateOrder } from "@/hooks/queries/order/useOrder";
import { useQueryClient } from "@tanstack/react-query";

interface ICheckoutStepOneDesktopProps {
  setStep: Dispatch<SetStateAction<number>>;
  cartData?: CartItem[];
}

export default function CheckoutStepOneDesktop({
                                                 setStep,
                                                 cartData,
                                               }: ICheckoutStepOneDesktopProps) {
  const { setQrCodeUrl, setOrderId, setVoucher, cartId } = useCartStore();
  const { refetchCart } = useRefetchCart();
  const updateCart = useUpdateCartItem();
  const router = useRouter();
  const [selectedVoucher] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteItem = useRemoveCartItem();
  const orderCart = useCreateOrder();

  const handleNavigateToHome = () => {
    router.push(Routes.home);
  };

  const handleDeleteItem = (id: string) => {
    deleteItem.mutate(
      {
        cartId,
        cartItemId: id,
      },
      {
        onSuccess: () => {
          refetchCart();
        },
      },
    );
  };

  const handleOrder = () => {
    orderCart.mutate(
      {
        cartId,
        paymentMethod: "manual",
      },
      {
        onSuccess: (data) => {
          setOrderId(data.data.id);
          setQrCodeUrl(data?.data.payment?.gatewayPayment?.qrCodeUrl);
          setStep(1);
          setVoucher("");
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
      },
    );
  };

  const totalPrice = useMemo(() => {
    return cartData?.reduce((total, item) => {
      return total + Number(item.product.course.discountedPrice * item.quantity || 0);
    }, 0);
  }, [cartData]);

  const voucher = 0;

  const totalSale = useMemo(() => {
    return voucher && totalPrice ? totalPrice - voucher : totalPrice;
  }, [voucher, totalPrice]);

  const updateCartQuantity = (item: any, type: "ADD" | "SUB") => {
    if (type === "SUB" && item.quantity === 1) {
      handleDeleteItem(item.id);
      return;
    }

    updateCart.mutate(
      {
        cartId,
        cartItemId: item.id,
        data: {
          quantity: type === "ADD" ? item.quantity + 1 : item.quantity - 1,
        },
      },
      {
        onSuccess: () => {
          refetchCart();
        },
      },
    );
  };

  return (
    <div className="md:max-w-3xl max-w-sm lg:max-w-5xl xl:max-w-7xl mx-auto flex lg:gap-10 w-full lg:flex-row flex-col gap-6 px-6"
         style={{ color: "#EDEDED" }}
    >
      {/* LEFT */}
      <div className="w-full lg:w-[75%]">
        <div className="w-full">
          <div className="rounded-lg w-full overflow-scroll">
            <table className="w-full border-collapse rounded">
              <thead>
              <tr style={{ backgroundColor: "#1A1A1C" }}>
                <th className="py-3 px-4 text-sm" style={{ color: "#A1A1AA" }}>Product</th>
                <th className="py-3 px-4 text-sm" style={{ color: "#A1A1AA" }}>Price</th>
                <th className="py-3 px-4 text-sm" style={{ color: "#A1A1AA" }}>Duration (years)</th>
                <th className="py-3 px-4 text-sm" style={{ color: "#A1A1AA" }}>Total</th>
                <th className="py-3 px-4 text-sm text-right"></th>
              </tr>
              </thead>

              <tbody>
              {cartData?.map((transaction, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: "#1A1A1C",
                    borderTop: index === 0 ? "8px solid #0F0F10" : "1px solid #2A2A2E",
                  }}
                >
                  <td className="py-3 px-4 text-sm min-w-[300px]">
                    <div className="flex gap-4 items-center font-semibold">
                      <img
                        className="h-12 w-16 rounded-sm"
                        src={transaction.product.thumbnail}
                        alt=""
                      />
                      <div className="text-sm" style={{ color: "#EDEDED" }}>
                        {transaction.product.title}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-sm font-semibold">
                    <div>
                      <div>{formatCurrency(transaction.product.course.discountedPrice)}đ</div>
                      <div className="line-through" style={{ color: "#71717B" }}>
                        {formatCurrency(transaction.product.course.regularPrice)}đ
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="cursor-pointer" onClick={() => updateCartQuantity(transaction, "SUB")}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="#FFFFFF"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19,13H5a1,1,0,0,1,0-2H19a1,1,0,0,1,0,2Z" />
                        </svg>
                      </div>

                      <div className="font-semibold text-center text-sm">{transaction.quantity}</div>

                      <div className="cursor-pointer" onClick={() => updateCartQuantity(transaction, "ADD")}>
                        <Add size="18" color="#FFFFFF" />
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-sm font-semibold">
                    {formatCurrency(
                      transaction.product.course.discountedPrice * transaction.quantity,
                    )}
                    đ
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleDeleteItem(transaction.id)}>
                      <Trash size="20" color="#A1A1AA" />
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>

          <button
            className="text-black my-4 flex cursor-pointer"
            style={{ color: "#EDEDED" }}
            onClick={handleNavigateToHome}
          >
            <ArrowLeft size="20" color="#FFFFFF" />
            <span className="ml-2">Continue shopping</span>
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div>
        <div className="p-[24px] rounded-xl text-sm" style={{ backgroundColor: "#1A1A1C" }}>
          <h3 className="font-bold text-lg" style={{ color: "#FFFFFF" }}>Payment details</h3>

          <div className="flex justify-between mt-2 gap-2">
            <span style={{ color: "#A1A1AA" }}>Subtotal</span>
            <span>{formatCurrency(totalPrice)}đ</span>
          </div>

          <div className="flex justify-between mt-2 gap-2">
            <span style={{ color: "#A1A1AA" }}>Discount</span>
            <span>{formatCurrency(voucher)}đ</span>
          </div>

          <div className="flex justify-between mt-2 gap-2">
            <span style={{ color: "#A1A1AA" }}>Total</span>
            <span>{formatCurrency(totalSale)}đ</span>
          </div>

          <div className="mt-4">
            <Button
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}
              onClick={handleOrder}
            >
              Checkout
            </Button>
          </div>
        </div>

        <div className="mt-6 p-[24px] rounded-xl flex justify-between"
             style={{ backgroundColor: "#1A1A1C" }}
        >
          <div className="w-full">
            <div className="text-lg font-semibold">Promotion</div>

            <div className="flex gap-4 mt-2">
              <Input
                className="h-10 flex-1"
                placeholder="Promo code"
                style={{
                  backgroundColor: "#111113",
                  color: "#EDEDED",
                  borderColor: "#2A2A2E",
                }}
              />

              <Button
                className="h-10 px-4 rounded-xl"
                style={{
                  backgroundColor: "#2563EB",
                  color: "#FFFFFF",
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
