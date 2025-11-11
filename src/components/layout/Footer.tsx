import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Routes } from "@/lib/routes/routes";
import { MdLocationOn, MdEmail } from "react-icons/md";

function Footer() {
  return (
    <footer className="footer bg-paper border-[1px] border-[#919EAB3D]">
      <div className="md:max-w-3xl max-w-sm lg:max-w-5xl xl:max-w-7xl mx-auto pt-16 pb-8 px-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Image
              src="/images/logo-white.png"
              alt="Logo"
              width={137}
              height={40}
            />
            <div className="mt-8 text-base">
              Algoki is a modern online learning platform that delivers flexible, effective experiences for learners of every age.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-2">
              <div className="text-xl font-semibold">Account</div>
              <Link
                href={Routes.home}
                className="md:mt-6 cursor-pointer hover:text-primary-main hover:underline"
              >
                Explore
              </Link>
              <Link
                href={Routes.home}
                className="cursor-pointer hover:text-primary-main hover:underline"
              >
                Cart
              </Link>
              <Link
                href={Routes.home}
                className="cursor-pointer hover:text-primary-main hover:underline"
              >
                Wishlist
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-xl font-semibold">Algoki</div>
              <Link
                href={Routes.abouts}
                className="md:mt-6 cursor-pointer hover:text-primary-main hover:underline"
              >
                About
              </Link>
              <Link
                href={Routes.developers}
                className="cursor-pointer hover:text-primary-main hover:underline"
              >
                Developers
              </Link>
              <Link
                href={Routes.contact}
                className="cursor-pointer hover:text-primary-main hover:underline"
              >
                Contact
              </Link>
              <Link
                href={Routes.instructors}
                className="cursor-pointer hover:text-primary-main hover:underline"
              >
                Instructors
              </Link>
              <Link
                href={Routes.faq}
                className="cursor-pointer hover:text-primary-main hover:underline"
              >
                FAQs
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 text-sm my-4">
          <div className="flex gap-2 items-center flex-1">
            <MdLocationOn className="text-cyan-400 footer-icon" size={18} />
            <div className="text-base">Hanoi, Vietnam</div>
          </div>

          <div className="flex gap-2 items-center flex-1">
            <MdEmail className="text-cyan-400 footer-icon" size={18} />
            <div className="text-lg font-bold">algoki@gmail.com</div>
          </div>
        </div>

        <div className="my-8 w-full h-[1px] bg-[#919EAB3D]"></div>
        <div className="lg:flex items-center justify-between">
          <div className="text-sm">
            2025 <span className="font-semibold">Algoki.</span>
          </div>
          <div className="text-zinc-400 text-sm">
            <Link
              href={Routes.termOfUse}
              className="hover:text-primary-main hover:underline"
            >
              Terms & Conditions
            </Link>
            <Link
              href={Routes.policy}
              className="ml-8 hover:text-primary-main hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
