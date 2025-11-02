"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/(auth)/AuthLayout";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { signup, isAuthenticated } from "@/lib/auth";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    } else {
      // @ts-ignore - Safe to set state here for route protection
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Validate form
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Attempt signup
    const result = signup(formData.fullName, formData.email, formData.password);

    if (result.success) {
      // Redirect to health inputs for first time data entry
      router.push("/healthinputs");
    } else {
      setErrors({ form: result.error || "Signup failed" });
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up for an account to continue your Health Monitoring with Nivara"
    >
      <form onSubmit={handleSubmit} className="grid gap-4 text-sm">
        {errors.form && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {errors.form}
          </div>
        )}

        <FormField
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          error={errors.fullName}
          autoComplete="name"
        />

        <FormField
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          autoComplete="email"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Password"
            type="password"
            placeholder="Create password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            error={errors.password}
            autoComplete="new-password"
          />

          <FormField
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
        </div>

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={isLoading}
          variant="primary"
        >
          Sign Up
        </Button>
      </form>

      <footer className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </footer>
    </AuthLayout>
  );
};

export default Signup;
