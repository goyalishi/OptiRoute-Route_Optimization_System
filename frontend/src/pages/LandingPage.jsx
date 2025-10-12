

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleGetStarted = () => {
    if (onGetStarted) return onGetStarted()
    scrollToSection("features")
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav
        role="navigation"
        aria-label="Main"
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                aria-hidden="true"
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                RouteOptimizer
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("benefits")}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Benefits
              </button>
              <button
                type="button"
                onClick={handleGetStarted}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Get Started
              </button>
            </div>
            <button
              type="button"
              onClick={handleGetStarted}
              className="md:hidden px-4 py-2 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-28">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply blur-xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-blue-600 text-sm font-medium">Smart Route Planning</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-balance">
                Optimize Your
                <span className="block bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                  Delivery Routes
                </span>
                <span className="block">Save Time & Money</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Intelligent route optimization system for logistics companies. Reduce costs by up to 30%, improve
                delivery times, and maximize driver efficiency with our AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg font-medium hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 group"
                >
                  Start Free Trial
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection("how-it-works")}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                  Watch Demo
                </button>
              </div>
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-gray-800">500+</div>
                  <div className="text-sm text-gray-600">Active Companies</div>
                </div>
                <div className="w-px h-12 bg-gray-300" aria-hidden="true"></div>
                <div>
                  <div className="text-3xl font-bold text-gray-800">10K+</div>
                  <div className="text-sm text-gray-600">Routes Optimized</div>
                </div>
                <div className="w-px h-12 bg-gray-300" aria-hidden="true"></div>
                <div>
                  <div className="text-3xl font-bold text-gray-800">30%</div>
                  <div className="text-sm text-gray-600">Cost Reduction</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                  {/* Mock Dashboard */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-32 bg-gradient-to-r from-blue-600 to-green-500 rounded"></div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full"></div>
                        <div className="w-8 h-8 bg-green-100 rounded-full"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="w-8 h-8 bg-blue-600 rounded-lg mb-2"></div>
                          <div className="h-2 w-12 bg-gray-300 rounded mb-2"></div>
                          <div className="h-4 w-16 bg-gray-400 rounded"></div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl p-6 text-white relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full"></div>
                      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
                      <div className="relative">
                        <div className="text-sm opacity-90 mb-1">Active Routes</div>
                        <div className="text-3xl font-bold mb-4">127</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-white rounded-full animate-pulse"></div>
                          </div>
                          <span className="text-sm">75%</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
                          <span className="text-xs text-gray-600">Drivers Online</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">48</div>
                      </div>
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" aria-hidden="true"></div>
                          <span className="text-xs text-gray-600">Avg. Time Saved</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">23m</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          aria-hidden="true"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4">
              <span className="text-blue-600 text-sm font-medium">Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Everything You Need to
              <span className="block bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Optimize Deliveries
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your logistics operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                ),
                title: "Smart Route Optimization",
                description:
                  "AI-powered algorithms optimize routes based on distance, time, traffic, and multiple delivery points.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Real-Time Tracking",
                description:
                  "Track driver locations and delivery status in real-time with live updates and notifications.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                ),
                title: "Analytics Dashboard",
                description: "Comprehensive analytics showing delivery metrics, completion rates, and distance saved.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ),
                title: "Driver Management",
                description:
                  "Invite and manage drivers with unique codes. Assign routes and track performance effortlessly.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                    />
                  </svg>
                ),
                title: "Maps Integration",
                description: "Seamless mapping for navigation with accurate ETAs and clear directions.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
                title: "Delivery Verification",
                description: "Proof of delivery with photo uploads, digital signatures, and confirmations.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 h-full hover:border-transparent hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-green-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-white rounded-full mb-4 shadow-sm">
              <span className="text-blue-600 text-sm font-medium">How It Works</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Get Started in
              <span className="block bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Three Simple Steps
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">From setup to optimization in minutes</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Add Delivery Locations",
                description:
                  "Enter delivery addresses manually or upload from CSV. Our system validates and geocodes all locations automatically.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Optimize & Assign Routes",
                description:
                  "Our AI analyzes traffic, distance, and delivery windows to create the most efficient routes. Assign to drivers with one click.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Track & Complete",
                description:
                  "Drivers receive routes on mobile, navigate with maps, and mark deliveries complete in real-time. Monitor progress from admin dashboard.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative mb-12 last:mb-0"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        {item.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-blue-600 shadow-md">
                        {item.step}
                      </div>
                    </div>
                    {index < 2 && (
                      <div className="w-0.5 h-20 bg-gradient-to-b from-blue-600 to-green-500 mx-auto mt-4 opacity-30"></div>
                    )}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <h3 className="text-2xl font-bold mb-3 text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits/Stats Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4">
              <span className="text-blue-600 text-sm font-medium">Benefits</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Measurable Results
              <span className="block bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                You Can Count On
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                value: "30%",
                label: "Cost Reduction",
                sublabel: "Average savings on fuel & time",
                icon: (
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-3.314 0-6 1.79-6 4s2.686 4 6 4 6-1.79 6-4-2.686-4-6-4z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M7 6l10 0" />
                  </svg>
                ),
              },
              {
                value: "45m",
                label: "Time Saved",
                sublabel: "Per route on average",
                icon: (
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
              {
                value: "25%",
                label: "More Deliveries",
                sublabel: "Completed per day",
                icon: (
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h18M7 7h10M5 11h14M8 15h8M10 19h4"
                    />
                  </svg>
                ),
              },
              {
                value: "98%",
                label: "Driver Satisfaction",
                sublabel: "Easier route management",
                icon: (
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.5 9.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 15a7 7 0 0110 0" />
                  </svg>
                ),
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div aria-hidden="true">{stat.icon}</div>
                <div className="mt-4 text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-xl font-semibold text-gray-800 mb-2">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
              Ready to Optimize Your Routes?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join hundreds of companies saving time and money with smart route optimization
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={handleGetStarted}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 group"
              >
                Get Started Free
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-all"
              >
                Learn More
              </button>
            </div>
            <p className="text-sm text-white/70 mt-6">No credit card required • Free 14-day trial • Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div
                aria-hidden="true"
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold">RouteOptimizer</span>
            </div>
            <div className="text-gray-400 text-sm">© 2025 RouteOptimizer. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
