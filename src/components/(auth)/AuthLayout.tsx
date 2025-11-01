"use client";
import React from "react";
import LiquidChrome from "./HeroBg";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center font-family-poppins justify-center min-h-screen bg-white">
      {/* Hero Section with Animated Background */}
      <section className="max-md:hidden block bg-black h-full w-full">
        <div className="h-full w-full relative min-h-screen">
          <LiquidChrome
            baseColor={[0, 0, 0.8]}
            speed={0.1}
            amplitude={0.3}
            interactive={true}
          />
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
