export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="text-xs text-gray-500">Effective Date: January 1, 2026</p>

      <div className="prose text-xs text-gray-600 space-y-4 leading-relaxed border-t border-gray-100 pt-6">
        <p>
          At SmartDrobe, we prioritize your privacy. This policy outlines how we collect, use, and protect your digital wardrobe information.
        </p>
        <h3 className="font-bold text-gray-900 text-sm">1. Information We Collect</h3>
        <p>
          We collect your email, account credentials, and metadata associated with your cataloged wardrobe items to generate tailored outfit recommendations.
        </p>
        <h3 className="font-bold text-gray-900 text-sm">2. Data Security</h3>
        <p>
          Your passwords are encrypted using bcrypt hashing and sessions are secured using signed HTTP-only JWT cookies.
        </p>
      </div>
    </div>
  );
}
