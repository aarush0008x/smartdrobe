"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Heart, 
  Trash2, 
  Edit3, 
  Tag, 
  Shirt, 
  X, 
  Check, 
  Upload,
  Camera,
  Image as ImageIcon,
  AlertCircle,
  FileSpreadsheet,
  Download
} from "lucide-react";

export default function WardrobePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  // Wardrobe Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  // Import Modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFileText, setImportFileText] = useState("");
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImportFileText((event.target?.result as string) || "");
      };
      reader.readAsText(file);
    }
  };

  const downloadCsvTemplate = () => {
    const csvContent = "name,category,color,season,occasion,tags,imageUrl\nMinimalist Linen Shirt,Shirts,White,Summer,Casual,linen,https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80\nRaw Selvedge Denim,Pants,Dark Blue,All-Season,Work,denim,https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wardrobe_import_template.csv";
    a.click();
  };

  const handleExecuteImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFileText.trim()) return;

    setImporting(true);
    setImportMessage("");

    try {
      let payload: any = {};
      if (importFileText.trim().startsWith("[")) {
        payload.items = JSON.parse(importFileText);
      } else {
        payload.csvContent = importFileText;
      }

      const res = await fetch("/api/wardrobe/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");

      setImportMessage(`✓ Success! Imported ${data.count} clothing items.`);
      fetchItems();
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportMessage("");
      }, 1500);
    } catch (err: any) {
      setImportMessage(`Error: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Shirts");
  const [imageUrl, setImageUrl] = useState("");
  const [color, setColor] = useState("White");
  const [season, setSeason] = useState("All-Season");
  const [occasion, setOccasion] = useState("Casual");
  const [tags, setTags] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const categories = ["All", "Shirts", "Pants", "Shoes", "Jackets", "Dresses", "Accessories"];
  const seasons = ["All", "Spring", "Summer", "Fall", "Winter", "All-Season"];

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, selectedSeason, search]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let url = `/api/wardrobe?category=${selectedCategory}&season=${selectedSeason}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error("Fetch wardrobe error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setName("");
    setCategory("Shirts");
    setImageUrl("https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80");
    setColor("White");
    setSeason("All-Season");
    setOccasion("Casual");
    setTags("cotton, minimal, breathable");
    setIsFavorite(false);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setModalMode("edit");
    setActiveItemId(item.id);
    setName(item.name);
    setCategory(item.category);
    setImageUrl(item.imageUrl);
    setColor(item.color);
    setSeason(item.season);
    setOccasion(item.occasion);
    setTags(item.tags);
    setIsFavorite(item.isFavorite);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name || !imageUrl) {
      setFormError("Name and Image are required");
      return;
    }

    setSaving(true);
    try {
      let res;
      if (modalMode === "create") {
        res = await fetch("/api/wardrobe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            category,
            imageUrl,
            color,
            season,
            occasion,
            tags,
            isFavorite,
          }),
        });
      } else {
        res = await fetch(`/api/wardrobe/${activeItemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            category,
            imageUrl,
            color,
            season,
            occasion,
            tags,
            isFavorite,
          }),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save item");
      }

      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this clothing item?")) return;

    try {
      await fetch(`/api/wardrobe/${id}`, { method: "DELETE" });
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleToggleFavorite = async (item: any) => {
    const newFavoriteState = !item.isFavorite;
    setItems(items.map((i) => (i.id === item.id ? { ...i, isFavorite: newFavoriteState } : i)));

    try {
      await fetch(`/api/wardrobe/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: newFavoriteState }),
      });
    } catch (err) {
      console.error("Favorite toggle error:", err);
    }
  };

  const filteredItems = items.filter((item) => (onlyFavorites ? item.isFavorite : true));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Digital Wardrobe</h1>
          <p className="text-xs text-gray-500 mt-1">Organize, edit, and catalog your complete clothing collection.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setImportFileText("");
              setImportMessage("");
              setIsImportModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-800 font-semibold text-xs hover:bg-gray-200 transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            Import Wardrobe
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-black text-white font-medium text-xs hover:bg-gray-800 transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Clothing Item
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, color, or tags (e.g. linen, oxford, dark blue)..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          {/* Season Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 font-medium shrink-0">Season:</span>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:border-blue-600"
            >
              {seasons.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Favorites Filter */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              onlyFavorites
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? "fill-red-600 text-red-600" : ""}`} />
            Starred Only
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Wardrobe Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center space-y-4">
          <Shirt className="w-10 h-10 text-gray-400 mx-auto" />
          <p className="text-sm font-semibold text-gray-900">No clothing items found.</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try resetting your search filters or click "Add Clothing Item" to populate your wardrobe.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="apple-card rounded-2xl overflow-hidden group flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-black/80 text-white backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-semibold">
                  {item.category}
                </span>

                {/* Favorite Toggle Button */}
                <button
                  onClick={() => handleToggleFavorite(item)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 shadow-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${item.isFavorite ? "fill-red-600 text-red-600" : ""}`} />
                </button>
              </div>

              {/* Item Info */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {item.color}
                    </span>
                    <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {item.season}
                    </span>
                  </div>

                  {item.tags && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
                      <Tag className="w-3 h-3" />
                      <span className="truncate">{item.tags}</span>
                    </div>
                  )}
                </div>

                {/* Edit & Delete Controls */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-float w-full max-w-lg overflow-hidden space-y-6 p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {modalMode === "create" ? "Add New Clothing Item" : "Edit Clothing Item"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-xs text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Minimalist Oxford Crisp Shirt"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Photo Upload & Camera Section */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Clothing Image (Upload / Camera)</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-colors">
                      <Upload className="w-4 h-4 text-blue-600" />
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-colors">
                      <Camera className="w-4 h-4 text-blue-600" />
                      Take Photo
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Image Live Preview */}
                  {imageUrl && (
                    <div className="relative h-36 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or paste an Image URL (https://...)"
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-[11px] focus:outline-none focus:border-blue-600 text-gray-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
                  >
                    {categories.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Color Label</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. White, Black, Navy"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Season</label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
                  >
                    {seasons.filter((s) => s !== "All").map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Occasion</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
                  >
                    <option value="Casual">Casual</option>
                    <option value="Work">Work</option>
                    <option value="Formal">Formal</option>
                    <option value="Party">Party</option>
                    <option value="Sport">Sport</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="linen, crisp, formal, breathable"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="modalFavorite"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="modalFavorite" className="text-xs text-gray-700 font-medium">
                  Star as Favorite Item
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : modalMode === "create" ? "Add Item" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Import Wardrobe Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-float w-full max-w-lg overflow-hidden space-y-6 p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                  Import Wardrobe Inventory
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Upload CSV or JSON files to batch populate your wardrobe catalog.</p>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {importMessage && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                importMessage.startsWith("✓") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{importMessage}</span>
              </div>
            )}

            <form onSubmit={handleExecuteImport} className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700">CSV / JSON File Upload</label>
                <button
                  type="button"
                  onClick={downloadCsvTemplate}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download CSV Template
                </button>
              </div>

              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl cursor-pointer bg-gray-50/50 transition-all">
                <Upload className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-xs font-bold text-gray-900">Click to Select CSV or JSON File</span>
                <span className="text-[11px] text-gray-400 mt-1">Supports name, category, color, season, occasion, tags, imageUrl</span>
                <input
                  type="file"
                  accept=".csv,.json,text/csv,application/json"
                  onChange={handleImportFileChange}
                  className="hidden"
                />
              </label>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Raw Import Data (CSV or JSON string)</label>
                <textarea
                  rows={4}
                  value={importFileText}
                  onChange={(e) => setImportFileText(e.target.value)}
                  placeholder="name,category,color,season,occasion,tags,imageUrl&#10;Linen Shirt,Shirts,White,Summer,Casual,linen,https://..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={importing || !importFileText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {importing ? "Importing Items..." : "Execute Wardrobe Import"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
