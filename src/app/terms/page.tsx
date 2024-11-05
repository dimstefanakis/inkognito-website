export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing or using our confession app, you agree to be bound by these Terms of Service.
          If you do not agree to these terms, please do not use the app.
        </p>

        <h2 className="text-2xl font-semibold mb-2">2. Service Description</h2>
        <p>
          Our app provides a platform for users to anonymously share and view confessions within their vicinity.
          The service is available in two tiers:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Free Tier:</strong> Allows users to:
            <ul className="list-circle pl-6 mt-1">
              <li>View confessions within a 10km radius</li>
              <li>Post anonymous confessions</li>
              <li>View confessions in list format</li>
            </ul>
          </li>
          <li>
            <strong>Premium Tier ($3.99/week):</strong> Includes all free features plus:
            <ul className="list-circle pl-6 mt-1">
              <li>Interactive map view of confessions</li>
              <li>3-day free trial for new subscribers</li>
            </ul>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">3. Subscription Terms</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
          <li>The 3-day free trial is available only once per user</li>
          <li>You can cancel your subscription at any time through your app store account</li>
          <li>No refunds are provided for partial subscription periods</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">4. User Content Guidelines</h2>
        <p>Users agree not to post content that:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Contains personal information of others</li>
          <li>Is spam or commercial advertising</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">5. Content Removal</h2>
        <p>
          Users may request removal of their confessions within 24 hours of posting.
          We reserve the right to remove any content that violates these terms or that we deem inappropriate.
        </p>

        <h2 className="text-2xl font-semibold mb-2">6. Privacy</h2>
        <p>
          Your use of the service is also governed by our Privacy Policy.
          Please review our Privacy Policy to understand how we collect and use information.
        </p>

        <h2 className="text-2xl font-semibold mb-2">7. Modifications to Service</h2>
        <p>
          We reserve the right to modify or discontinue the service at any time.
          We may also update these terms from time to time.
          Continued use of the service after changes constitutes acceptance of new terms.
        </p>

        <h2 className="text-2xl font-semibold mb-2">8. Disclaimer</h2>
        <p>
          The service is provided &quot;as is&quot; without warranties of any kind.
          We are not responsible for the accuracy or content of user submissions.
        </p>

        <h2 className="text-2xl font-semibold mb-2">9. Contact</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at support@inkognito.app
        </p>
      </section>
    </div>
  );
}
