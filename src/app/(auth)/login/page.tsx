"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/(auth)/AuthLayout";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { login } from "@/lib/auth";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Validate form
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Attempt login
    const result = login(formData.email, formData.password);

    if (result.success) {
      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      setErrors({ form: result.error || "Login failed" });
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to your account to continue your Health Monitoring with Nivara"
    >
      <form onSubmit={handleSubmit} className="grid gap-4 text-sm">
        {errors.form && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {errors.form}
          </div>
        )}

        <FormField
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          autoComplete="email"
        />

        <FormField
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          error={errors.password}
          autoComplete="current-password"
        />

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={isLoading}
          variant="primary"
        >
          Login
        </Button>
      </form>

      <footer className="text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 hover:underline font-semibold"
          >
            Register
          </Link>
        </p>
      </footer>
    </AuthLayout>
  );
};

export default Login;
