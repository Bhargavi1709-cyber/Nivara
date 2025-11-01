import React, { forwardRef } from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, className = "", ...rest }, ref) => {
    return (
      <div className="w-full">
        <label className="block font-semibold text-sm mb-1 text-gray-700">
          {label}
        </label>
        <div
          className={`w-full border rounded-md p-2.5 text-sm transition-all duration-200 ${
            error
              ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500"
              : "border-gray-300 focus-within:ring-2 focus-within:ring-blue-500"
          } focus-within:border-transparent ${className}`}
        >
          <input
            ref={ref}
            className="outline-0 w-full h-full bg-transparent"
            {...rest}
          />
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-gray-500 text-xs mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
