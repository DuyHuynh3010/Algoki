"use client";

import React from "react";
import { Title } from "@/components/common/Title";
import { CONTACT } from "@/contants/contact";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "iconsax-react";

const FormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Email is invalid." }),
  topic: z.string().min(2, { message: "Topic must be at least 2 characters." }),
  message: z
    .string()
    .min(2, { message: "Message must be at least 2 characters." }),
});

function ContactPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: "", email: "", topic: "", message: "" },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("data----", data);
  }

  return (
    <div className="bg-[#121212] text-white">
      <div className="bg-gradient-to-b from-[#1E1E1E] to-[#121212] lg:h-[600px]">
        <div className="px-6 md:max-w-3xl max-w-sm lg:max-w-5xl xl:max-w-7xl mx-auto w-full flex flex-col items-center justify-center h-full">
          <Title
            label="Our vision"
            title="We envision a world where anyone, anywhere can transform their life through learning."
            subTitle=""
            containerClass="w-[100%] lg:pt-0 pt-20"
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mt-8 lg:mt-16">
            {CONTACT.map((item) => (
              <div
                key={item.title}
                className="p-10 rounded-2xl bg-[#1E1E1E] flex items-start gap-8"
              >
                <div className="flex-1">
                  <div className="font-bold text-2xl">{item.title}</div>
                  <div className="text-[#A3A3A3] mt-2">{item.subTitle}</div>
                </div>
                {item.icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Form {...form}>
        <div className="pb-32 px-6 md:max-w-3xl max-w-sm lg:max-w-5xl xl:max-w-7xl mx-auto w-full flex lg:flex-row flex-col gap-8 items-stretch">
          <div className="w-full lg:w-1/2">
            <Image
              src="/images/contact/img.png"
              alt="Girl"
              width={1000}
              height={1000}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full lg:w-1/2 box-shadow-component rounded-2xl p-12 flex flex-col gap-6 lg:gap-0 justify-between bg-[#1E1E1E]"
          >
            <div>
              <div className="bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent w-fit text-lg font-semibold">
                Education for everyone
              </div>
              <div className="font-bold text-3xl leading-12 mt-2">
                Contact us to receive a free course
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        invalid={fieldState.invalid}
                        placeholder="Full name"
                        className="bg-[#121212] text-white border-[#333]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[#FF6B6B]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        invalid={fieldState.invalid}
                        placeholder="Email"
                        className="bg-[#121212] text-white border-[#333]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[#FF6B6B]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topic"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        invalid={fieldState.invalid}
                        placeholder="Topic"
                        className="bg-[#121212] text-white border-[#333]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[#FF6B6B]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        invalid={fieldState.invalid}
                        placeholder="Message"
                        className="bg-[#121212] text-white border-[#333]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[#FF6B6B]" />
                  </FormItem>
                )}
              />
            </div>

            <Button className="h-12 bg-primary-main hover:bg-primary-dark">
              <span className="font-bold text-white">Send now</span>
              <ArrowRight size={24} color="white" />
            </Button>
          </form>
        </div>
      </Form>
    </div>
  );
}

export default ContactPage;
