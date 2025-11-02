"use client";
import React from "react";
import LiquidChrome from "./HeroBg";
import { useRouter } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center font-family-poppins justify-center min-h-screen bg-white">
      {/* Hero Section with Animated Background */}
      <section className="max-md:hidden block bg-black h-full w-full relative overflow-hidden">
        <div className="h-full w-full relative min-h-screen">
          <LiquidChrome
            baseColor={[0, 0, 0.8]}
            speed={0.1}
            amplitude={0.3}
            interactive={true}
          />
        </div>
        <div className="absolute top-0 left-0  h-full min-w-full">
          <div className="h-full w-full flex flex-col items-start justify-between px-12 pb-16 py-8 bg-black/10">
            <button
              onClick={() => {
                router.back();
              }}
              className="text-white flex items-center gap-2 font-medium bg-white/40 px-1 pr-3 py-2 text-sm rounded-md cursor-pointer hover:bg-white/60 transition"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </span>
              Back
            </button>
            <div className="">
              <p className="text-white text-3xl lg:text-4xl font-semibold">
                Feel better. Live better.
              </p>
              <p className=" max-w-sm lg:text-lg text-white/80 mt-1">
                Monitor your health and get mindful support that keeps you
                balanced.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="p-4 md:p-6 grid px-6 max-w-md w-full gap-6 md:gap-8 mx-auto">
        {/* Header */}
        <header className="text-start font-family-nunito">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Nivara</h1>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {title}
            </h2>
            <p className="text-sm md:text-base mt-2 font-medium text-gray-600">
              {subtitle}
            </p>
          </div>
        </header>

        {/* Form Content */}
        {children}
      </section>
    </div>
  );
};

export default AuthLayout;
