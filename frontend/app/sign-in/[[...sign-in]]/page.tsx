"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <main className="min-h-svh bg-[#eef4f1] p-3 sm:p-5 lg:p-6">
      <div className="mx-auto flex min-h-[calc(100svh-24px)] w-full max-w-375 overflow-hidden rounded-[28px] bg-[#f8f6ef] shadow-[0_20px_80px_-30px_rgba(20,60,45,0.25)] sm:min-h-[calc(100svh-40px)] lg:h-[calc(100svh-48px)]">
        <section className="relative hidden overflow-hidden rounded-r-[28px] lg:block lg:w-[52%]">
          <Image
            src="/images/signup-auth.png"
            alt="DHARITRI land acquisition intelligence"
            fill
            className="absolute inset-0 h-full w-full object-fill"
            loading="eager"
          />

          <div className="absolute inset-0 bg-emerald-950/5" />
        </section>

        <section className="relative flex min-h-[calc(100svh-24px)] w-full items-center justify-center overflow-hidden rounded-r-[28px] bg-[#faf9f4] px-6 py-8 sm:px-10 sm:py-10 lg:min-h-0 lg:w-[48%] lg:items-start lg:px-10 lg:py-3 xl:px-14">
          <div className="absolute right-8 top-7 hidden text-right sm:block lg:right-12">
            <p className="font-sans text-xs leading-relaxed text-slate-700">
              A more transparent
              <br />
              tomorrow
            </p>

            <div className="ml-auto mt-3 h-px w-7 bg-emerald-400" />
          </div>

          <div className="w-full max-w-107.5 lg:zoom-[0.78]">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                <span className="text-2xl">🌿</span>
              </div>

              <div>
                <h1 className="font-serif text-2xl font-semibold tracking-tight text-slate-900">
                  DHARITRI
                </h1>

                <p className="text-[10px] tracking-wide text-slate-500">
                  Land Acquisition Intelligence
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Welcome back
              </h2>

              <p className="mt-3 max-w-sm text-base leading-relaxed text-slate-600">
                Sign in to continue managing your land acquisition workspace.
              </p>
            </div>

            <div className="flex w-full justify-center">
              <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                fallbackRedirectUrl="/dashboard"
                signUpFallbackRedirectUrl="/dashboard"
                appearance={{
                  variables: {
                    colorPrimary: "#086b4f",
                    colorForeground: "#17231e",
                    colorMutedForeground: "#64716b",
                    colorBackground: "transparent",
                    colorInput: "#ffffff",
                    colorInputForeground: "#17231e",
                    borderRadius: "12px",
                  },

                  elements: {
                    rootBox: "w-full",
                    card: "mx-auto w-full min-w-0 overflow-hidden rounded-[24px] bg-transparent shadow-none border border-slate-200 p-0",

                    header: "hidden",
                    main: "w-full",

                    socialButtonsBlock: "w-full",
                    socialButtonsBlockButton:
                      "h-12 w-full rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 shadow-none transition-all hover:border-emerald-300 hover:bg-emerald-50",

                    socialButtonsBlockButtonText:
                      "text-sm font-semibold text-slate-800",

                    dividerLine: "bg-slate-200",
                    dividerText: "text-xs text-slate-400",

                    formFieldLabel: "mb-2 text-sm font-semibold text-slate-800",

                    formFieldInput:
                      "h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-none outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10",

                    formButtonPrimary:
                      "h-12 w-full rounded-xl bg-emerald-700 text-sm font-semibold text-white shadow-none transition-all hover:bg-emerald-800",

                    footerAction: "mt-6",

                    footerActionText: "text-sm text-slate-600",

                    footerActionLink:
                      "font-semibold text-emerald-700 hover:text-emerald-800",

                    identityPreview:
                      "rounded-xl border border-slate-200 bg-white",

                    formFieldInputShowPasswordButton:
                      "text-slate-400 hover:text-slate-700",

                    formFieldErrorText: "mt-1 text-xs font-medium text-red-600",

                    alert:
                      "rounded-xl border border-red-200 bg-red-50 text-sm text-red-700",

                    footer: "bg-transparent rounded-b-[24px]",
                  },
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
