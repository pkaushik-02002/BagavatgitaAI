"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedGroup } from "@/components/ui/animated-group"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth" // Import useAuth

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

export function HeroSection() {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { user, loading } = useAuth() // Use the auth hook

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return // Don't submit empty queries

    // Wait for auth loading to complete
    if (loading) return

    if (user) {
      // User is logged in, redirect to chat with the query
      router.push(`/chat?prompt=${encodeURIComponent(query)}`)
    } else {
      // User is not logged in, redirect to login
      router.push("/login")
    }
    setQuery("") // Clear the input after submission
  }

  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
        >
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(45,100%,85%,.08)_0,hsla(45,100%,55%,.02)_50%,hsla(45,100%,45%,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(45,100%,85%,.06)_0,hsla(45,100%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(45,100%,85%,.04)_0,hsla(45,100%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24 md:pt-36">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
            />
            <div className="mx-auto max-w-4xl px-6">
              <div className="text-center">
                <AnimatedGroup variants={transitionVariants}>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                    What spiritual guidance do you seek?
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                    Start your journey with a simple question or reflection.
                  </p>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mb-12"
                >
                  <form onSubmit={handleHeroSubmit} className="relative max-w-3xl mx-auto">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <button
                          type="submit"
                          className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white hover:from-amber-600 hover:to-orange-700 transition-all"
                        >
                          <span className="text-lg font-semibold">+</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Ask about life's purpose, seek guidance on relationships, or explore Gita wisdom..."
                        className="w-full h-16 pl-16 pr-16 text-lg bg-white border border-amber-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-400"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <button
                          type="submit"
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-amber-100 hover:text-amber-700 transition-all"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </form>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 1,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-16"
                >
                  <button className="text-left p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-100 hover:border-amber-200">
                    <span className="text-gray-700">How can I find inner peace during difficult times?</span>
                  </button>
                  <button className="text-left p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors border border-orange-100 hover:border-orange-200">
                    <span className="text-gray-700">What does the Gita say about dharma and duty?</span>
                  </button>
                  <button className="text-left p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-100 hover:border-amber-200">
                    <span className="text-gray-700">Guide me through meditation and mindfulness</span>
                  </button>
                  <button className="text-left p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors border border-orange-100 hover:border-orange-200">
                    <span className="text-gray-700">What spiritual wisdom can you share?</span>
                  </button>
                </AnimatedGroup>

                <div className="text-sm text-gray-500 max-w-2xl mx-auto">
                  By asking a question, you agree to our{" "}
                  <Link href="/terms" className="text-amber-600 hover:text-amber-700 underline">
                    Terms of Use
                  </Link>{" "}
                  and acknowledge that you have read and understand our{" "}
                  <Link href="/privacy" className="text-amber-600 hover:text-amber-700 underline">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

const menuItems = [
  { name: "Features", href: "#features" },
  { name: "About", href: "#about" },
  { name: "Pricing", href: "#pricing" },
  { name: "Contact", href: "#contact" },
]

const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header>
      <nav data-state={menuState && "active"} className="fixed z-20 w-full px-2 group">
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled && "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center space-x-2">
                <GitaAILogo />
              </Link>
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  // Removed conditional class, explicitly set background for visibility
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-white"
                >
                  <Link href="/login">
                    <span>Sign In</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  // Removed conditional class, gradient should always apply
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                  <Link href="/signup">
                    <span>Get Started</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

const GitaAILogo = ({ className }: { className?: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <img src="/images/gitaai-logo.png" alt="GitaAI Logo" className={cn("h-12 w-auto", className)} />
    </div>
  )
}

export { GitaAILogo }
