"use client";

import Link from "next/link";
import { 
  Shirt, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Zap, 
  Compass, 
  Sliders,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const features = [
    {
      icon: Layers,
      title: "Digital Wardrobe Vault",
      desc: "Catalog every clothing item by category, color, season, and occasion with high-resolution imagery and instant metadata tagging.",
    },
    {
      icon: Sparkles,
      title: "AI Outfit Generator",
      desc: "Instant algorithmically balanced outfit combinations tailored to your daily weather, occasion, mood, and budget parameters.",
    },
    {
      icon: MessageSquare,
      title: "AI Stylist Chat Assistant",
      desc: "Real-time conversational fashion intelligence for capsule wardrobe strategy, color theory advice, and event preparation.",
    },
    {
      icon: Sliders,
      title: "Configurable AI Architecture",
      desc: "Seamless support for OpenAI GPT-4o, Google Gemini 1.5, Claude 3.5 Sonnet, or custom self-hosted LLM endpoints.",
    },
    {
      icon: Compass,
      title: "Travel Packing Matrix",
      desc: "Automated carry-on outfit optimization for 3 to 14 day trips based on destination weather forecasts.",
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Grade Security",
      desc: "JWT authentication, strict password hashing, role-based authorization, and complete audit logging.",
    },
  ];

  const faqs = [
    {
      q: "How does SmartDrobe generate outfit recommendations?",
      a: "SmartDrobe analyzes your saved digital wardrobe inventory against your specified occasion, weather, season, and personal color preferences using advanced prompt algorithms and matrix scoring.",
    },
    {
      q: "Can I connect my own OpenAI or Gemini API key?",
      a: "Yes! SmartDrobe includes an Admin Settings panel where you can select your preferred AI model provider and input custom API keys with configurable token and temperature thresholds.",
    },
    {
      q: "Is SmartDrobe mobile friendly?",
      a: "SmartDrobe is engineered with a responsive minimalist UI designed to work seamlessly across iOS, Android, tablets, and desktop displays.",
    },
    {
      q: "Can I export my wardrobe data?",
      a: "Yes, you can export your entire wardrobe catalog and outfit history as a CSV or JSON file at any time from your Account Settings page.",
    },
  ];

  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 overflow-hidden border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen AI Wardrobe Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 max-w-4xl mx-auto leading-[1.1] mb-6">
            Intelligent Wardrobe Management for the <span className="text-blue-600">Modern Minimalist</span>.
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Digitize your wardrobe, eliminate daily decision fatigue, and receive AI-curated outfit recommendations aligned with your weather, mood, and schedule.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-black text-white font-medium text-sm hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              Start Free Today
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/docs"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-medium text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
              Explore REST API
            </Link>
          </div>

          {/* Interactive UI Mockup Card */}
          <div className="relative max-w-5xl mx-auto rounded-2xl border border-gray-200 bg-white p-3 shadow-card overflow-hidden">
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-xs text-gray-400 font-mono ml-2">smartdrobe.ai/dashboard</span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">
                  AI Model: GPT-4o Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-subtle">
                  <span className="text-xs text-gray-500 font-medium">Wardrobe Items</span>
                  <div className="text-2xl font-bold text-gray-900 mt-1">48 Items</div>
                  <p className="text-xs text-blue-600 font-medium mt-2">✓ 100% Categorized</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-subtle">
                  <span className="text-xs text-gray-500 font-medium">Daily Recommendation</span>
                  <div className="text-base font-semibold text-gray-900 mt-1">Executive Minimalist</div>
                  <p className="text-xs text-gray-500 mt-2">Crisp Oxford + Pleated Trousers</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-subtle">
                  <span className="text-xs text-gray-500 font-medium">AI Matching Score</span>
                  <div className="text-2xl font-bold text-gray-900 mt-1">98%</div>
                  <p className="text-xs text-emerald-600 font-medium mt-2">Optimal Weather Match</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Engineered for Precision & Clarity
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Everything you need to streamline your wardrobe, curate signature styles, and leverage artificial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="apple-card p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
              How SmartDrobe Works
            </h2>
            <p className="text-gray-600 text-sm">Three effortless steps to transform your daily dressing routine.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg mx-auto">
                1
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Upload Your Clothing</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Add photos or tags for your shirts, pants, jackets, shoes, and accessories.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mx-auto">
                2
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Set Occasion & Weather</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Select your event type, season, current weather, and preferred color parameters.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg mx-auto">
                3
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Get AI Styled</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Receive instant curated outfit combinations complete with matching scores and styling advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
            Transparent Pricing
          </h2>
          <p className="text-gray-600 text-sm">Choose the tier that matches your wardrobe scale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white border border-gray-200 p-8 rounded-2xl flex flex-col justify-between shadow-subtle">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-xs text-gray-500 mb-6">Ideal for organizing core wardrobe items.</p>
              <div className="text-4xl font-extrabold text-gray-900 mb-6">$0 <span className="text-xs font-normal text-gray-500">/ month</span></div>

              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Up to 50 Wardrobe Items
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  15 AI Outfit Generations / mo
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Basic Stylist AI Chat
                </li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="w-full text-center py-3 rounded-xl bg-gray-100 text-gray-900 font-medium text-sm hover:bg-gray-200 transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-white border-2 border-blue-600 p-8 rounded-2xl flex flex-col justify-between shadow-card relative">
            <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[11px] uppercase tracking-wider font-bold px-3 py-0.5 rounded-full">
              Recommended
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pro Styling</h3>
              <p className="text-xs text-gray-500 mb-6">Unlimited AI power and full API access.</p>
              <div className="text-4xl font-extrabold text-gray-900 mb-6">$12 <span className="text-xs font-normal text-gray-500">/ month</span></div>

              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Unlimited Digital Wardrobe Items
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Unlimited AI Outfit Generations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Custom AI Provider API Keys
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Travel Packing Assistant
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Priority REST API Keys
                </li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="w-full text-center py-3 rounded-xl bg-black text-white font-medium text-sm hover:bg-gray-800 transition-colors shadow-sm"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-500 text-sm">Everything you need to know about SmartDrobe.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black text-white rounded-3xl p-10 sm:p-16 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">Ready to Elevate Your Style?</h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of users digitizing their wardrobes and receiving daily AI recommendations.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-500 transition-colors shadow-lg"
          >
            Create Your SmartDrobe Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
