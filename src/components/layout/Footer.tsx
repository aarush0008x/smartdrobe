import Link from "next/link";
import { Shirt, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20 text-gray-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
                <Shirt className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-gray-900 tracking-tight">
                Smart<span className="text-blue-600">Drobe</span>
              </span>
            </Link>
            <p className="text-gray-500 max-w-sm text-xs leading-relaxed">
              An AI-powered minimalist wardrobe management platform designed to curate timeless outfits, digitize clothing items, and optimize your personal style matrix.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link></li>
              <li><Link href="/wardrobe" className="hover:text-gray-900 transition-colors">Digital Wardrobe</Link></li>
              <li><Link href="/outfits" className="hover:text-gray-900 transition-colors">AI Outfit Generator</Link></li>
              <li><Link href="/chat" className="hover:text-gray-900 transition-colors">AI Stylist Chat</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-3">Developers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/docs" className="hover:text-gray-900 transition-colors">REST API Docs</Link></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">OpenAPI Spec</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-3">Legal & Support</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} SmartDrobe Inc. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            All AI Systems Operational
          </p>
        </div>
      </div>
    </footer>
  );
}
