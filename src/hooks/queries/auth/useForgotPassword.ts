import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ForgotPasswordCredentials } from "@/api/types/auth.type";
import { authAPI } from "@/api/endpoints/auth.api";
import toast from "react-hot-toast";

export const useForgotPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: ForgotPasswordCredentials) => authAPI.forgotPassword(credentials),
    onSuccess: () => {
      router.push("/login");
      toast.success('Vui lòng check email để thực hiện đổi mật khẩu!');
    },
  });
}; 