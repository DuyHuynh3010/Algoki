import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { VerifyEmailCredentials } from "@/api/types/auth.type";
import { authAPI } from "@/api/endpoints/auth.api";
import toast from "react-hot-toast";

export const useVerify = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: VerifyEmailCredentials) => authAPI.verifyEmail(credentials),
    onSuccess: () => {
      toast.success("Xác thực thành công vui lòng đăng nhập lại!");
      router.push("/login");
    },
  });
};
