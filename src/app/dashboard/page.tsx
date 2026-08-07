"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Shirt, 
  Sparkles, 
  MessageSquare, 
  Plus, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Heart,
  TrendingUp,
  CloudSun,
  ShieldAlert
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [outfits, setOutfits] = useState<any[]>([]);
  const [gapData, setGapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        if (!userData.user) {
          window.location.href = "/login";
          return;
        }
        setUser(userData.user);

        const [itemsRes, outfitsRes, gapRes] = await Promise.all([
          fetch("/api/wardrobe"),
          fetch("/api/outfits"),
          fetch("/api/wardrobe/gap-analysis"),
        ]);

        const itemsData = await itemsRes.json();
        const outfitsData = await outfitsRes.json();
        const gapDataJson = await gapRes.json();

        setItems(itemsData.items || []);
        setOutfits(outfitsData.outfits || []);
        setGapData(gapDataJson);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
        <div className="h-28 bg-gray-100 rounded-2xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  // Category counts
  const categoryCounts = {
    Shirts: items.filter((i) => i.category === "Shirts").length,
    Pants: items.filter((i) => i.category === "Pants").length,
    Shoes: items.filter((i) => i.category === "Shoes").length,
    Jackets: items.filter((i) => i.category === "Jackets").length,
    Dresses: items.filter((i) => i.category === "Dresses").length,
    Accessories: items.filter((i) => i.category === "Accessories").length,
  };

  const favoriteCount = items.filter((i) => i.isFavorite).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-card">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            AI Wardrobe Intelligence Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
            Your digital wardrobe contains {items.length} cataloged items. Your personal AI stylist is ready for new outfit generations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/wardrobe"
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-xs hover:bg-blue-500 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </Link>
          <Link
            href="/outfits"
            className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-medium text-xs hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            Generate Outfit
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="apple-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500">Total Wardrobe</span>
            <div className="text-2xl font-bold text-gray-900 mt-1">{items.length} Items</div>
            <span className="text-[11px] text-gray-400 font-medium">Across 6 categories</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="apple-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500">Saved Outfits</span>
            <div className="text-2xl font-bold text-gray-900 mt-1">{outfits.length} Outfits</div>
            <span className="text-[11px] text-emerald-600 font-medium">✓ High Score Combos</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="apple-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500">Favorites</span>
            <div className="text-2xl font-bold text-gray-900 mt-1">{favoriteCount} Items</div>
            <span className="text-[11px] text-red-500 font-medium">Starred essentials</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
        </div>

        <div className="apple-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500">AI Compatibility</span>
            <div className="text-2xl font-bold text-gray-900 mt-1">96% Avg</div>
            <span className="text-[11px] text-blue-600 font-medium">Weather & Occasion</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Wardrobe Breakdown & AI Suggestion Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wardrobe Category Matrix */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-subtle space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Wardrobe Composition</h2>
              <p className="text-xs text-gray-500">Item distribution by fashion category</p>
            </div>
            <Link href="/wardrobe" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <Link
                key={cat}
                href={`/wardrobe?category=${cat}`}
                className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-300 transition-all flex flex-col justify-between"
              >
                <span className="text-xs font-medium text-gray-600">{cat}</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-xl font-bold text-gray-900">{count}</span>
                  <span className="text-[10px] text-gray-400">items</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Daily Weather & AI Outfit Recommendation */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-subtle space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                <CloudSun className="w-4 h-4" />
                Daily AI Suggestion
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                98% Match
              </span>
            </div>

            <h3 className="font-bold text-gray-900 text-base">Executive Minimalist</h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Recommended for today's mild 68°F weather. Clean Oxford shirt paired with charcoal pleated trousers and white leather sneakers.
            </p>
          </div>

          <Link
            href="/outfits"
            className="w-full py-2.5 rounded-xl bg-black text-white font-medium text-xs hover:bg-gray-800 transition-all text-center block shadow-sm"
          >
            Generate Custom Outfit
          </Link>
        </div>
      </div>

      {/* AI Smart Gap Analysis & Shopping Assistant */}
      {gapData && gapData.gapRecommendations?.length > 0 && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-black text-white p-6 rounded-2xl shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
                🛍️ AI Capsule Gap Analysis
              </span>
              <h2 className="text-xl font-bold text-white mt-1">Smart Wardrobe Shopping Recommendations</h2>
              <p className="text-xs text-gray-300">
                Adding these missing staple pieces will unlock <strong className="text-emerald-400">+{gapData.unlockedPotentialBoost} new outfit combinations</strong>!
              </p>
            </div>

            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-3 py-1.5 rounded-xl shrink-0">
              ⚡ +{gapData.unlockedPotentialBoost} Looks Boost
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {gapData.gapRecommendations.map((gap: any) => (
              <div key={gap.id} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-3 hover:bg-white/15 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-36 rounded-lg overflow-hidden relative bg-gray-900">
                    <img src={gap.imageUrl} alt={gap.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 text-[9px] bg-black/70 backdrop-blur text-white font-bold px-2 py-0.5 rounded-full">
                      {gap.estimatedPrice}
                    </span>
                  </div>

                  <span className="text-[10px] font-extrabold text-blue-300 uppercase tracking-wider block">{gap.category} Gap</span>
                  <h3 className="font-bold text-white text-xs leading-snug">{gap.title}</h3>
                  <p className="text-[11px] text-gray-300 leading-relaxed">{gap.reasoning}</p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-bold">+{gap.unlockedOutfitsCount} Combos</span>
                  <Link href="/wardrobe" className="text-blue-300 font-semibold hover:underline flex items-center gap-1">
                    Add Item <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Action Hub & Recent Outfits */}
      <div className="space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">Recent AI Generated Outfits</h2>

        {outfits.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center space-y-4">
            <Sparkles className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm font-medium text-gray-700">No outfits generated yet.</p>
            <Link
              href="/outfits"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium text-xs hover:bg-blue-500"
            >
              Generate your first outfit
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {outfits.slice(0, 4).map((outfit) => (
              <div key={outfit.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-sm">{outfit.title}</h3>
                  <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
                    {outfit.score}% Match
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="px-2 py-0.5 rounded bg-gray-100">{outfit.occasion}</span>
                  <span className="px-2 py-0.5 rounded bg-gray-100">{outfit.season}</span>
                  <span className="px-2 py-0.5 rounded bg-gray-100">{outfit.weather}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{outfit.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
