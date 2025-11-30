"use client";

import { Github, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChartProps {
  title: string;
  color: string;
  value: number;
}

function Charts({ data }: { data: ChartProps[] }) {
  return (
    <div className="flex flex-row justify-between">
      {data.map((item) => (
        <div key={item.title} className="flex flex-col gap-2 h-[200px] justify-end items-center">
          <div className={`w-15 bg-${item.color}-500 rounded-t-sm`} style={{ height: `${item.value}%` }}>
            <p className="text-white text-center mt-2">{item.value}%</p>
          </div>
          <p>{item.title}</p>
        </div>
      ))}
    </div>
  )
}

function PortfolioLandingPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const handleSendMessage = () => {
    if (name === "" || email === "" || message === "") {
      toast.error("Please fill in all fields");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email");
      return;
    }
    setName("");
    setEmail("");
    setMessage("");
    toast.success("Message sent successfully");
  };

  return (
    <div className="min-h-screen bg-neutral-900 px-6 py-16 text-slate-100 md:px-12 lg:px-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <section className="grid gap-12 md:grid-cols-[minmax(0,1fr)_320px] md:items-center lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Hello, I&apos;m Duy Huynh,
            </p>
            <h1 className="text-4xl font-semibold text-slate-50 sm:text-5xl lg:text-6xl">
              Frontend
              <br />
              Developer
            </h1>
            <Link
              href="mailto:star.huynhnguyenduy.3010@gmail.com"
              className="inline-block text-lg font-medium text-sky-300 underline underline-offset-4 transition hover:text-sky-200"
            >
              Contact Me
            </Link>
          </div>

          <div className="mx-auto h-[360px] w-[360px] max-w-full rounded-[40px] bg-gradient-to-br from-slate-700/30 via-slate-600/40 to-slate-800/40 p-6 shadow-[0_25px_90px_-30px_rgba(0,0,0,0.8)]">
            <div className="flex h-full w-full items-center justify-center rounded-[30px] bg-gradient-to-br from-slate-400/30 via-slate-200/40 to-slate-100/20 backdrop-blur">
              <img className="w-full h-full object-cover rounded-2xl" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXIis2maFI7xwfKPqkrXE1Z6KhE4nsPL2KTGok54x6UbbeAk1enXclumwmRVabynuQU04&usqp=CAU" alt="" />
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <header className="flex items-center gap-6">
            <h2 className="text-4xl font-semibold text-slate-200">
              About
            </h2>
            <div className="h-px w-full flex-1 bg-slate-700" />
          </header>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
            vulputate tristique quam felis. Id phasellus dui orci vulputate
            consequat nulla proin. Id sit scelerisque neque, proin bibendum
            diam.
          </p>

          <div className="grid gap-6 sm:grid-cols-3">
            <div
              className="flex flex-col justify-between rounded-3xl border border-slate-700/60 bg-neutral-900/60 px-6 py-8 shadow-[0_20px_50px_-30px_rgba(6,182,212,0.35)] transition hover:border-slate-500 hover:shadow-[0_25px_70px_-35px_rgba(6,182,212,0.6)]"
            >
              <h3 className="text-xl text-center font-semibold text-slate-100">
                Languages
              </h3>
              <Charts data={[
                { title: "JavaScript", color: "blue", value: 80 },
                { title: "TypeScript", color: "green", value: 80 },
                { title: "Python", color: "red", value: 60 },
              ]} />
            </div>
            <div
              className="flex flex-col justify-between rounded-3xl border border-slate-700/60 bg-neutral-900/60 px-6 py-8 shadow-[0_20px_50px_-30px_rgba(6,182,212,0.35)] transition hover:border-slate-500 hover:shadow-[0_25px_70px_-35px_rgba(6,182,212,0.6)]"
            >
              <h3 className="text-xl text-center font-semibold text-slate-100">
                Frame Works
              </h3>
              <Charts data={[
                { title: "React", color: "blue", value: 80 },
                { title: "Next.js", color: "green", value: 70 },
                { title: "Tailwind CSS", color: "red", value: 60 },
              ]} />
            </div>
            <div
              className="rounded-3xl border border-slate-700/60 bg-neutral-900/60 px-6 py-8 shadow-[0_20px_50px_-30px_rgba(6,182,212,0.35)] transition hover:border-slate-500 hover:shadow-[0_25px_70px_-35px_rgba(6,182,212,0.6)]"
            >
              <h3 className="text-xl text-center font-semibold text-slate-100">
                Cencepts & Interests
              </h3>
              <ul className="list-disc list-inside ml-3">
                <li>
                  <span className="mt-2 text-sm uppercase tracking-widest text-slate-400">Data structure</span>
                </li>
                <li>
                  <span className="mt-2 text-sm uppercase tracking-widest text-slate-400">Algorithms</span>
                </li>
                <li>
                  <span className="mt-2 text-sm uppercase tracking-widest text-slate-400">Machine learning</span>
                </li>
                <li>
                  <span className="mt-2 text-sm uppercase tracking-widest text-slate-400">Web Development</span>
                </li>
                <li>
                  <span className="mt-2 text-sm uppercase tracking-widest text-slate-400">Mobile Development</span  >
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <header className="flex items-center gap-6">
            <h2 className="text-4xl font-semibold text-slate-200">
              Edu
            </h2>
            <div className="h-px w-full flex-1 bg-slate-700" />
          </header>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
            vulputate tristique quam felis. Id phasellus dui orci vulputate
            consequat nulla proin. Id sit scelerisque neque, proin bibendum
            diam.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div
              className="rounded-3xl border border-slate-800/80 bg-neutral-900/70 p-6 shadow-[0_30px_90px_-45px_rgba(37,99,235,0.75)] transition hover:border-slate-600 hover:shadow-[0_40px_120px_-45px_rgba(56,189,248,0.75)]"
            >
              <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 p-6">
                <div className="space-y-4 text-slate-50">
                  <p className="text-2xl font-semibold">
                    2024 - <span className="text-slate-200">2025</span>
                  </p>
                  <div className="flex flex-row gap-4 items-center">
                    <div className="flex flex-col gap-2 w-[120px]">
                      <p>Name:</p>
                      <p>Location:</p>
                      <p>Website:</p>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="text-slate-200">Truong THPT Nguyen Tat Thanh</p>
                      <p className="text-slate-200">HCMUT</p>
                      <p className="text-slate-200">https://www.hcmut.edu.vn</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="rounded-3xl border border-slate-800/80 bg-neutral-900/70 p-6 shadow-[0_30px_90px_-45px_rgba(37,99,235,0.75)] transition hover:border-slate-600 hover:shadow-[0_40px_120px_-45px_rgba(56,189,248,0.75)]"
            >
              <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 p-6">
                <div className="space-y-4 text-slate-50">
                  <p className="text-2xl font-semibold">
                    2024 - <span className="text-slate-200">2025</span>
                  </p>
                  <div className="flex flex-row gap-4 items-center">
                    <div className="flex flex-col gap-2 w-[120px]">
                      <p>Name:</p>
                      <p>Location:</p>
                      <p>Website:</p>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="text-slate-200">Truong ABC</p>
                      <p className="text-slate-200">HCMUT</p>
                      <p className="text-slate-200">https://www.hcmut.edu.vn</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="rounded-3xl border border-slate-800/80 bg-neutral-900/70 p-6 shadow-[0_30px_90px_-45px_rgba(37,99,235,0.75)] transition hover:border-slate-600 hover:shadow-[0_40px_120px_-45px_rgba(56,189,248,0.75)]"
            >
              <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 p-6">
                <div className="space-y-4 text-slate-50">
                  <p className="text-2xl font-semibold">
                    2024 - <span className="text-slate-200">2025</span>
                  </p>
                  <div className="flex flex-row gap-4 items-center">
                    <div className="flex flex-col gap-2 w-[120px]">
                      <p>Name:</p>
                      <p>Location:</p>
                      <p>Website:</p>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="text-slate-200">Truong ABC</p>
                      <p className="text-slate-200">HCMUT</p>
                      <p className="text-slate-200">https://www.hcmut.edu.vn</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <header className="flex items-center gap-6">
            <h2 className="text-4xl font-semibold text-slate-200">
              Achievements
            </h2>
            <div className="h-px w-full flex-1 bg-slate-700" />
          </header>
          <ul className="list-disc list-inside ml-3">
            <li>
              <span className="mt-2 text-sm uppercase tracking-widest text-slate-400">CS50: Introduction to Computer Science</span>
            </li>
            <li>
              <span className="mt-2 text-sm uppercase tracking-widest text-slate-400">CS50: Introduction to Computer Science</span>
            </li>
            <li>
              <span className="mt-2 text-sm uppercase tracking-widest text-slate-400">CS50: Introduction to Computer Science</span>
            </li>
          </ul>
        </section>

        <section className="space-y-12">
          <header className="flex items-center gap-6">
            <h2 className="text-4xl font-semibold text-slate-200">
              Contact Me
            </h2>
            <div className="h-px flex-1 bg-slate-600" />
          </header>

          <p className="max-w-3xl text-lg leading-relaxed text-slate-300">
            I would love to hear about your project and how I can help. Please
            fill in the form, and I&apos;ll get back to you as soon as possible.
          </p>

          <form className="space-y-12">
            {[
              { id: "name", label: "Name", type: "text" },
              { id: "email", label: "Email", type: "email" },
            ].map((field) => (
              <div key={field.id} className="space-y-4">
                <label
                  htmlFor={field.id}
                  className="text-xs tracking-[0.35em] text-slate-500"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  value={field.id === "name" ? name : email}
                  onChange={(e) => field.id === "name" ? setName(e.target.value) : setEmail(e.target.value)}
                  placeholder=""
                  className="w-full border-b border-slate-600 bg-transparent pb-4 text-base text-slate-100 outline-none transition focus:border-slate-300"
                />
              </div>
            ))}

            <div className="space-y-4">
              <label
                htmlFor="message"
                className="text-xs tracking-[0.35em] text-slate-500"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border-b border-slate-600 bg-transparent pb-4 text-base text-slate-100 outline-none transition focus:border-slate-300"
              />
            </div>

            <div className="pt-4">
              <button
                type="button"
                className="group mx-auto flex flex-col items-center gap-3 text-xs font-medium uppercase tracking-[0.5em] text-slate-200 transition hover:text-sky-300"
                onClick={handleSendMessage}
              >
                Send Message
                <span className="h-[3px] w-24 bg-gradient-to-r from-slate-500 via-sky-400 to-slate-500 transition group-hover:via-sky-200" />
              </button>
            </div>
          </form>

          <footer className="flex flex-col gap-8 border-t border-slate-800 pt-10 md:flex-row md:items-center md:justify-between">
            <span className="text-xl font-semibold text-slate-100">
              Duy<span className="text-slate-400">Huynh</span>
            </span>
            <div className="flex items-center gap-4 text-slate-300">
              <Link
                href="https://www.linkedin.com/in/hu%E1%BB%B3nh-nguy%E1%BB%85n-duy-18b881334/"
                className="rounded-full border border-slate-700 p-2 transition hover:border-slate-500 hover:text-slate-100 bg-black text-white"
              >
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.instagram.com/duy._.liam/?hl=vi"
                className="rounded-full border border-slate-700 p-2 transition hover:border-slate-500 hover:text-slate-100 bg-black text-white"
              >
                <Instagram className="h-6 w-6" />
              </Link>
              <Link
                href="https://github.com/DuyHuynh3010"
                className="rounded-full border border-slate-700 p-2 transition hover:border-slate-500 hover:text-slate-100 bg-black text-white"
              >
                <Github className="h-6 w-6" />
              </Link>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}

export default PortfolioLandingPage;
