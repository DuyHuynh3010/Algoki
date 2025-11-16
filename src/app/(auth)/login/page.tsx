"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { bannerSignIn, logoGoogle, logoMini } from "@/contants/images";
import { useLogin, useLoginGoogleMain } from "@/hooks/queries/auth/useLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import { AxiosError } from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema validation for Login
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();
  const {
    mutate: loginGoogle,
    isPending: isPendingGoogle,
    error: errorGoogle,
  } = useLoginGoogleMain();

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Google login success - call our API with access token
        loginGoogle({
          accessToken: response.access_token,
          idToken: "",
        });
      } catch (error) {
        console.error("Error processing Google login:", error);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
    },
    scope: "openid profile email",
    flow: "implicit",
  });

  const handleGoogleLogin = () => {
    googleLogin();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getErrorMessageFromPayload = (err: unknown): string | null => {
    if (!err) return null;
    const axiosErr = err as AxiosError<any>;
    const payloadMessage =
      axiosErr?.response?.data?.message ||
      axiosErr?.response?.data?.error ||
      axiosErr?.response?.data?.msg;
      if (payloadMessage === "Email hoặc mật khẩu không đúng.") {
        return "Email or password is incorrect.";
      }
    return payloadMessage || axiosErr?.message || null;
  };

  return (
    <div className="flex w-full min-h-screen flex-col lg:flex-row">
      {/* Banner Image - Hidden on mobile, visible on large screens */}
      <div className="hidden lg:block lg:w-[50%] xl:w-[65%]">
        <Image
          src={bannerSignIn}
          alt="banner"
          className="h-screen w-full object-cover"
        />
      </div>

      {/* Login Form Section */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[50%] xl:w-[35%] px-4 sm:px-6 md:px-8 lg:px-6 xl:px-8 py-8 lg:py-0 min-h-screen">
        {/* Logo */}
        <div className="w-full max-w-md mx-auto">
          <Image
            src={logoMini}
            alt="logmini"
            className="mx-auto mb-8 sm:mb-10 md:mb-12 h-10 w-auto"
          />

          {/* Welcome Text */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-white font-semibold text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl mb-3 sm:mb-4">
              Welcome back
            </h1>
            <div className="flex justify-center gap-2 text-sm sm:text-base text-white">
              <span>
                Not a member yet?{" "}
                <span
                  className="text-[#16A1FF] cursor-pointer w-max hover:underline font-medium"
                  onClick={() => router.push("/register")}
                >
                  Sign up
                </span>
              </span>
            </div>
          </div>

          {/* Login Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4 sm:space-y-5"
            >
              {/* Display API Error */}
              {(error || errorGoogle) && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                   {getErrorMessageFromPayload(error) ||
                    getErrorMessageFromPayload(errorGoogle) ||
                    "An error occurred while signing in. Please try again."}
                </div>
              )}

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        className="w-full border border-gray-200 rounded-[10px] px-4 py-2 h-11 sm:h-12 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                        disabled={isPending || isPendingGoogle}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="w-full border border-gray-200 rounded-[10px] px-4 py-2 h-11 sm:h-12 pr-12 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                          disabled={isPending || isPendingGoogle}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          disabled={isPending || isPendingGoogle}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <div
                  onClick={() => router.push("/forgot-password")}
                  className="underline text-xs sm:text-sm cursor-pointer hover:text-blue-600 transition-colors"
                >
                  Forgot password?
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isPending || isPendingGoogle}
                className="font-semibold text-white bg-[#16A1FF] hover:bg-[#254bdc] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl w-full h-11 sm:h-12 text-sm sm:text-base transition-colors"
              >
                {isPending || isPendingGoogle ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="text-center text-[#637381] text-sm my-5 sm:my-6">
            Or
          </div>

          {/* Google Login Button */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isPending || isPendingGoogle}
            variant="outline"
            className="font-normal text-primary bg-[#919EAB14] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl w-full h-11 sm:h-12 flex justify-center items-center gap-2 border-none text-sm sm:text-base transition-colors"
          >
            <Image
              src={logoGoogle}
              alt="Google logo"
              className="h-5 w-5 sm:h-6 sm:w-6 object-cover"
            />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
