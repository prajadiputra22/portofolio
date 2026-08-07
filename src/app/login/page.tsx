"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SubmitStatus = "idle" | "validating" | "success" | "error";

export default function Login() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitStatus === "validating" || submitStatus === "success") return;

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    setSubmitStatus("validating");
    setErrorMessage("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setSubmitStatus("error");
      setErrorMessage(body.error ?? "Username atau password salah.");
      setTimeout(() => setSubmitStatus("idle"), 2000);
      return;
    }

    setSubmitStatus("success");

    setTimeout(() => {
      setFadeOut(true);
      router.push("/dashboard");
      router.refresh();
    }, 800);
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-background text-on-background font-body-md overflow-hidden transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(123, 208, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(123, 208, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-tr from-background via-transparent to-primary-container/20 pointer-events-none z-0" />

      <main className="flex-grow flex items-center justify-center relative z-10 px-margin-mobile md:px-0">
        <div className="w-full max-w-[440px] rounded-xl p-8 md:p-12 transition-all duration-500 hover:border-secondary/40 shadow-2xl border border-[rgba(69,70,77,0.4)] bg-[rgba(16,20,21,0.7)] backdrop-blur-md">
          <div className="text-center mb-10">
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight mb-2">
              ARCHITECT.DEV
            </h1>
            <p className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest">
              System Authentication
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="font-label-mono text-caption text-on-surface-variant uppercase ml-1"
                htmlFor="username"
              >
                Username
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-secondary transition-colors">
                  person
                </span>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-4 pl-12 pr-4 text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all placeholder:text-on-surface-variant/40"
                  id="username"
                  name="username"
                  placeholder="architect_01"
                  required
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label
                  className="font-label-mono text-caption text-on-surface-variant uppercase"
                  htmlFor="password"
                >
                  Keyphrase
                </label>

                <a
                  className="font-caption text-caption text-secondary hover:text-on-secondary-container transition-colors"
                  href="#"
                >
                  Forgot Access?
                </a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-secondary transition-colors">
                  lock
                </span>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-4 pl-12 pr-4 text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all placeholder:text-on-surface-variant/40"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  onClick={togglePassword}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {submitStatus === "error" && (
              <p className="text-caption text-red-400 text-center">{errorMessage}</p>
            )}

            <button
              className={`w-full font-bold py-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 hover:shadow-[0_0_20px_rgba(123,208,255,0.3)] ${
                submitStatus === "success"
                  ? "bg-tertiary-container text-secondary"
                  : "bg-secondary text-on-secondary"
              }`}
              disabled={submitStatus === "validating" || submitStatus === "success"}
              type="submit"
            >
              {submitStatus === "idle" && (
                <>
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                  Access Dashboard
                </>
              )}
              {submitStatus === "validating" && (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                  Validating...
                </>
              )}
              {submitStatus === "success" && (
                <>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  Initializing Session
                </>
              )}
              {submitStatus === "error" && (
                <>
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="font-caption text-caption text-on-surface-variant">
              Unauthorized access is strictly logged and monitored.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}