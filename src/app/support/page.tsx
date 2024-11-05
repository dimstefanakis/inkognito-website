export default function Support() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Support</h1>

      <section className="space-y-4">
        <p>
          Need help or have questions? We&apos;re here to assist you.
          Please reach out to us at:
        </p>
        
        <div className="bg-gray-900 p-6 rounded-lg mt-4">
          <p className="text-lg font-semibold">Email Support</p>
          <a 
            href="mailto:support@inkognito.app" 
            className="text-blue-600 hover:text-blue-800 text-lg"
          >
            support@inkognito.app
          </a>
        </div>

        <p className="text-sm text-gray-600 mt-4">
          We typically respond to all inquiries within 24-48 hours.
        </p>
      </section>
    </div>
  );
}
