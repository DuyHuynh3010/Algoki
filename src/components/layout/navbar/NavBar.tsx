"use client";

import { ICategory } from "@/api/types/category";
import { MenuMobile } from "@/components/layout/navbar/MenuMobile";
import SearchPopup from "@/components/layout/navbar/SearchPopup";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { DropdownMenuItem } from "@/components/ui/menu";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { useAuthContext } from "@/context/AuthProvider";
import { useCreateCart, useGetCart } from "@/hooks/queries/cart/useCartApi";
import { Routes } from "@/lib/routes/routes";
import { useAuthStore } from "@/store/slices/auth.slice";
import { useCartStore } from "@/store/slices/cart.slice";
import { motion } from "framer-motion";
import { ArrowDown2, BagHappy, CloseCircle, SearchNormal } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, categories } = useAuthContext();
  const { count: countCart, setListCart, setCartId } = useCartStore();
  const [timeLeft, setTimeLeft] = useState(3300);
  const [isFlashSale, setIsFlashSale] = useState(pathname === Routes.home);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );
  const user = useAuthStore.getState().user;

  useEffect(() => {
    // Handle keyboard shortcut
    const handleKeyDown = (event: KeyboardEvent) => {
      // Detect Command/Ctrl + K
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        // Prevent default browser behaviour
        event.preventDefault();

        // Toggle the command palette
        setOpenSearch((prevState) => !prevState);
      }
    };

    // Add event listener on mount
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setIsFlashSale(pathname === Routes.home);
  }, [pathname]);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 🔹 Derive hours, minutes, seconds from timeLeft
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const navigateToFlashSale = () => {};

  const navigateToCheckout = () => {
    if (isAuthenticated) {
      router.push(Routes.checkout);
    } else {
      router.push(Routes.login);
    }
  };

  const { refetch } = useGetCart(!isAuthenticated);
  const createCartItemDto = useCreateCart();

  const handleCreateCart = () => {
    createCartItemDto.mutate(
      {},
      {
        onSuccess: (res) => {
          if (res) {
            setCartId(res.id);
          }
          // setListCart(res.data);
        },
        onError: (error) => {
          console.error("Error creating cart:", error);
        },
      },
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      handleCreateCart();
      refetch().then((res) => {
        if (res.data) {
          setListCart(res.data.items);
        }
      });
    }
  }, [isAuthenticated]);

  const navigateToProfile = () => {
    router.push(Routes.dashboard);
  };

  const handleNavigateToHome = () => {
    router.push(Routes.home);
  };

  const handleNavigateToProduct = (category: ICategory) => {
    setSelectedCategory(category);
    router.push(`/course-category?category=${category.id}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderHeightHeader = useCallback(() => {
    return 0;
  }, []);

  return (
    <div className="">
      {isFlashSale && (
        <motion.div className="bg-gray-900 relative">
          <div
            onClick={() => setIsFlashSale(false)}
            className="cursor-pointer p-2 absolute right-2 lg:top-[50%] lg:translate-y-[-50%] top-2"
          >
            <CloseCircle size="20" color="#FFFFFF" />
          </div>
          <div className="md:max-w-3xl max-w-sm lg:max-w-5xl xl:max-w-7xl mx-auto lg:flex-row flex-col flex items-center justify-center px-6 py-2">
            <div
              onClick={navigateToFlashSale}
              className="cursor-pointer flex-row flex gap-1 items-center"
            >
              <span className="text-white lg:text-lg text-base font-semibold py-1 px-2.5 bg-tertiary-main rounded-[10px]">
                Hot
              </span>
              <span className="lg:text-base text-white text-xs pl-4">
                Grab discounts up to{" "}
                <span className="text-secondary-main"> 20%</span>
              </span>
            </div>
            <div className="flex gap-2 items-center pl-6">
              <span className="text-sm font-semibold text-white">
                ENDS IN
              </span>
              <div className="h-8 w-10 flex items-center justify-center bg-zinc-800 rounded-lg p-1.5 text-xl text-tertiary-light font-semibold">
                {String(hours).padStart(2, "0")}
              </div>
              <div className="h-8 w-10 flex items-center justify-center bg-zinc-800 rounded-lg p-1.5 text-xl text-tertiary-light font-semibold">
                {String(minutes).padStart(2, "0")}
              </div>
              <div className="h-8 w-10 flex items-center justify-center bg-zinc-800 rounded-lg p-1.5 text-xl text-tertiary-light font-semibold">
                {String(seconds).padStart(2, "0")}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{
          y: scrolled || !isFlashSale ? 0 : renderHeightHeader(),
          opacity: 1,
        }}
        transition={{ duration: 0.2 }}
        className={`fixed left-0 w-full z-50 transition-all duration-100 ease-in-out ${
          scrolled ? "bg-[#161C24CC] backdrop-blur-sm top-0" : "bg-transparent"
        }`}
      >
        <div className="w-full py-2 lg:px-10 px-4">
          <div className="flex justify-between items-center">
            {/* Nav Routes */}
            <div className="flex items-center space-x-4 md:space-x-8">
              <MenuMobile />

              <Image
                src="/images/logo.png"
                alt="Logo"
                width={127}
                height={33}
                onClick={handleNavigateToHome}
                className="cursor-pointer block lg:hidden"
              />

              <Image
                src="/images/logo.png"
                alt="Logo"
                width={137}
                height={40}
                onClick={handleNavigateToHome}
                className="cursor-pointer hidden lg:block"
              />

              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:block focus-visible:outline-none">
                  <div className="flex gap-2 items-center cursor-pointer">
                    <div>
                      {selectedCategory ? selectedCategory.title : "Discover"}
                    </div>
                    <ArrowDown2 size={16} color="#FFFFFF" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={20}
                  alignOffset={-10}
                  className="grid grid-cols-3 grid-rows-3 bg-default border border-neutural-16"
                >
                  {categories?.map((category) => (
                    <DropdownMenuItem key={category.id} className="block">
                      <Button
                        variant="ghost"
                        className={`block w-full text-left text-normal font-normal ${
                          selectedCategory?.id === category.id
                            ? "text-primary-main bg-primary-main/10 hover:text-primary-main"
                            : "text-text-primary hover:text-default"
                        }`}
                        onClick={() => handleNavigateToProduct(category)}
                      >
                        {category.title}
                      </Button>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Buttons */}
            <div className="flex space-x-6 items-center">
              <div className="flex items-center gap-4">
                {/* <Image
                  src="/vietnam.svg"
                  alt="Logo"
                  className="m-2 lg:block hidden"
                  width={28}
                  height={20}
                /> */}

                <div className="flex gap-2 items-center">
                  <Button
                    style={{ padding: 8 }}
                    size="lg"
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setOpenSearch(true);
                    }}
                  >
                    <SearchNormal size={24} color="#71717B" />
                  </Button>
                  {/*<span className="p-1 bg-white text-sm rounded shadow">*/}
                  {/*  ⌘K*/}
                  {/*</span>*/}
                  {/*<Button size="lg" type="button" variant="ghost">*/}
                  {/*  <Heart size="24" color="#71717B" />*/}
                  {/*</Button>*/}
                  <NotificationBadge label={countCart.toString()}>
                    <Button
                      style={{ padding: 8 }}
                      size="lg"
                      type="button"
                      variant="ghost"
                      onClick={navigateToCheckout}
                    >
                      <BagHappy size="24" color="#71717B" />
                    </Button>
                  </NotificationBadge>
                </div>

                {/*<NotificationBadge label="0">*/}
                {/*  <Button size="lg" type="button" variant="ghost">*/}
                {/*    <Notification size="24" color="#71717B" />*/}
                {/*  </Button>*/}
                {/*</NotificationBadge>*/}
                {isAuthenticated ? (
                  <Image
                    onClick={navigateToProfile}
                    src={
                      user?.avatarUrl ??
                      "https://i.pinimg.com/736x/00/7c/bb/007cbbb03fa1405a7bd2b8a353e16242.jpg"
                    } // Fallback avatar
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="cursor-pointer rounded-full h-[40px] w-[40px]"
                  />
                ) : (
                  <div className="lg:flex gap-2 items-center hidden">
                    <Button variant="ghost" className="h-10">
                      <Link href={Routes.login}>Log in</Link>
                    </Button>
                    <Button
                      variant="default"
                      className="bg-primary-main h-10  shadow-md hover:shadow-xl hover:shadow-primary-main/20 transition-shadow duration-300 text-white px-4 py-1.5 rounded-[10px]"
                    >
                      <Link href={Routes.login} className="text-white">
                        Sign up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <SearchPopup open={openSearch} setOpen={setOpenSearch} />
      </motion.nav>
    </div>
  );
}

export default Navbar;
