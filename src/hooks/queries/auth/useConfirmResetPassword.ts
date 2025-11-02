import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ConfirmResetPasswordCredentials } from "@/api/types/auth.type";
import { authAPI } from "@/api/endpoints/auth.api";
import toast from "react-hot-toast";

export const useConfirmResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: ConfirmResetPasswordCredentials) => authAPI.confirmResetPassword(credentials),
    onSuccess: () => {
      toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập.");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Không thể đặt lại mật khẩu");
    }
  });
};
