import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    requestHandleLoginSubmit,
    register,
    handleSubmit,
    errors,
    navigate,
  } = useAuth();

  return (
    <div className="h-screen overflow-hidden bg-linear-to-br from-green-100 via-white to-green-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[80vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="grid h-full lg:grid-cols-2">
          {/* Left Side */}
          <div className="relative hidden h-full lg:block">
            <img
              src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e"
              alt="stadium"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-t from-green-950/90 via-green-950/40 to-black/50" />

            <div className="absolute bottom-10 left-10 text-white">
              <h1 className="mb-3 text-4xl font-bold">
                CricketManager Pro
              </h1>

              <p className="max-w-md text-base text-gray-200">
                Experience the next generation of
                high-performance cricket analytics and
                live match administration.
              </p>

              <div className="mt-6 flex gap-8">
                <div>
                  <h2 className="text-5xl font-bold">
                    24/7
                  </h2>
                  <p className="text-gray-300">
                    Live Scoring
                  </p>
                </div>

                <div className="border-l border-white/30 pl-8">
                  <h2 className="text-5xl font-bold">
                    100+
                  </h2>
                  <p className="text-gray-300">
                    Global Leagues
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center justify-center px-8 py-4 lg:px-10">
            <div className="w-full max-w-md">
              {/* Header */}
              <h2 className="text-3xl font-bold text-green-900">
                Welcome Back
              </h2>

              <p className="mt-1 text-gray-500">
                Sign in to your administrator dashboard
              </p>

              {/* Google Login */}
              <button
                type="button"
                onClick={() => (window.location.href = "http://localhost:3000/api/auth/google")}
                className="mt-5 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="google"
                  className="h-5 w-5"
                />
                Continue with Google
              </button>

              {/* Divider */}
              <div className="my-5 flex items-center">
                <div className="h-px flex-1 bg-gray-300" />
                <span className="px-4 text-xs font-semibold text-gray-500">
                  OR EMAIL
                </span>
                <div className="h-px flex-1 bg-gray-300" />
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(
                  requestHandleLoginSubmit
                )}
                className="space-y-3"
              >
                {/* Email */}
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      {...register("email", {
                        required:
                          "Email is required",
                      })}
                      type="email"
                      placeholder="admin@cricketpro.com"
                      className="w-full rounded-lg border border-gray-300 py-2.5 pl-12 pr-4 outline-none transition focus:border-green-700"
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="font-medium text-gray-700">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-sm font-medium text-green-800"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      {...register("password", {
                        required:
                          "Password is required",
                        minLength: {
                          value: 6,
                          message:
                            "Password must be at least 6 characters",
                        },
                      })}
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-gray-300 py-2.5 pl-12 pr-12 outline-none transition focus:border-green-700"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {
                        errors.password
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                  />

                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-600"
                  >
                    Remember this device
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-green-900 py-3 text-base font-semibold text-white transition hover:bg-green-800"
                >
                  Sign In
                </button>
              </form>

              {/* Footer */}
              <div className="mt-4 border-t border-gray-200 pt-4 text-center">
                <span className="text-sm text-gray-500">
                  New to the platform?
                </span>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="ml-2 font-semibold text-green-900 hover:text-green-700"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;