"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Check, 
  CreditCard,
  Sparkles,
  X,
  Lock,
  AlertCircle,
  QrCode,
  Upload,
  Camera,
  Clock
} from "lucide-react";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exported, setExported] = useState(false);

  // Dynamic Payment & Plan state
  const [paymentInfo, setPaymentInfo] = useState<any>({
    upiId: "smartdrobe@upi",
    upiAccountHolder: "SmartDrobe Official Merchant",
    upiQrImageUrl: "",
  });
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);

  // Profile Edit State
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // UPI Upgrade Modal state
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPlanObj, setSelectedPlanObj] = useState<any>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/payment-info").then((r) => r.json()),
      fetch("/api/plans").then((r) => r.json()),
    ])
      .then(([userData, payData, plansData]) => {
        if (userData.user) {
          setUser(userData.user);
          setName(userData.user.name || "");
          setAvatar(userData.user.avatar || "");
        }
        if (payData.upiId) setPaymentInfo(payData);
        if (plansData.plans && plansData.plans.length > 0) {
          setAvailablePlans(plansData.plans);
          setSelectedPlanObj(plansData.plans[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar((event.target?.result as string) || "");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileMsg("");

    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatar }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Profile update failed");

      setUser((prev: any) => ({ ...prev, name, avatar }));
      setProfileMsg("✓ Profile updated successfully!");
      setTimeout(() => setProfileMsg(""), 3000);
    } catch (err: any) {
      setProfileMsg(`Error: ${err.message}`);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleExportData = async () => {
    try {
      const [itemsRes, outfitsRes] = await Promise.all([
        fetch("/api/wardrobe"),
        fetch("/api/outfits"),
      ]);

      const itemsData = await itemsRes.json();
      const outfitsData = await outfitsRes.json();

      const exportPayload = {
        user,
        exportedAt: new Date().toISOString(),
        wardrobeItems: itemsData.items || [],
        savedOutfits: outfitsData.outfits || [],
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `smartdrobe_data_${user?.name?.replace(/\s+/g, "_") || "user"}.json`;
      a.click();
      setExported(true);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const handleSubmitUpiPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || !selectedPlanObj) return;

    setUpgrading(true);
    setUpgradeMessage("");

    try {
      const res = await fetch("/api/account/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlanObj.name, utrNumber }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upgrade failed");

      setUser((prev: any) => ({ 
        ...prev, 
        subscriptionPlan: `PENDING_${selectedPlanObj.name}`,
        paymentUtr: utrNumber 
      }));
      setUpgradeMessage(`✓ Success! UTR ${utrNumber} submitted. Admin will verify your payment shortly.`);

      setTimeout(() => {
        setIsUpgradeModalOpen(false);
        setUpgradeMessage("");
      }, 2000);
    } catch (err: any) {
      setUpgradeMessage(`Error: ${err.message}`);
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-40 bg-gray-100 rounded-2xl"></div>
      </div>
    );
  }

  const isPending = user?.subscriptionPlan?.startsWith("PENDING_");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Account Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Manage your profile picture, UPI plan subscriptions, data export, and security.</p>
      </div>

      {/* Profile Card & Avatar Uploader */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-subtle space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            Profile & Avatar Settings
          </h2>
          {profileMsg && (
            <span className={`text-xs font-semibold ${profileMsg.startsWith("✓") ? "text-emerald-600" : "text-red-600"}`}>
              {profileMsg}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group shrink-0">
            {avatar ? (
              <img src={avatar} alt={user?.name} className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-subtle" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-subtle">
                {user?.name?.charAt(0)}
              </div>
            )}
            <label className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-5 h-5" />
              <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
            </label>
          </div>

          <div className="space-y-3 flex-1 w-full">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100">
                Role: {user?.role}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isPending ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}>
                Plan: {user?.subscriptionPlan || "FREE"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Upload Profile Photo</label>
                <label className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100">
                  <span className="truncate">{avatar ? "Photo Selected" : "Choose Image File"}</span>
                  <Upload className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={updatingProfile}
            className="px-5 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
          >
            {updatingProfile ? "Saving Profile..." : "Save Profile Changes"}
          </button>
        </div>
      </form>

      {/* Subscription & Data Export */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-subtle space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-blue-600" />
              Subscription Plan Status
            </h3>

            {isPending ? (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                    Manual Verification Pending
                  </span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
                    {user?.subscriptionPlan}
                  </span>
                </div>
                <p className="text-xs text-amber-800">
                  Submitted UTR: <code className="font-mono font-bold bg-amber-100 px-1 py-0.5 rounded">{user?.paymentUtr}</code>. Admin will verify your UPI receipt and activate your plan.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-sm">
                    {user?.subscriptionPlan || "FREE Starter Plan"}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {user?.subscriptionPlan === "FREE"
                    ? "Standard limits. Upgrade via UPI QR code for manual admin verification."
                    : "Unlimited AI outfit generation & priority features active."}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="w-full py-2.5 rounded-xl bg-black text-white font-medium text-xs hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <QrCode className="w-4 h-4 text-blue-400" />
            {isPending ? "Submit New UPI Reference" : "Pay via UPI QR Code"}
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-subtle space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-3">
              <Download className="w-4 h-4 text-blue-600" />
              Data Export
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Download a complete JSON export of your clothing items, tags, colors, and saved AI outfits.
            </p>
          </div>
          <button
            onClick={handleExportData}
            className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-800 font-medium text-xs hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            {exported ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4 text-blue-600" />}
            {exported ? "Data Exported!" : "Export Wardrobe JSON Data"}
          </button>
        </div>
      </div>

      {/* Dynamic Manual UPI Payment Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-float w-full max-w-lg overflow-hidden space-y-6 p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-blue-600" />
                  UPI Payment & Manual Verification
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Scan merchant QR code, transfer funds, and enter your 12-digit UTR ID.</p>
              </div>
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {upgradeMessage && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                upgradeMessage.startsWith("✓") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{upgradeMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitUpiPayment} className="space-y-4">
              {/* Dynamic Plan Selection Radio Cards */}
              <div className="grid grid-cols-2 gap-3">
                {availablePlans.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlanObj(p)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all space-y-1 ${
                      selectedPlanObj?.id === p.id
                        ? "border-blue-600 bg-blue-50/50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-900 block">{p.title}</span>
                    <span className="text-base font-extrabold text-blue-600">₹{p.priceInr} / ${p.priceUsd} <span className="text-[10px] text-gray-500 font-normal">/ mo</span></span>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{p.description}</p>
                  </div>
                ))}
              </div>

              {/* Dynamic Admin Payment Receiving QR Display */}
              {selectedPlanObj && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center space-y-3">
                  <span className="text-xs font-bold text-gray-900 block">
                    Scan & Pay ₹{selectedPlanObj.priceInr} (${selectedPlanObj.priceUsd}) via Any UPI App
                  </span>
                  
                  <div className="w-44 h-44 bg-white p-2 rounded-xl border border-gray-200 mx-auto flex flex-col items-center justify-center space-y-2 shadow-subtle">
                    {paymentInfo.upiQrImageUrl ? (
                      <img src={paymentInfo.upiQrImageUrl} alt="Merchant QR" className="w-36 h-36 object-contain rounded" />
                    ) : (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=${encodeURIComponent(paymentInfo.upiId)}%26pn=${encodeURIComponent(paymentInfo.upiAccountHolder)}%26am=${selectedPlanObj.priceInr}`}
                        alt="Merchant QR Code"
                        className="w-36 h-36 object-contain rounded"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="inline-block bg-white px-3 py-1 rounded-lg border border-gray-200 text-xs font-mono font-bold text-gray-900">
                      Merchant UPI ID: <span className="text-blue-600">{paymentInfo.upiId}</span>
                    </div>
                    {paymentInfo.upiAccountHolder && (
                      <p className="text-[11px] text-gray-500">Payee: <span className="font-semibold text-gray-900">{paymentInfo.upiAccountHolder}</span></p>
                    )}
                  </div>
                </div>
              )}

              {/* UTR Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Enter 12-Digit UPI Transaction UTR / Ref Number *
                </label>
                <input
                  type="text"
                  required
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 429384729102"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={upgrading || !utrNumber.trim()}
                  className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {upgrading ? "Submitting Request..." : "Submit UTR for Verification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
