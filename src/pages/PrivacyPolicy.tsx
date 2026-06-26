import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
          Privacy Policy
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
          Effective Date: January 17, 2026
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
          Last Updated: January 17, 2026
        </p>
        
        <div className="prose dark:prose-invert prose-neutral max-w-none">
          <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
            Orin Labs, Inc. ("Orin Labs," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our suite of applications, websites, and services (collectively, the "Services"). This policy applies to all Orin Labs products, including those designed for minors and financial management tools.
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.
          </p>

          {/* Table of Contents */}
          <section className="mb-10 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Table of Contents
            </h2>
            <ol className="list-decimal pl-6 space-y-1 text-neutral-600 dark:text-neutral-400 text-sm">
              <li>Scope of This Policy</li>
              <li>Information We Collect</li>
              <li>How We Use Your Information</li>
              <li>Legal Bases for Processing</li>
              <li>Children's Privacy (COPPA Compliance)</li>
              <li>Financial Information</li>
              <li>Data Sharing and Disclosure</li>
              <li>Data Retention</li>
              <li>Data Security</li>
              <li>International Data Transfers</li>
              <li>Your Privacy Rights</li>
              <li>California Privacy Rights (CCPA/CPRA)</li>
              <li>European Privacy Rights (GDPR)</li>
              <li>Cookies and Tracking Technologies</li>
              <li>Third-Party Services</li>
              <li>Do Not Track Signals</li>
              <li>Changes to This Policy</li>
              <li>Contact Information</li>
            </ol>
          </section>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              1. Scope of This Policy
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              This Privacy Policy applies to all information collected through our Services, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>Our websites and web applications</li>
              <li>Mobile applications available on iOS and Android platforms</li>
              <li>Educational and productivity applications designed for users of all ages, including minors</li>
              <li>Financial management and planning tools</li>
              <li>Any other services that link to this Privacy Policy</li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400">
              This policy does not apply to information collected by third parties, including through any application or content that may link to or be accessible from our Services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              2. Information We Collect
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              We collect several types of information from and about users of our Services:
            </p>
            
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              2.1 Information You Provide Directly
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>
                <strong>Account Registration:</strong> Name, email address, username, password, date of birth, and profile information.
              </li>
              <li>
                <strong>Identity Verification:</strong> Government-issued identification, Social Security Number (last four digits), or other verification documents when required for financial services.
              </li>
              <li>
                <strong>Financial Information:</strong> Bank account numbers, routing numbers, credit/debit card information, transaction history, income information, and financial goals (for financial services only).
              </li>
              <li>
                <strong>Communications:</strong> Information you provide when contacting customer support, responding to surveys, or participating in promotions.
              </li>
              <li>
                <strong>User Content:</strong> Any content you create, upload, or share through our Services.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              2.2 Information Collected Automatically
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>
                <strong>Device Information:</strong> Hardware model, operating system version, unique device identifiers, browser type, and mobile network information.
              </li>
              <li>
                <strong>Log Data:</strong> IP address, access times, pages viewed, app crashes, and other system activity.
              </li>
              <li>
                <strong>Usage Information:</strong> Features used, actions taken, time spent on pages, and interaction patterns.
              </li>
              <li>
                <strong>Location Data:</strong> General location information derived from IP address. Precise location only with your explicit consent.
              </li>
              <li>
                <strong>Cookies and Similar Technologies:</strong> Information collected through cookies, pixel tags, and similar tracking technologies.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              2.3 Information from Third Parties
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>
                <strong>Financial Institutions:</strong> Account balances, transaction data, and account verification (with your authorization via secure APIs like Plaid).
              </li>
              <li>
                <strong>Identity Verification Services:</strong> Results from identity verification checks.
              </li>
              <li>
                <strong>Social Media Platforms:</strong> Information from connected social accounts (if you choose to link them).
              </li>
              <li>
                <strong>Parents/Guardians:</strong> Information provided by parents or legal guardians on behalf of minor children.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>
                <strong>Service Provision:</strong> To create and manage your account, process transactions, and provide our Services.
              </li>
              <li>
                <strong>Service Improvement:</strong> To understand how users interact with our Services and to develop new features and products.
              </li>
              <li>
                <strong>Personalization:</strong> To customize your experience and provide content and features relevant to you.
              </li>
              <li>
                <strong>Communications:</strong> To send you service-related notices, updates, security alerts, and support messages.
              </li>
              <li>
                <strong>Marketing:</strong> To send promotional communications (with your consent where required by law).
              </li>
              <li>
                <strong>Safety and Security:</strong> To detect, prevent, and respond to fraud, abuse, security risks, and technical issues.
              </li>
              <li>
                <strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.
              </li>
              <li>
                <strong>Financial Services:</strong> To facilitate financial transactions, provide financial insights, and comply with financial regulations.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              4. Legal Bases for Processing
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              We process your personal information based on the following legal grounds:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>
                <strong>Contract Performance:</strong> Processing necessary to perform our contract with you or take steps at your request before entering into a contract.
              </li>
              <li>
                <strong>Legitimate Interests:</strong> Processing necessary for our legitimate interests, such as improving our Services, preventing fraud, and ensuring security.
              </li>
              <li>
                <strong>Legal Obligations:</strong> Processing necessary to comply with legal requirements, including financial regulations and child protection laws.
              </li>
              <li>
                <strong>Consent:</strong> Processing based on your consent, which you may withdraw at any time.
              </li>
              <li>
                <strong>Vital Interests:</strong> Processing necessary to protect someone's life.
              </li>
            </ul>
          </section>

          {/* Section 5 - Children's Privacy */}
          <section className="mb-10 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              5. Children's Privacy (COPPA Compliance)
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Orin Labs offers certain Services specifically designed for children under 13 years of age. We are committed to complying with the Children's Online Privacy Protection Act (COPPA) and other applicable laws protecting children's privacy.
            </p>
            
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              5.1 Parental Consent
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              For Services directed to children under 13, we require verifiable parental consent before collecting, using, or disclosing personal information from children. Methods of obtaining consent may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>Requiring a parent to sign a consent form</li>
              <li>Requiring a parent to provide credit card or other payment information for verification</li>
              <li>Having a parent provide a government-issued ID for verification</li>
              <li>Video conferencing with a parent</li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              5.2 Information We Collect from Children
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              With verified parental consent, we may collect from children:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>Username (we encourage the use of screen names that do not reveal the child's identity)</li>
              <li>Parent's email address (for account management and notifications)</li>
              <li>Age or date of birth (to ensure age-appropriate experiences)</li>
              <li>Usage data and progress within educational applications</li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              We do NOT knowingly collect from children under 13 without parental consent:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>Full name or address</li>
              <li>Photos, videos, or audio files containing their image or voice</li>
              <li>Geolocation information</li>
              <li>Persistent identifiers for behavioral advertising</li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              5.3 Parental Rights
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Parents and legal guardians have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>Review the personal information we have collected from their child</li>
              <li>Request deletion of their child's personal information</li>
              <li>Refuse to permit further collection or use of their child's information</li>
              <li>Agree to the collection and use of their child's information without consenting to disclosure to third parties</li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400">
              To exercise these rights, please contact us at <a href="mailto:privacy@orinlabs.com" className="text-primary hover:underline">privacy@orinlabs.com</a> with proof of parental relationship.
            </p>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              5.4 Teen Users (Ages 13-17)
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              For users between 13 and 17 years old, we may collect additional information with appropriate consent mechanisms. We apply enhanced privacy protections to teen accounts, including restricted data sharing and age-appropriate advertising practices where applicable.
            </p>
          </section>

          {/* Section 6 - Financial Information */}
          <section className="mb-10 p-6 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              6. Financial Information
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Certain Orin Labs Services involve the collection and processing of financial information. We handle this data with the highest level of security and in compliance with applicable financial regulations.
            </p>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              6.1 Types of Financial Data Collected
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>Bank account information (account numbers, routing numbers)</li>
              <li>Credit and debit card information</li>
              <li>Transaction history and spending patterns</li>
              <li>Income and employment information</li>
              <li>Investment account information</li>
              <li>Credit score and credit report information (with your authorization)</li>
              <li>Tax-related information</li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              6.2 How We Protect Financial Data
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>
                <strong>Encryption:</strong> All financial data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.
              </li>
              <li>
                <strong>PCI-DSS Compliance:</strong> We adhere to Payment Card Industry Data Security Standards for handling payment card information.
              </li>
              <li>
                <strong>Access Controls:</strong> Financial data access is limited to authorized personnel on a need-to-know basis.
              </li>
              <li>
                <strong>Tokenization:</strong> Sensitive payment credentials are tokenized and stored by PCI-compliant payment processors.
              </li>
              <li>
                <strong>Regular Audits:</strong> We conduct regular security audits and penetration testing.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              6.3 Financial Data Sharing
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              We may share financial data only with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>Financial institutions necessary to process your transactions</li>
              <li>Payment processors and gateways</li>
              <li>Account aggregation services (like Plaid) with your explicit consent</li>
              <li>Regulatory authorities as required by law</li>
              <li>Fraud prevention services</li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400">
              We do NOT sell financial data to third parties or use it for purposes unrelated to providing our financial Services.
            </p>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              6.4 Gramm-Leach-Bliley Act (GLBA) Compliance
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              To the extent our Services are subject to GLBA, we comply with its requirements regarding the privacy and safeguarding of nonpublic personal financial information. This includes providing you with clear notice of our information-sharing practices and your right to opt out of certain disclosures.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              7. Data Sharing and Disclosure
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              7.1 Service Providers
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              We share information with third-party vendors and service providers who perform services on our behalf, such as hosting, analytics, customer support, payment processing, and marketing. These providers are contractually obligated to protect your information and may only use it for the purposes we specify.
            </p>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              7.2 Legal Requirements
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              We may disclose your information if required to do so by law or in response to valid requests by public authorities, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>Court orders and subpoenas</li>
              <li>Government or regulatory agency requests</li>
              <li>Law enforcement requests</li>
              <li>National security or public safety requirements</li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              7.3 Business Transfers
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              If Orin Labs is involved in a merger, acquisition, financing, reorganization, bankruptcy, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any change in ownership or use of your personal information.
            </p>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              7.4 With Your Consent
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              We may share your information with third parties when you have given us your explicit consent to do so.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              8. Data Retention
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>
                <strong>Account Data:</strong> Retained while your account is active and for a reasonable period thereafter (typically 3 years) for backup, archival, and audit purposes.
              </li>
              <li>
                <strong>Transaction Data:</strong> Retained for 7 years to comply with tax and financial regulations.
              </li>
              <li>
                <strong>Children's Data:</strong> Deleted promptly upon request from a parent/guardian or when no longer necessary for the purpose collected.
              </li>
              <li>
                <strong>Marketing Data:</strong> Retained until you withdraw consent or opt out of communications.
              </li>
              <li>
                <strong>Legal Hold:</strong> Data may be retained longer if subject to legal hold, litigation, or regulatory investigation.
              </li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400">
              When data is no longer needed, we securely delete or anonymize it in accordance with our data retention policies.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              9. Data Security
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              We implement comprehensive technical, administrative, and physical safeguards to protect your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>
                <strong>Technical Measures:</strong> Encryption (TLS 1.3 in transit, AES-256 at rest), firewalls, intrusion detection systems, secure development practices, and regular security assessments.
              </li>
              <li>
                <strong>Administrative Measures:</strong> Employee training, access controls, background checks, and incident response procedures.
              </li>
              <li>
                <strong>Physical Measures:</strong> Secure data centers with access controls, surveillance, and environmental protections.
              </li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Despite our efforts, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we are committed to promptly addressing any security incidents.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              <strong>Breach Notification:</strong> In the event of a data breach affecting your personal information, we will notify you and relevant authorities as required by applicable law.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              10. International Data Transfers
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Orin Labs is based in the United States. Your information may be transferred to, stored, and processed in the United States or other countries where our service providers operate. These countries may have different data protection laws than your country of residence.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              When we transfer personal data from the European Economic Area (EEA), United Kingdom, or Switzerland, we use appropriate safeguards, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>Standard Contractual Clauses approved by the European Commission</li>
              <li>Data Processing Agreements with our service providers</li>
              <li>Additional technical and organizational measures as appropriate</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              11. Your Privacy Rights
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>
                <strong>Access:</strong> Request a copy of the personal information we hold about you.
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate or incomplete information.
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal information (subject to legal retention requirements).
              </li>
              <li>
                <strong>Portability:</strong> Request a copy of your data in a structured, machine-readable format.
              </li>
              <li>
                <strong>Restriction:</strong> Request that we limit how we use your information.
              </li>
              <li>
                <strong>Objection:</strong> Object to processing of your information for certain purposes.
              </li>
              <li>
                <strong>Withdrawal of Consent:</strong> Withdraw consent where processing is based on consent.
              </li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400 mt-4">
              To exercise these rights, contact us at <a href="mailto:privacy@orinlabs.com" className="text-primary hover:underline">privacy@orinlabs.com</a>. We will respond to your request within the timeframe required by applicable law.
            </p>
          </section>

          {/* Section 12 - CCPA */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              12. California Privacy Rights (CCPA/CPRA)
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>
                <strong>Right to Know:</strong> You can request information about the categories and specific pieces of personal information we have collected, the sources, the purposes, and the categories of third parties with whom we share it.
              </li>
              <li>
                <strong>Right to Delete:</strong> You can request deletion of your personal information, subject to certain exceptions.
              </li>
              <li>
                <strong>Right to Correct:</strong> You can request correction of inaccurate personal information.
              </li>
              <li>
                <strong>Right to Opt-Out:</strong> You can opt out of the sale or sharing of your personal information. Note: Orin Labs does not sell personal information.
              </li>
              <li>
                <strong>Right to Limit Use of Sensitive Information:</strong> You can limit our use and disclosure of sensitive personal information.
              </li>
              <li>
                <strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights.
              </li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400">
              To submit a request, email <a href="mailto:privacy@orinlabs.com" className="text-primary hover:underline">privacy@orinlabs.com</a>. We may need to verify your identity before processing your request.
            </p>
          </section>

          {/* Section 13 - GDPR */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              13. European Privacy Rights (GDPR)
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>All rights listed in Section 11 above</li>
              <li>
                <strong>Right to Lodge a Complaint:</strong> You have the right to lodge a complaint with your local data protection authority if you believe we have violated your privacy rights.
              </li>
              <li>
                <strong>Automated Decision-Making:</strong> You have the right not to be subject to decisions based solely on automated processing that significantly affect you, unless certain conditions are met.
              </li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400">
              <strong>Data Controller:</strong> Orin Labs, Inc. is the data controller for personal information collected through our Services. For questions about our data practices, contact our Data Protection Officer at <a href="mailto:dpo@orinlabs.com" className="text-primary hover:underline">dpo@orinlabs.com</a>.
            </p>
          </section>

          {/* Section 14 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              14. Cookies and Tracking Technologies
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              We use cookies and similar tracking technologies to collect and store information about your interactions with our Services.
            </p>
            
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              Types of Cookies We Use
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>
                <strong>Essential Cookies:</strong> Required for the operation of our Services. These cannot be disabled.
              </li>
              <li>
                <strong>Functional Cookies:</strong> Enable enhanced functionality and personalization.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how users interact with our Services.
              </li>
              <li>
                <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (not used for children's Services).
              </li>
            </ul>
            
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              Managing Cookies
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              You can manage cookie preferences through your browser settings or through our cookie consent tool where available. Note that disabling certain cookies may affect the functionality of our Services.
            </p>
          </section>

          {/* Section 15 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              15. Third-Party Services
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Our Services may contain links to third-party websites, applications, or services. This Privacy Policy does not apply to those third parties, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party services you access.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              Key third-party services we may integrate with include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mt-4">
              <li>AI service providers (Anthropic, OpenAI, Google Gemini)</li>
              <li>Payment processors (Stripe, PayPal)</li>
              <li>Account aggregation services (Plaid)</li>
              <li>Analytics providers (Google Analytics, Mixpanel)</li>
              <li>Cloud infrastructure providers (AWS, Google Cloud)</li>
              <li>Customer support platforms</li>
            </ul>
          </section>

          {/* Section 16 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              16. Do Not Track Signals
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want your online activity tracked. Currently, there is no uniform standard for how companies should respond to DNT signals. At this time, we do not respond to DNT signals. However, you can manage your privacy preferences through our cookie settings and by exercising your rights as described in this policy.
            </p>
          </section>

          {/* Section 17 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              17. Changes to This Policy
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>Update the "Last Updated" date at the top of this policy</li>
              <li>Provide notice through our Services or via email (for material changes)</li>
              <li>Obtain consent where required by law, particularly for changes affecting children's data</li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400">
              We encourage you to review this policy periodically. Your continued use of our Services after any changes indicates your acceptance of the updated policy.
            </p>
          </section>

          {/* Section 18 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              18. Contact Information
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <p className="text-neutral-700 dark:text-neutral-300 font-semibold mb-2">Orin Labs, Inc.</p>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Attn: Privacy Team<br />
                965 Oak St<br />
                San Francisco, CA 94117<br />
                United States
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                <strong>General Privacy Inquiries:</strong>{' '}
                <a href="mailto:privacy@orinlabs.com" className="text-primary hover:underline">privacy@orinlabs.com</a>
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                <strong>Data Protection Officer:</strong>{' '}
                <a href="mailto:dpo@orinlabs.com" className="text-primary hover:underline">dpo@orinlabs.com</a>
              </p>
              <p className="text-neutral-600 dark:text-neutral-400">
                <strong>Children's Privacy:</strong>{' '}
                <a href="mailto:coppa@orinlabs.com" className="text-primary hover:underline">coppa@orinlabs.com</a>
              </p>
            </div>
          </section>

          <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-4">
             <Link to="/" className="text-primary hover:underline flex items-center gap-2">
                &larr; Back to Home
             </Link>
             <Link to="/terms" className="text-primary hover:underline flex items-center gap-2">
                Terms of Service
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
