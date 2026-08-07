"use client";

import { useState } from "react";
import { 
  Sparkles, 
  RefreshCw, 
  Bookmark, 
  Heart, 
  Check, 
  Sliders, 
  Shirt, 
  ArrowRight,
  TrendingUp,
  User
} from "lucide-react";

export default function OutfitsPage() {
  const [occasion, setOccasion] = useState("Work");
  const [season, setSeason] = useState("All-Season");
  const [weather, setWeather] = useState("Mild Indoor 68°F");
  const [style, setStyle] = useState("Executive Minimalist");
  const [mood, setMood] = useState("Refined");
  const [colorPreference, setColorPreference] = useState("Monochromatic White & Charcoal");
  const [budget, setBudget] = useState("Standard");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [modelGender, setModelGender] = useState<"men" | "women">("men");

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch("/api/outfits/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion,
          season,
          weather,
          style,
          mood,
          colorPreference,
          budget,
        }),
      });

      const data = await res.json();
      setResult(data.outfit);
    } catch (err) {
      console.error("Generate outfit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    try {
      await fetch("/api/outfits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: result.title,
          occasion: result.occasion,
          season: result.season,
          weather: result.weather,
          score: result.score,
          explanation: result.explanation,
          clothingItemIds: result.clothingItemIds,
          isFavorite: true,
        }),
      });
      setSaved(true);
    } catch (err) {
      console.error("Save outfit error:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-100 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          AI Outfit Recommendation Engine
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Generate AI Outfit</h1>
        <p className="text-xs text-gray-500 mt-1">Configure your environment parameters for tailored algorithmic fashion matching.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Form Sidebar */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-subtle space-y-6">
          <h2 className="font-bold text-gray-900 text-base flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sliders className="w-4 h-4 text-blue-600" />
            Style Parameters
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Occasion</label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="Work">Work / Executive Meeting</option>
                <option value="Casual">Casual Weekend</option>
                <option value="Formal">Formal Event / Black Tie</option>
                <option value="Party">Evening Cocktail Party</option>
                <option value="Sport">Active & Outdoor</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Season</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Fall">Fall</option>
                  <option value="Winter">Winter</option>
                  <option value="All-Season">All-Season</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Style Silhouette</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="Executive Minimalist">Executive Minimalist</option>
                  <option value="Smart Casual">Smart Casual</option>
                  <option value="Streetwear Relaxed">Streetwear Relaxed</option>
                  <option value="Cocktail Chic">Cocktail Chic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Weather & Temperature</label>
              <input
                type="text"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                placeholder="e.g. Mild Indoor 68°F"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Mood & Vibe</label>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="e.g. Refined, Confident, Understated"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Color Palette Preference</label>
              <input
                type="text"
                value={colorPreference}
                onChange={(e) => setColorPreference(e.target.value)}
                placeholder="e.g. Monochromatic White & Charcoal"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-black text-white font-medium text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                  Generating AI Combination...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Generate AI Outfit
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-7 space-y-6">
          {!result ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Select style criteria & click generate</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                SmartDrobe will scan your wardrobe inventory and match clothing items according to fabric weight, color harmonies, and weather parameters.
              </p>
            </div>
          ) : (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-card space-y-6 animate-in fade-in duration-300">
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    Generated Recommendation
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mt-1">{result.title}</h2>
                </div>

                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-extrabold text-emerald-700">{result.score}% Match</span>
                </div>
              </div>

              {/* AI Generated Outfit Image Render */}
              {result.generatedImageUrl && (
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-subtle relative bg-gray-900 group">
                  <img
                    src={result.generatedImageUrl}
                    alt={result.title}
                    className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white space-y-1">
                    <span className="text-[10px] font-bold bg-blue-600 text-white px-2.5 py-0.5 rounded-full w-fit uppercase tracking-wider">
                      ✨ AI Visual Model Render
                    </span>
                    <h3 className="text-lg font-bold">{result.title}</h3>
                    <p className="text-xs text-gray-300">Generated high-fashion editorial preview matching your wardrobe items.</p>
                  </div>
                </div>
              )}

              {/* Explanation text */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-700 leading-relaxed space-y-2">
                <span className="font-semibold text-gray-900 block">AI Stylist Rationale:</span>
                <p>{result.explanation}</p>
              </div>

              {/* Dummy Man / Woman Model Same-Day Outfit Preview */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-600" />
                      Dummy Model Same-Day Outfit Preview
                    </h3>
                    <p className="text-[11px] text-gray-500">Matching ensemble for Shirt, Jeans, Boots, Belt & Watch</p>
                  </div>

                  {/* Gender Model Switcher */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-subtle shrink-0">
                    <button
                      type="button"
                      onClick={() => setModelGender("men")}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        modelGender === "men" ? "bg-black text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Man Model ♂
                    </button>
                    <button
                      type="button"
                      onClick={() => setModelGender("women")}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        modelGender === "women" ? "bg-black text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Woman Model ♀
                    </button>
                  </div>
                </div>

                {/* 5-Layer Outfit Composition Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {/* 1. Shirt */}
                  <div className="p-2.5 bg-white rounded-xl border border-gray-200 space-y-2 text-center shadow-subtle">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">1. Shirt</span>
                    <div className="h-24 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={result.outfitComposition?.shirt?.imageUrl || result.items?.[0]?.imageUrl}
                        alt="Shirt"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-gray-900 text-[11px] truncate">{result.outfitComposition?.shirt?.name || "Oxford Shirt"}</p>
                  </div>

                  {/* 2. Belt */}
                  <div className="p-2.5 bg-white rounded-xl border border-gray-200 space-y-2 text-center shadow-subtle">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">2. Belt</span>
                    <div className="h-24 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={result.outfitComposition?.belt?.imageUrl || "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=600&q=80"}
                        alt="Belt"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-gray-900 text-[11px] truncate">{result.outfitComposition?.belt?.name || "Leather Belt"}</p>
                  </div>

                  {/* 3. Jeans */}
                  <div className="p-2.5 bg-white rounded-xl border border-gray-200 space-y-2 text-center shadow-subtle">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">3. Jeans</span>
                    <div className="h-24 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={result.outfitComposition?.jeans?.imageUrl || result.items?.[1]?.imageUrl}
                        alt="Jeans"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-gray-900 text-[11px] truncate">{result.outfitComposition?.jeans?.name || "Raw Selvedge Denim"}</p>
                  </div>

                  {/* 4. Boots */}
                  <div className="p-2.5 bg-white rounded-xl border border-gray-200 space-y-2 text-center shadow-subtle">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">4. Boots</span>
                    <div className="h-24 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={result.outfitComposition?.boots?.imageUrl || result.items?.[2]?.imageUrl}
                        alt="Boots"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-gray-900 text-[11px] truncate">{result.outfitComposition?.boots?.name || "Chelsea Boots"}</p>
                  </div>

                  {/* 5. Watch */}
                  <div className="p-2.5 bg-white rounded-xl border border-gray-200 space-y-2 text-center shadow-subtle col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">5. Watch</span>
                    <div className="h-24 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={result.outfitComposition?.watch?.imageUrl || "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80"}
                        alt="Watch"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-gray-900 text-[11px] truncate">{result.outfitComposition?.watch?.name || "Steel Watch"}</p>
                  </div>
                </div>
              </div>

              {/* Matched Wardrobe Items Display */}
              {result.items && result.items.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Shirt className="w-4 h-4 text-blue-600" />
                      Matched Wardrobe Clothing Items ({result.items.length})
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                      From Your Vault
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {result.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all flex flex-col justify-between space-y-2"
                      >
                        <div className="relative h-28 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-1.5 left-1.5 bg-black/80 text-white px-2 py-0.5 rounded text-[9px] font-bold">
                            {item.category}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-xs truncate">{item.name}</h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                              {item.color}
                            </span>
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                              {item.season}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Outfit Metadata tags */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 font-medium rounded-lg">Occasion: {result.occasion}</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 font-medium rounded-lg">Season: {result.season}</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 font-medium rounded-lg">Weather: {result.weather}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleGenerate()}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 text-xs font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerate Outfit
                </button>

                <button
                  onClick={handleSave}
                  disabled={saved}
                  className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    saved
                      ? "bg-emerald-600 text-white"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {saved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Outfit Saved!
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5" />
                      Save to My Outfits
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
