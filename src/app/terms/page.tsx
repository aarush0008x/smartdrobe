export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
      <p className="text-xs text-gray-500">Effective Date: January 1, 2026</p>

      <div className="prose text-xs text-gray-600 space-y-4 leading-relaxed border-t border-gray-100 pt-6">
        <p>
          Welcome to SmartDrobe. By accessing or using our wardrobe management platform and AI recommendation services, you agree to be bound by these Terms of Service.
        </p>
        <h3 className="font-bold text-gray-900 text-sm">1. Account Registration</h3>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
        </p>
        <h3 className="font-bold text-gray-900 text-sm">2. Content & Digital Wardrobe Data</h3>
        <p>
          You retain ownership of all images, tags, and data you upload to your SmartDrobe inventory.
        </p>
        <h3 className="font-bold text-gray-900 text-sm">3. AI Service Usage</h3>
        <p>
          AI-generated outfit suggestions are provided for stylistic guidance and recommendations.
        </p>
      </div>
    </div>
  );
}
