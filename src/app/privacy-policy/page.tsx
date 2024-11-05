export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold mb-2">Overview</h2>
        <p>
          This privacy policy explains how our anonymous confession app collects, uses, and protects your information.
          We are committed to ensuring your privacy while providing a safe space for sharing confessions.
        </p>

        <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Location Data:</strong> We collect your approximate location only when you view or post confessions.
            For privacy protection, posted confessions use a randomized location within a 500-meter radius of your actual position.
          </li>
          <li>
            <strong>Confession Content:</strong> The text content of your confessions is stored in our database.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">What We Don&apos;t Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Personal identification information (name, email, phone number)</li>
          <li>User accounts or login information</li>
          <li>Device information</li>
          <li>Cookies or tracking data</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">Data Retention</h2>
        <p>
          Confessions are stored indefinitely but can be removed upon request within the first 24 hours of posting.
          After 24 hours, confessions become permanent parts of the platform.
        </p>

        <h2 className="text-2xl font-semibold mb-2">Data Protection</h2>
        <p>
          We implement appropriate technical measures to protect the data we collect.
          Location data is only used for displaying nearby confessions and is never shared with third parties.
        </p>

        <h2 className="text-2xl font-semibold mb-2">Contact</h2>
        <p>
          If you have any questions about this privacy policy or need to request a confession removal (within 24 hours of posting),
          please contact us at support@inkognito.app
        </p>
      </section>
    </div>
  );
}
