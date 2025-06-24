export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing or using Leaks, our anonymous secret-sharing app, you agree to be bound by these
          Terms of Service. If you do not agree to these terms, please do not use the app.
        </p>

        <h2 className="text-2xl font-semibold mb-2">2. Service Description</h2>
        <p>
          Leaks lets people anonymously post secrets and discover nearby ones. To expand what you can see beyond
          your immediate area we offer two optional subscription plans:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Regional subscription:</strong> See every secret posted anywhere in your country.</li>
          <li><strong>Global subscription:</strong> Explore all secrets posted worldwide.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">3. Subscription Terms</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
          <li>You can cancel your subscription at any time through your app store account</li>
          <li>No refunds are provided for partial subscription periods</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">4. User Content Guidelines</h2>
        <p>Users agree not to post content that:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Contains personal information of others</li>
          <li>Is spam or commercial advertising</li>
          <li>Promotes hate speech, violence, or harassment</li>
          <li>Threatens or incites illegal activities</li>
          <li>Includes explicit or sexual content involving minors</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">5. Anonymity and Legal Compliance</h2>
        <p>
          While the app provides anonymity for users, it does not protect illegal activity. We reserve the right to cooperate with law enforcement
          if required to address violations of the law, including but not limited to defamation, harassment, and threats.
        </p>

        <h2 className="text-2xl font-semibold mb-2">6. Content Removal and Reporting</h2>
        <p>
          these terms, applicable laws, or our community guidelines. Users can report harmful or illegal content directly within the app.
        </p>

        <h2 className="text-2xl font-semibold mb-2">7. Privacy</h2>
        <p>
          Your use of the service is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use,
          and disclose information. We commit to protecting user privacy to the extent permitted by law.
        </p>

        <h2 className="text-2xl font-semibold mb-2">8. Age Restrictions</h2>
        <p>
          You must be at least 17 years old (or the legal minimum age in your jurisdiction) to use the app. Users under 18 may require parental
          consent to access certain features.
        </p>

        <h2 className="text-2xl font-semibold mb-2">9. Modifications to Service</h2>
        <p>
          We reserve the right to modify or discontinue the service at any time. We may also update these terms from time to time.
          Continued use of the service after changes constitutes acceptance of new terms.
        </p>

        <h2 className="text-2xl font-semibold mb-2">10. Disclaimer</h2>
        <p>
          The service is provided &ldquo;as is&rdquo; without warranties of any kind. We are not responsible for the accuracy or content of user submissions.
          Users are solely responsible for their own posts and interactions.
        </p>

        <h2 className="text-2xl font-semibold mb-2">11. Contact</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at support@inkognito.app.
        </p>
      </section>
    </div>
  );
}