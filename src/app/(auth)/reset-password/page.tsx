"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { bannerSignIn, logoMini } from "@/contants/images";
import { useLogin } from "@/hooks/queries/auth/useLogin";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConfirmResetPassword } from "@/hooks/queries/auth/useConfirmResetPassword";

// Schema validation for Set Password
const setPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 number"),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Confirmation password does not match",
  path: ["confirmPassword"],
});

type SetPasswordFormData = z.infer<typeof setPasswordSchema>;

function SetPasswordPage() {
  const { error } = useLogin();
  const { mutate: confirmReset, isPending } = useConfirmResetPassword();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setToken(params.get("token"));
    }
  }, []);

  const form = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = (data: SetPasswordFormData) => {
    if (!token) return;
    confirmReset({
      token,
      password: data.password,
      passwordConfirmation: data.confirmPassword,
    });
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

      {/* Set Password Form Section */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[50%] xl:w-[35%] px-4 sm:px-6 md:px-8 lg:px-6 xl:px-8 py-8 lg:py-0 min-h-screen">
        {/* Content Container */}
        <div className="w-full max-w-md mx-auto">
          <Image
            src={logoMini}
            alt="logmini"
            className="mx-auto mb-8 sm:mb-10 md:mb-12 h-10 w-auto"
          />
          
          {/* Title and Description */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-[#212B36] font-semibold text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl mb-4 sm:mb-6">
              Reset Password
            </h1>
            <p className="text-[#637381] text-sm sm:text-base">
              Password reset request.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4 sm:space-y-5"
            >
              {/* Display API Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error.message ||
                    "Something went wrong while resetting the password. Please try again."}
                </div>
              )}

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
                          placeholder="New password"
                          className="w-full border border-gray-200 rounded-[10px] px-4 py-2 h-11 sm:h-12 pr-12 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                          disabled={isPending}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          disabled={isPending}
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

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          className="w-full border border-gray-200 rounded-[10px] px-4 py-2 h-11 sm:h-12 pr-12 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                          disabled={isPending}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          disabled={isPending}
                        >
                          {showConfirmPassword ? (
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="font-semibold text-white bg-[#16A1FF] hover:bg-[#254bdc] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl w-full h-11 sm:h-12 text-sm sm:text-base transition-colors mt-6"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>
          </Form>


          {/* Back to Login Button */}
          <button
            onClick={() => router.push("/login")}
            className="mt-6 sm:mt-8 text-sm sm:text-base text-[#637381] hover:text-[#16A1FF] cursor-pointer flex items-center justify-center gap-2 w-full transition-colors"
            disabled={isPending}
          >
            <span>←</span>
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetPasswordPage;
