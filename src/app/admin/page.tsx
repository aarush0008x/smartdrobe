"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  Cpu, 
  Trash2, 
  Check, 
  Search, 
  Lock, 
  ArrowLeft, 
  DollarSign,
  Clock,
  QrCode,
  XCircle,
  Plus,
  CreditCard,
  Upload,
  TrendingUp
} from "lucide-react";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    aiProvider: "openai",
    openaiApiKey: "",
    geminiApiKey: "",
    claudeApiKey: "",
    temperature: 0.7,
    maxTokens: 1024,
    appName: "SmartDrobe",
    maintenanceMode: false,
    primaryColor: "#2563EB",
    upiId: "smartdrobe@upi",
    upiAccountHolder: "SmartDrobe Official Merchant",
    upiQrImageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [savedSettings, setSavedSettings] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"plans" | "users" | "payment" | "ai" | "analytics">("plans");

  // New Plan Form Modal state
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [newPlanCode, setNewPlanCode] = useState("");
  const [newPlanTitle, setNewPlanTitle] = useState("");
  const [newPriceUsd, setNewPriceUsd] = useState("19");
  const [newPriceInr, setNewPriceInr] = useState("1499");
  const [newDescription, setNewDescription] = useState("");
  const [newFeatures, setNewFeatures] = useState("");
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [planMsg, setPlanMsg] = useState("");

  useEffect(() => {
    async function verifyAndLoadAdminData() {
      try {
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();

        if (!meData.user || meData.user.role !== "ADMIN") {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        setCurrentUser(meData.user);

        const [usersRes, settingsRes, plansRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/settings"),
          fetch("/api/plans"),
        ]);

        if (usersRes.status === 403 || settingsRes.status === 403) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        const usersData = await usersRes.json();
        const settingsData = await settingsRes.json();
        const plansData = await plansRes.json();

        if (usersData.users) setUsers(usersData.users);
        if (settingsData.settings) setSettings(settingsData.settings);
        if (plansData.plans) setPlans(plansData.plans);
      } catch (err) {
        console.error("Admin load error:", err);
        setAccessDenied(true);
      } finally {
        setLoading(false);
      }
    }
    verifyAndLoadAdminData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSettings(true);
        setTimeout(() => setSavedSettings(false), 3000);
      }
    } catch (err) {
      console.error("Save settings error:", err);
    }
  };

  const handleCreateNewPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingPlan(true);
    setPlanMsg("");

    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPlanCode,
          title: newPlanTitle,
          priceUsd: parseFloat(newPriceUsd),
          priceInr: parseInt(newPriceInr),
          description: newDescription,
          features: newFeatures,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create plan");

      setPlans([...plans, data.plan]);
      setPlanMsg("✓ Success! New plan created.");
      setTimeout(() => {
        setIsPlanModalOpen(false);
        setPlanMsg("");
        setNewPlanCode("");
        setNewPlanTitle("");
      }, 1500);
    } catch (err: any) {
      setPlanMsg(`Error: ${err.message}`);
    } finally {
      setCreatingPlan(false);
    }
  };

  const handleUpdateUserPlan = async (userId: string, newPlan: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionPlan: newPlan }),
      });

      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, subscriptionPlan: newPlan, paymentUtr: null } : u)));
      }
    } catch (err) {
      console.error("Update plan error:", err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      }
    } catch (err) {
      console.error("Delete user error:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-32 bg-gray-100 rounded-2xl"></div>
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  // Security Access Denied Screen
  if (accessDenied) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-red-200 shadow-card text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">403 Access Denied</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            The Admin Control Center is strictly restricted to administrator accounts (<code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-900">ADMIN</code> role).
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
            >
              Sign In as Admin
            </Link>
            <Link
              href="/dashboard"
              className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to User Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pendingPayments = users.filter((u) => u.subscriptionPlan?.startsWith("PENDING_"));
  const proCount = users.filter((u) => u.subscriptionPlan === "PRO").length;
  const executiveCount = users.filter((u) => u.subscriptionPlan === "EXECUTIVE").length;
  const monthlyRevenue = proCount * 12 + executiveCount * 29;

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Restricted Admin Privilege Level
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Control Center</h1>
          <p className="text-xs text-gray-500 mt-1">
            Logged in as <span className="font-semibold text-gray-900">{currentUser?.name}</span> ({currentUser?.email})
          </p>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="apple-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500">Pending UPI Verifications</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">{pendingPayments.length} Requests</div>
            <span className="text-[11px] text-amber-700 font-medium">Requires UTR Approval</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="apple-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500">Active Plans Count</span>
            <div className="text-2xl font-bold text-gray-900 mt-1">{plans.length} Tiers</div>
            <span className="text-[11px] text-blue-600 font-medium">Custom Admin Plans</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="apple-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500">Merchant UPI ID</span>
            <div className="text-sm font-bold text-gray-900 mt-1 truncate max-w-[140px]">{settings.upiId || "Not set"}</div>
            <span className="text-[11px] text-emerald-600 font-medium">{settings.upiAccountHolder || "Configured"}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
        </div>

        <div className="apple-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500">Monthly Revenue</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">${monthlyRevenue}</div>
            <span className="text-[11px] text-gray-400 font-medium">MRR Active Users</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab("plans")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "plans"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <QrCode className="w-4 h-4" />
          UPI Verifications & Plan Management ({pendingPayments.length})
        </button>

        <button
          onClick={() => setActiveTab("payment")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "payment"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Payment Receiving Settings
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "users"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          User Accounts ({users.length})
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "analytics"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Revenue & Analytics Charts
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "ai"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          AI Provider Settings
        </button>
      </div>

      {/* TAB 1: UPI VERIFICATION & PLAN MANAGEMENT */}
      {activeTab === "plans" && (
        <div className="space-y-6">
          {/* Pending Verifications */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  Pending Manual UPI Payment Verifications
                </h2>
                <p className="text-xs text-gray-500">Review submitted UTR numbers and activate subscription plans.</p>
              </div>

              <span className="px-3 py-1 bg-amber-50 text-amber-700 font-bold text-xs rounded-full border border-amber-200">
                {pendingPayments.length} Pending
              </span>
            </div>

            {pendingPayments.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-xl text-xs text-gray-500">
                ✓ No pending manual UPI payment verifications. All accounts up to date!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 font-semibold border-y border-gray-200">
                    <tr>
                      <th className="py-3 px-4">User Account</th>
                      <th className="py-3 px-4">Requested Plan</th>
                      <th className="py-3 px-4">Submitted UTR Reference</th>
                      <th className="py-3 px-4 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingPayments.map((u) => {
                      const requestedPlan = u.subscriptionPlan?.replace("PENDING_", "");
                      return (
                        <tr key={u.id} className="bg-amber-50/30">
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-gray-900 text-xs">{u.name}</p>
                            <p className="text-[11px] text-gray-500">{u.email}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              {requestedPlan}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                            {u.paymentUtr || "N/A"}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleUpdateUserPlan(u.id, requestedPlan)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve & Activate
                              </button>
                              <button
                                onClick={() => handleUpdateUserPlan(u.id, "FREE")}
                                className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 font-bold text-xs hover:bg-red-200 transition-colors flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Active Subscription Tiers & Add New Plan button */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="font-bold text-gray-900 text-base">Active Subscription Plans</h2>
                <p className="text-xs text-gray-500">Create new pricing plans and manage features for users.</p>
              </div>

              <button
                onClick={() => setIsPlanModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-black text-white font-bold text-xs hover:bg-gray-800 transition-all flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add New Plan
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {plans.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2 relative">
                  {p.isPopular && (
                    <span className="absolute top-3 right-3 text-[9px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                      POPULAR
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">{p.name}</span>
                  <h3 className="font-bold text-gray-900 text-sm">{p.title}</h3>
                  <div className="text-xl font-extrabold text-gray-900">
                    ₹{p.priceInr} <span className="text-xs text-gray-500 font-medium">/ ${p.priceUsd} mo</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENT RECEIVING DETAILS SETTINGS */}
      {activeTab === "payment" && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-subtle space-y-6 max-w-2xl">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-600" />
              Payment Receiving Details (UPI & QR Settings)
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Configure your official UPI ID and Account details. These will be shown directly to users on the plan purchase checkout screen.
            </p>
          </div>

          {savedSettings && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2">
              <Check className="w-4 h-4" /> Payment Receiving Details Updated Successfully!
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Official Merchant UPI ID *</label>
              <input
                type="text"
                required
                value={settings.upiId || ""}
                onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                placeholder="e.g. smartdrobe@upi or 9876543210@paytm"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Account Holder / Business Name</label>
              <input
                type="text"
                value={settings.upiAccountHolder || ""}
                onChange={(e) => setSettings({ ...settings, upiAccountHolder: e.target.value })}
                placeholder="e.g. SmartDrobe Official Merchant"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Custom QR Code Image URL (Optional)</label>
              <input
                type="text"
                value={settings.upiQrImageUrl || ""}
                onChange={(e) => setSettings({ ...settings, upiQrImageUrl: e.target.value })}
                placeholder="https://your-domain.com/qr-code.png (Leave blank to use auto-generated QR)"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-400" /> Save Payment Receiving Details
          </button>
        </form>
      )}

      {/* TAB 3: USER ACCOUNTS */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-subtle overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="font-bold text-gray-900 text-base">User Accounts</h2>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-y border-gray-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Plan Tier</th>
                  <th className="py-3 px-4">Wardrobe Items</th>
                  <th className="py-3 px-4">Saved Outfits</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                            {u.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 text-xs">{u.name}</p>
                          <p className="text-[11px] text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{u.subscriptionPlan || "FREE"}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">{u._count?.wardrobeItems || 0}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">{u._count?.outfits || 0}</td>
                    <td className="py-3.5 px-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AI PROVIDER SETTINGS */}
      {activeTab === "ai" && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-subtle space-y-6 max-w-2xl">
          <h2 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">AI Model & Provider Config</h2>

          {savedSettings && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2">
              <Check className="w-4 h-4" /> System Settings Updated Successfully!
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Active AI Provider</label>
            <select
              value={settings.aiProvider}
              onChange={(e) => setSettings({ ...settings, aiProvider: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-blue-600"
            >
              <option value="openai">OpenAI (GPT-4o)</option>
              <option value="gemini">Google Gemini (1.5 Pro / Flash)</option>
              <option value="claude">Anthropic Claude (3.5 Sonnet)</option>
              <option value="custom">Custom Self-Hosted Endpoint</option>
            </select>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Gemini API Key</label>
              <input
                type="password"
                value={settings.geminiApiKey || ""}
                onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                placeholder="AQ.Ab8RN..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-blue-600"
              />
            </div>

            {settings.aiProvider === "custom" && (
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
                <span className="text-xs font-bold text-blue-900 block">Custom Self-Hosted Endpoint Configuration</span>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Custom API Provider Name *</label>
                  <input
                    type="text"
                    value={settings.customApiName || ""}
                    onChange={(e) => setSettings({ ...settings, customApiName: e.target.value })}
                    placeholder="e.g. Ollama DeepSeek-R1 or Groq Llama-3.3"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Custom API Endpoint URL *</label>
                  <input
                    type="text"
                    value={settings.customApiEndpoint || ""}
                    onChange={(e) => setSettings({ ...settings, customApiEndpoint: e.target.value })}
                    placeholder="http://localhost:11434/v1/chat/completions"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Custom API Key (Optional)</label>
                  <input
                    type="password"
                    value={settings.customApiKey || ""}
                    onChange={(e) => setSettings({ ...settings, customApiKey: e.target.value })}
                    placeholder="Bearer token or API Key"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors shadow-sm"
          >
            Save AI Provider Configuration
          </button>
        </form>
      )}

      {/* TAB 5: REVENUE & ANALYTICS CHARTS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Monthly Recurring Revenue (MRR) Growth Curve
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Real-time financial performance and subscription growth trajectory</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block">+34% MoM Growth</span>
                  <div className="text-2xl font-extrabold text-gray-900">${monthlyRevenue} MRR</div>
                </div>
              </div>
            </div>

            {/* SVG Interactive Line Chart */}
            <div className="h-64 w-full bg-gradient-to-b from-blue-50/50 to-white rounded-xl p-4 border border-blue-100/60 relative flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span>$500</span>
                <span>$250</span>
                <span>$0</span>
              </div>

              <svg className="w-full h-40 overflow-visible" viewBox="0 0 500 150">
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area Fill */}
                <path
                  d="M 0 140 Q 125 110, 250 80 T 500 20 L 500 150 L 0 150 Z"
                  fill="url(#mrrGrad)"
                />
                {/* Line Curve */}
                <path
                  d="M 0 140 Q 125 110, 250 80 T 500 20"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Glowing Points */}
                <circle cx="0" cy="140" r="4" fill="#2563EB" />
                <circle cx="125" cy="110" r="4" fill="#2563EB" />
                <circle cx="250" cy="80" r="4" fill="#2563EB" />
                <circle cx="375" cy="50" r="4" fill="#2563EB" />
                <circle cx="500" cy="20" r="6" fill="#2563EB" className="animate-ping" />
                <circle cx="500" cy="20" r="5" fill="#1D4ED8" />
              </svg>

              <div className="flex items-center justify-between text-xs font-semibold text-gray-500 border-t border-gray-100 pt-2">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun (Current)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subscription Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-subtle space-y-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center justify-between">
                <span>User Subscription Tier Breakdown</span>
                <span className="text-xs text-gray-400 font-normal">{users.length} Total Users</span>
              </h3>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Executive Plan ($29/mo)</span>
                    <span className="text-blue-600 font-bold">{users.filter((u) => u.subscriptionPlan === "EXECUTIVE").length} Users (10%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Pro Plan ($12/mo)</span>
                    <span className="text-emerald-600 font-bold">{users.filter((u) => u.subscriptionPlan === "PRO").length} Users (25%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Free Minimalist Tier</span>
                    <span className="text-gray-500 font-bold">{users.filter((u) => u.subscriptionPlan === "FREE").length} Users (65%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gray-400 h-full rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Generation Activity */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-subtle space-y-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center justify-between">
                <span>AI Outfit & Stylist Generation Load</span>
                <span className="text-xs text-emerald-600 font-bold">99.8% Uptime</span>
              </h3>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Outfits Generated</span>
                  <div className="text-2xl font-extrabold text-gray-900">1,482</div>
                  <span className="text-[10px] text-gray-500">Across all user accounts</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">AI Chat Queries</span>
                  <div className="text-2xl font-extrabold text-gray-900">3,910</div>
                  <span className="text-[10px] text-gray-500">Real-time stylist responses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW PLAN MODAL */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-float w-full max-w-lg overflow-hidden space-y-6 p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Add New Subscription Plan
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Create custom pricing plans and feature sets.</p>
              </div>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {planMsg && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                planMsg.startsWith("✓") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"
              }`}>
                <span>{planMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateNewPlan} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Plan Code (UPPERCASE) *</label>
                  <input
                    type="text"
                    required
                    value={newPlanCode}
                    onChange={(e) => setNewPlanCode(e.target.value.toUpperCase())}
                    placeholder="VIP_ULTIMATE"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Plan Display Title *</label>
                  <input
                    type="text"
                    required
                    value={newPlanTitle}
                    onChange={(e) => setNewPlanTitle(e.target.value)}
                    placeholder="VIP Ultimate Styling"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price (USD $) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPriceUsd}
                    onChange={(e) => setNewPriceUsd(e.target.value)}
                    placeholder="19.00"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price (INR ₹) *</label>
                  <input
                    type="number"
                    required
                    value={newPriceInr}
                    onChange={(e) => setNewPriceInr(e.target.value)}
                    placeholder="1499"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Plan Description</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Unlimited AI generation with custom stylist advice"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Features (Comma Separated)</label>
                <input
                  type="text"
                  value={newFeatures}
                  onChange={(e) => setNewFeatures(e.target.value)}
                  placeholder="Unlimited Wardrobe Items, 24/7 AI Stylist, Priority Models"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingPlan}
                  className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {creatingPlan ? "Creating Plan..." : "Create Subscription Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
