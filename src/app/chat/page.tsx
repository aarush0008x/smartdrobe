"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  RefreshCw, 
  MessageSquare,
  HelpCircle,
  Paperclip,
  Image as ImageIcon
} from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "✨ Generate image of a minimalist summer suit outfit",
    "How can I build a 10-piece capsule wardrobe?",
    "Explain the 60-30-10 color matching theory.",
    "Give me a 3-day travel packing matrix for rainy weather.",
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/chat");
      const data = await res.json();
      if (data.conversation?.messages) {
        setMessages(data.conversation.messages);
      }
    } catch (err) {
      console.error("Fetch chat history error:", err);
    }
  };

  const [generateImageToggle, setGenerateImageToggle] = useState(false);
  const [imageStep, setImageStep] = useState(0);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const isImageReq = generateImageToggle || text.toLowerCase().includes("image") || text.toLowerCase().includes("draw") || text.toLowerCase().includes("photo");

    if (isImageReq) {
      setImageStep(1);
      setTimeout(() => setImageStep(2), 800);
      setTimeout(() => setImageStep(3), 1600);
    } else {
      setImageStep(0);
    }

    const tempUserMsg = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text,
          generateImage: generateImageToggle 
        }),
      });

      const data = await res.json();
      if (data.assistantMessage) {
        setMessages((prev) => [...prev, data.assistantMessage]);
      }
    } catch (err) {
      console.error("Send chat message error:", err);
    } finally {
      setLoading(false);
      setImageStep(0);
    }
  };

  const [aiModelInfo, setAiModelInfo] = useState("Google Gemini 1.5 Flash");

  useEffect(() => {
    fetch("/api/ai-info")
      .then((r) => r.json())
      .then((d) => {
        if (d.activeModel) setAiModelInfo(d.activeModel);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-base">AI Stylist Assistant</h1>
            <p className="text-[11px] text-gray-500">Real-time fashion advice & capsule wardrobe strategy</p>
          </div>
        </div>

        <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-semibold border border-emerald-200">
          ● {aiModelInfo} Connected
        </span>
      </div>

      {/* Suggested Prompt Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 shrink-0 scrollbar-none">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 transition-colors shrink-0 text-left"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400 space-y-3">
            <MessageSquare className="w-10 h-10 text-gray-300" />
            <p className="text-sm font-medium text-gray-600">No conversation history yet.</p>
            <p className="text-xs text-gray-400 max-w-sm">
              Ask any styling question, color theory query, or capsule wardrobe planning advice!
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${
                m.role === "user" ? "ml-auto justify-end" : "mr-auto justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap space-y-3 ${
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none shadow-sm"
                    : "bg-white border border-gray-200 text-gray-900 rounded-bl-none shadow-subtle"
                }`}
              >
                <div>
                  {m.content.split(/(\*\*.*?\*\*)/g).map((part: string, i: number) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return <strong key={i} className="font-extrabold">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </div>

                {m.imageUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 shadow-sm max-w-sm bg-gray-100">
                    <img
                      src={m.imageUrl}
                      alt="AI Generated Outfit Render"
                      className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-2 bg-white/90 backdrop-blur text-[10px] font-bold text-gray-700 flex items-center justify-between">
                      <span>✨ AI Generated Fashion Render</span>
                      <span className="text-blue-600">8K High Res</span>
                    </div>
                  </div>
                )}
              </div>

              {m.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex gap-3 max-w-md w-full animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>

            {imageStep > 0 ? (
              <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-subtle space-y-3 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                    <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                    <span>Generating AI Outfit Render...</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {imageStep === 1 ? "33%" : imageStep === 2 ? "66%" : "99%"}
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-700 ease-out"
                    style={{ width: `${imageStep === 1 ? 33 : imageStep === 2 ? 66 : 99}%` }}
                  ></div>
                </div>

                {/* Animated Shimmer Image Preview Box */}
                <div className="h-44 rounded-xl bg-gradient-to-r from-gray-100 via-blue-50 to-gray-100 animate-pulse flex flex-col items-center justify-center p-4 text-center space-y-2 border border-gray-200 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center animate-bounce">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    {imageStep === 1
                      ? "Step 1/3: Analyzing wardrobe inventory & silhouette..."
                      : imageStep === 2
                      ? "Step 2/3: Synthesizing 60-30-10 color matrix & lighting..."
                      : "Step 3/3: Rendering 8K high-resolution fashion model..."}
                  </span>
                  <p className="text-[10px] text-gray-400">Processing ultra-high resolution image pipeline</p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white border border-gray-200 rounded-2xl text-xs text-gray-500 flex items-center gap-2 shadow-subtle">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                AI Stylist is processing your request...
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="pt-4 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI fashion stylist anything across any fashion category..."
            className="w-full pl-4 pr-28 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-blue-600 shadow-subtle"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setGenerateImageToggle(!generateImageToggle)}
              title="Toggle AI Outfit Image Generation"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                generateImageToggle
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Image</span>
            </button>

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-black text-white hover:bg-gray-800 disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
