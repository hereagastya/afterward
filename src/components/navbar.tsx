"use client"

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link"

export function Navbar() {
  const { user, isLoaded } = useUser()

  return (
    <div className="z-10 w-full max-w-6xl items-center justify-between font-mono text-sm lg:flex lg:absolute lg:top-10 lg:px-10">
      {/* Logo */}
      <Link 
        href="/"
        className="fixed left-0 top-0 flex w-full justify-center border-b border-white/5 bg-black/50 pb-6 pt-8 backdrop-blur-md lg:static lg:w-auto lg:border-none lg:bg-transparent lg:p-0 text-white/90 tracking-widest text-xs font-light hover:text-white transition-colors"
      >
        AFTERWARD.
      </Link>

      {/* Nav Links */}
      <div className="fixed top-24 right-10 lg:static flex items-center space-x-6">
        {/* My Decisions - only show if signed in */}
        <SignedIn>
          <Link 
            href="/dashboard"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            My Decisions
          </Link>
        </SignedIn>

        {/* My Decisions - trigger sign in if not signed in */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-gray-400 hover:text-white transition-colors text-sm">
              My Decisions
            </button>
          </SignInButton>
        </SignedOut>

        {/* Pricing */}
        <Link 
          href="/pricing"
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          Pricing
        </Link>

        {/* About */}
        <Link 
          href="/about"
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          About
        </Link>

        {/* Auth Buttons */}
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-gray-400 hover:text-white transition-colors text-sm">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-5 py-2.5 bg-gradient-to-r from-[#8B6FD4] to-[#B794F4] text-white rounded-full text-xs font-bold hover:shadow-[0_0_15px_rgba(139,111,212,0.4)] transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
          </SignUpButton>
        </SignedOut>
      </div>
    </div>
  )
}
