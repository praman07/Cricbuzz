import React from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  User,
  Mail,
  Lock,
  Shield,
} from "lucide-react";

const Register = () => {
  const {
    register,
    handleSubmit,
    errors,
    requestHandleRegisterSubmit,
    navigate,
  } = useAuth();

  const roles = [
    "SUPER_ADMIN",
    "ADMIN",
    "SCORER",
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col items-center justify-center px-4 pt-10 pb-6">
      {/* Header */}
      <div className="mb-3 text-center">
        <h1 className="text-3xl font-bold text-green-900">
          CricketManager Pro
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          The elite administrative platform for match scoring.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">
          Create Account
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Join the professional cricket scoring network.
        </p>

        {/* Google Button */}
        <button
          type="button"
          onClick={() => (window.location.href = "http://localhost:3000/api/auth/google")}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="google"
            className="h-5 w-5"
          />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="my-4 flex items-center">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="px-4 text-xs font-semibold text-gray-500">
            OR EMAIL
          </span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(
            requestHandleRegisterSubmit
          )}
          className="space-y-3"
        >
          {/* Full Name */}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-600">
              Full Name
            </label>

            <div className="relative">
              <User
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="John Smith"
                {...register("name", {
                  required: "Full Name is required",
                  minLength: {
                    value: 3,
                    message:
                      "Minimum 3 characters required",
                  },
                })}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-11 pr-4 outline-none transition focus:border-green-700"
              />
            </div>

            {errors.name && (
              <p className="mt-1 text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-600">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                placeholder="admin@cricketpro.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^\S+@\S+\.\S+$/,
                    message:
                      "Please enter a valid email",
                  },
                })}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-11 pr-4 outline-none transition focus:border-green-700"
              />
            </div>

            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-600">
              Role
            </label>

            <div className="relative">
              <Shield
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                {...register("role", {
                  required: "Role is required",
                })}
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-11 pr-4 outline-none transition focus:border-green-700"
              >
                <option value="">
                  Select Role
                </option>

                {roles.map((role) => (
                  <option
                    key={role}
                    value={role}
                  >
                    {role.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            {errors.role && (
              <p className="mt-1 text-xs text-red-500">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-600">
              Password
            </label>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required:
                    "Password is required",
                  minLength: {
                    value: 8,
                    message:
                      "Password must be at least 8 characters",
                  },
                })}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-11 pr-4 outline-none transition focus:border-green-700"
              />
            </div>

            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {
                  errors.password
                    .message
                }
              </p>
            )}
          </div>

          {/* Terms */}
          <p className="text-center text-xs leading-relaxed text-gray-500">
            By creating an account, you agree
            to our{" "}
            <span className="font-semibold text-green-900">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="font-semibold text-green-900">
              Privacy Policy
            </span>
            .
          </p>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-green-900 py-2.5 text-base font-semibold text-white transition hover:bg-green-800"
          >
            Create Account
          </button>

          {/* Login */}
          <div className="border-t pt-3 text-center">
            <span className="text-sm text-gray-500">
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
              className="ml-2 font-semibold text-green-900 hover:text-green-700"
            >
              Login here
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-gray-600">
        <button>HELP CENTER</button>
        <button>SYSTEM STATUS</button>
        <button>v4.2.0-STABLE</button>
      </div>
    </div>
  );
};

export default Register;