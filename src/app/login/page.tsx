"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function LoginPage(): ReactElement {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Roadblock Remover
          </h1>
          <p className="mt-2 text-gray-600">
            Identify and eliminate engineering friction
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="mb-6 flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`flex-1 pb-3 text-sm font-medium ${
                activeTab === "login"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`flex-1 pb-3 text-sm font-medium ${
                activeTab === "register"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Create account
            </button>
          </div>

          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}
