"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { X } from "lucide-react"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const links = [
    { href: "/dashboard", label: "My Decisions", authRequired: true },
    { href: "/pricing", label: "Pricing", authRequired: false },
    { href: "/about", label: "About", authRequired: false },
  ]

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-full bg-[rgba(124,92,191,0.1)] backdrop-blur-md border border-[rgba(124,92,191,0.2)] active:scale-95 transition-all duration-300"
        aria-label="Open menu"
      >
        <span className={`w-6 h-0.5 rounded-full bg-gradient-to-r from-[#7c5cbf] to-[#c4a8ff] transition-all duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`} />
        <span className={`w-4 h-0.5 rounded-full bg-gradient-to-r from-[#7c5cbf] to-[#c4a8ff] transition-all duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`} />
        <span className={`w-6 h-0.5 rounded-full bg-gradient-to-r from-[#7c5cbf] to-[#c4a8ff] transition-all duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`} />
      
        {/* X Icon (Absolute to overlay) */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90 pointer-events-none"}`}>
            <X className="w-6 h-6 text-[#c4a8ff]" />
        </div>
      </button>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[rgba(7,7,10,0.98)] backdrop-blur-2xl noise-overlay flex flex-col justify-center px-8"
          >
            {/* Close Button Trigger (invisible overlay on button area used to close? No, button toggles state) */}
             <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full transparent"
                aria-label="Close menu"
            />
            
            <nav className="flex flex-col gap-8">
              {links.map((link, i) => (
                <MenuLink 
                    key={link.href} 
                    link={link} 
                    index={i} 
                    onClick={() => setIsOpen(false)} 
                />
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-12 flex flex-col gap-4"
            >
              <SignedOut>
                <SignInButton mode="modal">
                  <button onClick={() => setIsOpen(false)} className="text-[var(--text-secondary)] text-lg tracking-wide hover:text-white transition-colors text-left">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button onClick={() => setIsOpen(false)} className="w-full py-4 text-center bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white rounded-xl font-bold tracking-widest text-sm uppercase shadow-[0_0_30px_rgba(124,92,191,0.3)]">
                    Get Started
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                 <Link href="/dashboard" onClick={() => setIsOpen(false)} className="w-full py-4 text-center bg-white/5 border border-white/10 text-white rounded-xl font-bold tracking-widest text-sm uppercase">
                    Go to Dashboard
                 </Link>
              </SignedIn>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MenuLink({ link, index, onClick }: { link: any, index: number, onClick: () => void }) {
    // Only show "My Decisions" if signed in, but we can handle that logic in parent
    if (link.authRequired) {
        return (
            <div className="block">
                <SignedIn>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                    >
                        <Link 
                            href={link.href} 
                            onClick={onClick}
                            className="font-[var(--font-playfair)] text-4xl text-[var(--text-primary)] hover:text-[var(--accent-bright)] hover:translate-x-2 transition-all duration-300 block"
                        >
                            {link.label}
                        </Link>
                    </motion.div>
                </SignedIn>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
        >
            <Link 
                href={link.href} 
                onClick={onClick}
                className="font-[var(--font-playfair)] text-4xl text-[var(--text-primary)] hover:text-[var(--accent-bright)] hover:translate-x-2 transition-all duration-300 block"
            >
                {link.label}
            </Link>
        </motion.div>
    )
}
