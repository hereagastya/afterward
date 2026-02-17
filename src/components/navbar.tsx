"use client"

import { useState, useEffect } from "react"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Link from "next/link"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "bg-[rgba(7,7,10,0.85)] backdrop-blur-2xl border-b border-[rgba(124,92,191,0.1)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          className="font-[var(--font-dm-mono)] text-[var(--text-primary)] tracking-[0.25em] text-xs font-medium hover:text-[var(--accent-bright)] transition-colors duration-300"
        >
          AFTERWARD.
        </Link>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 text-sm tracking-wide"
            >
              My Decisions
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 text-sm tracking-wide">
                My Decisions
              </button>
            </SignInButton>
          </SignedOut>

          <Link
            href="/pricing"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 text-sm tracking-wide"
          >
            Pricing
          </Link>

          <Link
            href="/about"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 text-sm tracking-wide"
          >
            About
          </Link>
        </div>

        {/* Right: Auth */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 text-sm hidden sm:inline-block">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-5 py-2 bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white rounded-full text-xs font-bold tracking-wider hover:shadow-[0_0_25px_rgba(124,92,191,0.5)] transition-all duration-300 hover:scale-105">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  )
}
