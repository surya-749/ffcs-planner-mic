"use client"

import { signIn } from "next-auth/react"

export default function LoginModal({ onClose }: { onClose: () => void }) {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">

      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-xl relative w-full max-w-[820px] min-h-[320px] flex flex-col items-center justify-center text-center p-10 gap-4">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-500 text-xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-3xl font-semibold">
          Welcome back!
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500">
          Login to continue
        </p>

        {/* Google Button */}
        <button
          onClick={() => signIn("google")}
          className="flex items-center gap-3 px-6 py-3 border rounded-xl shadow-sm hover:shadow-md transition mt-4"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            className="w-5 h-5"
          />

          <span className="font-medium">
            Sign in with Google
          </span>

        </button>

      </div>
    </div>
  )
}