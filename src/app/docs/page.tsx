"use client";

import { useState, useEffect } from "react";
import { Code, Server, Key, Terminal, Check, Copy } from "lucide-react";

export default function DocsPage() {
  const [openApiSpec, setOpenApiSpec] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((res) => res.json())
      .then((data) => setOpenApiSpec(data))
      .catch(console.error);
  }, []);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-100 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <Code className="w-3.5 h-3.5" />
          Developer Documentation
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">SmartDrobe REST API v1.0</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          OpenAPI 3.0 compatible endpoints for authenticating users, querying digital wardrobes, and requesting AI outfit recommendations.
        </p>
      </div>

      {/* Auth Guidance */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-3">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Key className="w-4 h-4 text-blue-600" />
          Authentication Specification
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          All protected endpoints require an HTTP-only JWT session cookie named <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-900 font-mono text-[11px]">smartdrobe_token</code> issued upon calling <code className="text-blue-600 font-mono">POST /api/auth/login</code>.
        </p>
      </div>

      {/* Endpoint Explorer */}
      <div className="space-y-6">
        <h2 className="font-bold text-gray-900 text-lg">Core API Endpoints</h2>

        {/* 1. POST /api/auth/login */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold font-mono uppercase">
              POST
            </span>
            <code className="text-sm font-bold text-gray-900 font-mono">/api/auth/login</code>
            <span className="text-xs text-gray-500">Authenticate user credentials</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-gray-950 text-gray-100 p-4 rounded-xl relative">
              <span className="text-[10px] text-gray-400 font-sans block mb-2 font-semibold">Request Body</span>
              <pre className="text-gray-300">{`{
  "email": "user@smartdrobe.ai",
  "password": "password123"
}`}</pre>
            </div>
            <div className="bg-gray-950 text-gray-100 p-4 rounded-xl relative">
              <span className="text-[10px] text-emerald-400 font-sans block mb-2 font-semibold">Response 200 OK</span>
              <pre className="text-gray-300">{`{
  "success": true,
  "user": {
    "id": "usr_9981",
    "name": "Sophia Chen",
    "role": "USER"
  }
}`}</pre>
            </div>
          </div>
        </div>

        {/* 2. GET /api/wardrobe */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold font-mono uppercase">
              GET
            </span>
            <code className="text-sm font-bold text-gray-900 font-mono">/api/wardrobe</code>
            <span className="text-xs text-gray-500">Fetch cataloged wardrobe items</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-gray-950 text-gray-100 p-4 rounded-xl relative">
              <span className="text-[10px] text-gray-400 font-sans block mb-2 font-semibold">Query Parameters</span>
              <pre className="text-gray-300">{`category = "Shirts" | "Pants" | "Shoes"
season = "Summer" | "Winter" | "All-Season"
search = "oxford"`}</pre>
            </div>
            <div className="bg-gray-950 text-gray-100 p-4 rounded-xl relative">
              <span className="text-[10px] text-emerald-400 font-sans block mb-2 font-semibold">Response 200 OK</span>
              <pre className="text-gray-300">{`{
  "items": [
    {
      "id": "item_01",
      "name": "Crisp Oxford Shirt",
      "category": "Shirts",
      "color": "White"
    }
  ]
}`}</pre>
            </div>
          </div>
        </div>

        {/* 3. POST /api/outfits/generate */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold font-mono uppercase">
              POST
            </span>
            <code className="text-sm font-bold text-gray-900 font-mono">/api/outfits/generate</code>
            <span className="text-xs text-gray-500">Execute AI styling algorithm</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-gray-950 text-gray-100 p-4 rounded-xl relative">
              <span className="text-[10px] text-gray-400 font-sans block mb-2 font-semibold">Request Body</span>
              <pre className="text-gray-300">{`{
  "occasion": "Work",
  "season": "Fall",
  "weather": "Cool 58°F",
  "style": "Minimalist"
}`}</pre>
            </div>
            <div className="bg-gray-950 text-gray-100 p-4 rounded-xl relative">
              <span className="text-[10px] text-emerald-400 font-sans block mb-2 font-semibold">Response 200 OK</span>
              <pre className="text-gray-300">{`{
  "outfit": {
    "title": "Executive Minimalist Look",
    "score": 98,
    "explanation": "Pairs crisp shirt..."
  }
}`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
