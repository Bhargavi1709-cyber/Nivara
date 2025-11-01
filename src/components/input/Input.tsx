import React from "react";

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  type: string;
}

const Input = ({ type, ...rest }: InputProps) => {
  if (type === "email") {
    return (
      <div className="w-full border border-black/20 rounded-md p-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <input
          type="email"
          className="outline-0 w-full h-full"
          placeholder="Enter your email"
          {...rest}
        />
      </div>
    );
  }
  if (type === "password") {
    return (
      <div className="w-full border border-black/20 rounded-md p-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <input
          type="password"
          className="outline-0 w-full h-full"
          placeholder="Enter your password"
          {...rest}
        />
      </div>
    );
  }

  return (
    <input
      type={type}
      className={`
            h-full w-full
            outline-none 

            ${rest.className ? rest.className : ""}`}
      {...rest}
    />
  );
};

export default Input;
