"use client";

import { Input, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Send2 } from "iconsax-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email.trim()) {
      message.warning("Please enter an email before subscribing.");
      return;
    }

    console.log("Subscribed email:", email);
    setEmail("");
    message.success("Subscription successful!");
  };

  return (
    <section className="pb-16 md:pb-24 bg-cover bg-center ">
      <div
        className="w-full mx-auto px-5 md:px-10 max-w-[1280px] flex flex-col-reverse md:flex-row items-center gap-10 rounded-[20px] py-10 md:py-20"
        style={{
          backgroundImage: "url('/images/home/newsletter-bg.png')",
        }}
      >
        <div className="w-full md:w-3/4 text-center md:text-left mt-4  md:mt-0">
          <h2 className=" text-2xl md:text-5xl font-bold mb-4">
            Subscribe to our newsletter
          </h2>
          <p className="text-base md:text-xl mb-6">
            Whether you’re part of a team or learning solo, we help you level up your code seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 max-w-full sm:max-w-md mx-auto sm:mx-0">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md w-full mx-auto">
              <MailOutlined className="text-gray-400 text-lg mr-2 mt-1" />
              <Input
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="!border-none shadow-none focus:ring-0 focus:outline-none text-sm"
                style={{ flex: 1 }}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="bg-[#16A1FF] text-white px-6 py-2 rounded-full flex items-center justify-center gap-1 hover:bg-[#0d8ae6] transition text-sm whitespace-nowrap w-full sm:w-auto mx-auto sm:mx-0"
            >
              Subscribe <Send2 size="24" color="#FFFFFFDE"/>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
