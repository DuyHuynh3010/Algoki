import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes/routes";
import { QRCodeSVG } from "qrcode.react";
import { CartItem, useCartStore } from "@/store/slices/cart.slice";
import { formatCurrency } from "@/lib/utils";
import { useGetOrderById } from "@/hooks/queries/order/useOrder";
import { useAuthStore } from "@/store/slices/auth.slice";

interface ICheckoutStep {
  cartData?: CartItem[];
}

export default function CheckoutStepFinalDesktop({ cartData }: ICheckoutStep) {
  const { qrCodeUrl, orderId } = useCartStore();
  const router = useRouter();
  const { data: orderDetail } = useGetOrderById(orderId, !!orderId);
  console.log("orderDetail", orderDetail);
  const { user } = useAuthStore();
  const handleNavigateToHome = () => {
    router.push(Routes.home);
  };

  console.log("cartData", cartData);

  const totalPrice = useMemo(() => {
    return orderDetail?.items?.reduce((total, item) => {
      return total + (item?.discountedPrice * item?.quantity || 0);
    }, 0);
  }, [orderDetail]);

  const renderStatusPayment = useMemo(() => {
    switch (orderDetail?.payment.status) {
      case "pending":
        return (
          <div className="font-semibold text-[#EFB100] bg-[#EFB10029] p-2 rounded-lg">
            Pending
          </div>
        );
      case "completed":
        return (
          <div className="font-semibold text-[#22C55E] bg-[#22C55E14] p-2 rounded-lg">
            Completed
          </div>
        );
      case "failed":
        return (
          <div className="font-semibold text-[#EF4444] bg-[#EF444414] p-2 rounded-lg">
            Failed
          </div>
        );
      default:
        return <></>;
    }
  }, [orderDetail]);

  return (
    <div className="flex gap-[40px] w-full px-[5%] mb-[100px] lg:flex-row flex-col text-white">
      <div className="w-full lg:w-[75%] h-max">
        <div className="w-full h-max mb-5">
          <div className="text-2xl font-semibold mb-[12px]">
            Customer information
          </div>
          <div className="text-sm">
            <div className="flex gap-[20px] items-center mb-2">
              <div className="w-[100px] text-[#A3A3A3]">Name</div>
              <div className="font-semibold">{user?.fullName}</div>
            </div>
            <div className="flex items-center gap-[20px] mb-2">
              <div className="w-[100px] text-[#A3A3A3]">Phone</div>
              <div className="font-semibold">03456222468</div>
            </div>
            <div className="flex items-center gap-[20px] mb-2">
              <div className="w-[100px] text-[#A3A3A3]">Email</div>
              <div className="font-semibold">{user?.email}</div>
            </div>
            <div className="flex items-center gap-[20px] mb-2">
              <div className="w-[100px] text-[#A3A3A3]">Payment method</div>
              <div className="font-semibold text-[#00B8DB] bg-[#00B8DB14] p-2 rounded-lg">
                Scan QR code
              </div>
            </div>
            <div className="flex items-center gap-[20px] mb-2">
              <div className="w-[100px] text-[#A3A3A3]">Payment status</div>
              {renderStatusPayment}
            </div>
          </div>
        </div>

        <div className="w-full h-max bg-[#1E1E1E] rounded-lg p-[24px] mb-5">
          <div className="text-2xl font-semibold mb-[12px]">
            Order ID: #RDF-00001
          </div>
          <div className="border-b pb-2 border-b-[#333]">
            {orderDetail?.items?.map((transaction, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <div className="flex gap-2 items-center font-semibold">
                  <img
                    className="h-12 w-16 rounded-sm"
                    src={transaction?.product.thumbnail}
                    alt=""
                  />
                  <div className="text-sm"> {transaction?.product.title}</div>
                </div>
                <div className="py-3 px-4 font-semibold text-[#FFFFFF] text-sm">
                  <div>
                    <div>{formatCurrency(transaction?.discountedPrice)}đ</div>
                    <div className="font-normal text-[#A3A3A3] line-through">
                      {formatCurrency(transaction?.regularPrice)}đ
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-3 gap-2">
            <div className="text-sm font-medium">Total</div>
            <div className="text-xl text-[#FF6900] font-semibold">
              {formatCurrency(totalPrice)}đ
            </div>
          </div>
        </div>

        <Button
          onClick={handleNavigateToHome}
          className="text-[#FFFFFF] px-4 py-2 rounded-lg"
        >
          Continue shopping
        </Button>
      </div>

      <div>
        <div className="bg-[#00B8DB14] p-4 flex justify-between rounded-xl">
          <div className="lg:text-left text-center">
            <span>
              Open your mobile banking app and choose{" "}
              <span className="font-bold">Scan QR</span>
            </span>
            <div className="flex gap-[32px] mt-4 justify-center items-center flex-col md:flex-row">
              {qrCodeUrl && (
                <QRCodeSVG
                  value={qrCodeUrl}
                  size={140}
                  bgColor="#121212"
                  fgColor="#FFFFFF"
                  level="L"
                  minVersion={4}
                  imageSettings={{
                    src: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
                    height: 24,
                    width: 24,
                    opacity: 1,
                    excavate: true,
                  }}
                />
              )}
              <div className="flex flex-col gap-3">
                <span>
                  VPBank account:{" "}
                  <span className="font-semibold">03363826286</span>
                </span>
                <span>
                  Account name: <span className="font-semibold">Algoki</span>
                </span>
                <span>
                  Amount:{" "}
                  <span className="font-semibold">
                    {formatCurrency(totalPrice)}đ
                  </span>
                </span>
                <span>
                  Reference: <span className="font-semibold">YZ6GJ</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
