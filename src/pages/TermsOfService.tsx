import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
          Terms of Service
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
          Effective Date: January 17, 2026
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
          Last Updated: January 17, 2026
        </p>
        
        <div className="prose dark:prose-invert prose-neutral max-w-none">
          <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
            Welcome to Orin Labs. These Terms of Service ("Terms") govern your access to and use of the websites, applications, and services (collectively, the "Services") provided by Orin Labs, Inc. ("Orin Labs," "we," "us," or "our").
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            <strong>PLEASE READ THESE TERMS CAREFULLY.</strong> By accessing or using our Services, you agree to be bound by these Terms and our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. If you do not agree to these Terms, do not access or use our Services.
          </p>

          {/* Table of Contents */}
          <section className="mb-10 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Table of Contents
            </h2>
            <ol className="list-decimal pl-6 space-y-1 text-neutral-600 dark:text-neutral-400 text-sm">
              <li>Acceptance of Terms</li>
              <li>Eligibility</li>
              <li>Account Registration</li>
              <li>Services for Minors</li>
              <li>Financial Services</li>
              <li>User Conduct</li>
              <li>Intellectual Property</li>
              <li>User Content</li>
              <li>Third-Party Services</li>
              <li>Fees and Payment</li>
              <li>Subscription Terms</li>
              <li>Disclaimers</li>
              <li>Limitation of Liability</li>
              <li>Indemnification</li>
              <li>Termination</li>
              <li>Dispute Resolution and Arbitration</li>
              <li>Governing Law</li>
              <li>Changes to Terms</li>
              <li>General Provisions</li>
              <li>Contact Information</li>
            </ol>
          </section>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              By creating an account, accessing, or using any of our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. These Terms constitute a legally binding agreement between you and Orin Labs.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              If you are using the Services on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms, and "you" refers to both you individually and the organization.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              We may offer additional services or features that are subject to supplemental terms. Those supplemental terms will be presented to you before you access the relevant services and become part of your agreement with us.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              2. Eligibility
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              The eligibility requirements for our Services vary depending on the specific service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>
                <strong>General Services:</strong> You must be at least 13 years old to use our general Services. Users between 13 and 18 must have parental or guardian consent.
              </li>
              <li>
                <strong>Children's Services:</strong> Certain Services are specifically designed for children under 13 and require verified parental consent as described in Section 4.
              </li>
              <li>
                <strong>Financial Services:</strong> You must be at least 18 years old (or the age of majority in your jurisdiction) to access our financial Services. For minor users, a parent or legal guardian must create and manage the account as described in Section 5.
              </li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400">
              By using our Services, you represent and warrant that you meet the applicable eligibility requirements and have the legal capacity to enter into these Terms.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              3. Account Registration
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              To access certain features of our Services, you may need to create an account. When you register:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>You agree to provide accurate, current, and complete information.</li>
              <li>You agree to maintain and promptly update your account information.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You are responsible for all activities that occur under your account.</li>
              <li>You agree to notify us immediately of any unauthorized access or use of your account.</li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              We reserve the right to suspend or terminate your account if any information provided is inaccurate, not current, or incomplete, or if we have reasonable grounds to suspect fraud or misuse.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              You may not transfer your account to another person or use another person's account without permission. You may not create multiple accounts to circumvent restrictions or bans.
            </p>
          </section>

          {/* Section 4 - Children's Services */}
          <section className="mb-10 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              4. Services for Minors
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Orin Labs offers certain Services specifically designed for users under 18 years of age. These Services are subject to additional terms and protections.
            </p>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              4.1 Children Under 13 (COPPA Compliance)
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              For Services directed to children under 13 years old:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>A parent or legal guardian must create and manage the child's account.</li>
              <li>Verifiable parental consent is required before we collect any personal information from the child.</li>
              <li>Parents/guardians have full access to review and delete their child's data and can revoke consent at any time.</li>
              <li>We limit data collection to what is reasonably necessary for the child to participate in the activity.</li>
              <li>Interactive features (such as chat, forums, or social features) are disabled or heavily moderated for children's accounts.</li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              4.2 Teen Users (Ages 13-17)
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              For users between 13 and 17 years old:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>Parental or guardian consent may be required depending on your jurisdiction and the specific service.</li>
              <li>Enhanced privacy protections are applied to teen accounts.</li>
              <li>Certain features may be restricted or require additional verification.</li>
              <li>Marketing and advertising are limited in accordance with applicable regulations.</li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              4.3 Parental Controls and Oversight
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Parents and guardians have access to parental control features, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>Viewing their child's activity and usage data</li>
              <li>Setting time limits and usage restrictions</li>
              <li>Approving or blocking certain features</li>
              <li>Receiving notifications about their child's activity</li>
              <li>Deleting the account and all associated data</li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              4.4 Educational Use
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              If our Services are used in an educational setting, the educational institution may act as the agent of the parent for purposes of providing consent. Educational institutions using our Services agree to obtain necessary consents from parents and to comply with applicable student privacy laws, including FERPA (Family Educational Rights and Privacy Act).
            </p>
          </section>

          {/* Section 5 - Financial Services */}
          <section className="mb-10 p-6 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              5. Financial Services
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Orin Labs offers financial management and planning tools. By using our financial Services, you agree to the following additional terms:
            </p>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              5.1 Eligibility for Financial Services
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>You must be at least 18 years old (or the age of majority in your jurisdiction) to use financial Services.</li>
              <li>For minor users, a parent or legal guardian must create and manage the account on their behalf.</li>
              <li>You must provide accurate identity verification information as required by applicable laws and regulations.</li>
              <li>You must have a valid bank account or payment method in your name.</li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              5.2 Not Financial Advice
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              <strong>IMPORTANT:</strong> Orin Labs is not a registered investment adviser, broker-dealer, or financial planner. Our financial Services provide tools for personal financial management and information for educational purposes only. Nothing in our Services constitutes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>Investment advice or recommendations</li>
              <li>Tax advice</li>
              <li>Legal advice</li>
              <li>A recommendation to buy, sell, or hold any financial instrument</li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              You should consult with qualified professionals before making financial decisions. We are not responsible for any financial decisions you make based on information provided through our Services.
            </p>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              5.3 Account Linking and Data Access
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              If you choose to link external financial accounts:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>You authorize us to access your account information through secure third-party services (such as Plaid).</li>
              <li>You represent that you have the right to grant us access to such accounts.</li>
              <li>You understand that the availability and accuracy of linked account data depends on third parties.</li>
              <li>You may revoke access to linked accounts at any time through your account settings.</li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              5.4 Transaction Processing
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              For Services that involve financial transactions:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>You authorize us to initiate transactions as instructed by you.</li>
              <li>You are responsible for ensuring sufficient funds are available for authorized transactions.</li>
              <li>Transaction processing times depend on financial institutions and may take several business days.</li>
              <li>You agree to review transaction history regularly and report any unauthorized transactions immediately.</li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              5.5 Regulatory Compliance
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Our financial Services are designed to comply with applicable financial regulations, including the Bank Secrecy Act (BSA), Anti-Money Laundering (AML) requirements, and Know Your Customer (KYC) regulations. You agree to cooperate with identity verification and other compliance measures as required.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              6. User Conduct
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree NOT to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>Violate any applicable laws, regulations, or third-party rights.</li>
              <li>Use the Services for any fraudulent, illegal, or unauthorized purpose.</li>
              <li>Impersonate any person or entity or misrepresent your affiliation.</li>
              <li>Interfere with or disrupt the Services or servers/networks connected to the Services.</li>
              <li>Attempt to gain unauthorized access to any portion of the Services or any systems or networks.</li>
              <li>Use any automated means (bots, scrapers, etc.) to access the Services without our express permission.</li>
              <li>Transmit any viruses, malware, or other harmful code.</li>
              <li>Harass, abuse, threaten, or intimidate other users.</li>
              <li>Post or transmit content that is unlawful, defamatory, obscene, or harmful to minors.</li>
              <li>Engage in money laundering or terrorist financing activities.</li>
              <li>Circumvent any security features or access controls.</li>
              <li>Use the Services to compete with Orin Labs or for benchmarking purposes without consent.</li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400">
              We reserve the right to investigate and take appropriate legal action against anyone who violates these provisions, including removing content, suspending or terminating accounts, and reporting to law enforcement authorities.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              The Services and all content, features, and functionality (including but not limited to text, graphics, logos, icons, images, audio clips, software, and the design, selection, and arrangement thereof) are owned by Orin Labs, its licensors, or other providers and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for your personal, non-commercial use (or internal business use if you have an enterprise subscription).
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              You may not copy, modify, distribute, sell, lease, or create derivative works based on our Services without our prior written consent. All rights not expressly granted are reserved by Orin Labs.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              8. User Content
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              You may be able to submit, post, or share content through our Services ("User Content"). You retain ownership of your User Content, but you grant us the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>A worldwide, non-exclusive, royalty-free license to use, copy, modify, display, and distribute your User Content solely for the purpose of providing and improving our Services.</li>
              <li>The right to remove or modify User Content that violates these Terms or applicable law.</li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              You represent and warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>You own or have the necessary rights to submit the User Content.</li>
              <li>Your User Content does not violate the rights of any third party.</li>
              <li>Your User Content complies with these Terms and applicable laws.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              9. Third-Party Services
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Our Services may contain links to or integrate with third-party websites, services, or applications. These third-party services are not under our control, and we are not responsible for their content, privacy policies, or practices.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Your use of third-party services is at your own risk and subject to the terms and conditions of those services. We encourage you to review the terms and privacy policies of any third-party services you access.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              The inclusion of any link or integration does not imply endorsement by Orin Labs.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              10. Fees and Payment
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Some of our Services require payment of fees. By subscribing to or purchasing paid Services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>You agree to pay all applicable fees as described at the time of purchase.</li>
              <li>You authorize us to charge your designated payment method.</li>
              <li>All fees are non-refundable unless otherwise stated or required by law.</li>
              <li>We may change fees upon notice; continued use after the change constitutes acceptance.</li>
              <li>You are responsible for all taxes associated with your use of the Services.</li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400">
              If payment fails, we may suspend or terminate your access to paid features until payment is received.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              11. Subscription Terms
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              For subscription-based Services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>
                <strong>Automatic Renewal:</strong> Subscriptions automatically renew at the end of each billing period unless you cancel before the renewal date.
              </li>
              <li>
                <strong>Cancellation:</strong> You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of the current billing period.
              </li>
              <li>
                <strong>No Partial Refunds:</strong> We do not provide refunds for partial billing periods.
              </li>
              <li>
                <strong>Free Trials:</strong> If you sign up for a free trial, you must cancel before the trial ends to avoid charges. We will notify you before charging.
              </li>
              <li>
                <strong>Price Changes:</strong> We may change subscription prices with advance notice. Continued use after the price change constitutes acceptance.
              </li>
            </ul>
          </section>

          {/* Section 12 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              12. Disclaimers
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4 uppercase font-semibold">
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              To the fullest extent permitted by law, Orin Labs disclaims all warranties, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>Implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</li>
              <li>Any warranties regarding the accuracy, reliability, or completeness of content.</li>
              <li>Any warranties that the Services will be uninterrupted, error-free, or secure.</li>
              <li>Any warranties regarding the results that may be obtained from use of the Services.</li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              <strong>Financial Services Disclaimer:</strong> We do not guarantee the accuracy of financial data retrieved from third-party sources. Financial information is provided for informational purposes only and should not be relied upon for making financial decisions without verification.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              Some jurisdictions do not allow the exclusion of certain warranties, so some of the above exclusions may not apply to you.
            </p>
          </section>

          {/* Section 13 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              13. Limitation of Liability
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4 uppercase font-semibold">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ORIN LABS AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>Loss of profits, revenue, data, or use</li>
              <li>Business interruption</li>
              <li>Cost of substitute services</li>
              <li>Financial losses arising from use of our financial Services</li>
              <li>Any damages arising from unauthorized access to your account</li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICES EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100).
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              Some jurisdictions do not allow limitations on incidental or consequential damages, so the above limitations may not apply to you. In such jurisdictions, our liability is limited to the maximum extent permitted by law.
            </p>
          </section>

          {/* Section 14 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              14. Indemnification
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              You agree to indemnify, defend, and hold harmless Orin Labs and its officers, directors, employees, agents, licensors, and service providers from and against any and all claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>Your violation of these Terms</li>
              <li>Your User Content</li>
              <li>Your use of the Services</li>
              <li>Your violation of any rights of another party</li>
              <li>Your violation of any applicable laws or regulations</li>
            </ul>
          </section>

          {/* Section 15 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              15. Termination
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              <strong>By You:</strong> You may terminate your account at any time by following the instructions in your account settings or by contacting us. Termination does not entitle you to a refund of any fees paid.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              <strong>By Us:</strong> We may suspend or terminate your access to the Services at any time, with or without cause, and with or without notice. Reasons for termination may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>Violation of these Terms</li>
              <li>Fraudulent, abusive, or illegal activity</li>
              <li>Non-payment of fees</li>
              <li>Extended periods of inactivity</li>
              <li>Requests by law enforcement or government agencies</li>
              <li>Discontinuation of the Services</li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400">
              <strong>Effect of Termination:</strong> Upon termination, your right to use the Services immediately ceases. Provisions of these Terms that by their nature should survive termination will survive, including ownership provisions, warranty disclaimers, indemnification, and limitations of liability.
            </p>
          </section>

          {/* Section 16 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              16. Dispute Resolution and Arbitration
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              <strong>PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT.</strong>
            </p>
            
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              16.1 Informal Resolution
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Before filing any formal dispute, you agree to first contact us at <a href="mailto:legal@orinlabs.com" className="text-primary hover:underline">legal@orinlabs.com</a> and attempt to resolve the dispute informally for at least 30 days.
            </p>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              16.2 Binding Arbitration
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              If informal resolution is unsuccessful, any dispute arising out of or relating to these Terms or the Services shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules, except as modified herein.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              The arbitration will be conducted in the English language in the county where you reside or at another mutually agreed location. The arbitrator's decision will be final and binding.
            </p>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              16.3 Class Action Waiver
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              YOU AND ORIN LABS AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE ACTION.
            </p>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              16.4 Exceptions
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Notwithstanding the above, either party may seek injunctive relief in any court of competent jurisdiction to prevent the actual or threatened infringement of intellectual property rights. Small claims court actions are also exempt from arbitration.
            </p>
          </section>

          {/* Section 17 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              17. Governing Law
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              These Terms and any dispute arising out of or related to these Terms or the Services shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law principles. If arbitration does not apply, you agree to submit to the exclusive jurisdiction of the state and federal courts located in Delaware.
            </p>
          </section>

          {/* Section 18 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              18. Changes to Terms
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              We may modify these Terms at any time. When we make material changes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mb-4">
              <li>We will update the "Last Updated" date at the top of these Terms.</li>
              <li>We will provide notice through the Services or via email.</li>
              <li>For changes affecting children's accounts, we may seek renewed parental consent.</li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400">
              Your continued use of the Services after the changes take effect constitutes your acceptance of the revised Terms. If you do not agree to the changes, you must stop using the Services.
            </p>
          </section>

          {/* Section 19 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              19. General Provisions
            </h2>
            
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              19.1 Entire Agreement
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              These Terms, together with our Privacy Policy and any supplemental terms, constitute the entire agreement between you and Orin Labs regarding the Services and supersede all prior agreements and understandings.
            </p>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              19.2 Severability
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              If any provision of these Terms is found to be invalid or unenforceable, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
            </p>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              19.3 Waiver
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of that right or provision.
            </p>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              19.4 Assignment
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              You may not assign or transfer these Terms or your rights under these Terms without our prior written consent. We may assign our rights and obligations under these Terms without restriction.
            </p>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              19.5 Force Majeure
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              We will not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including natural disasters, war, terrorism, labor disputes, government actions, or internet service failures.
            </p>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-3">
              19.6 No Third-Party Beneficiaries
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              These Terms do not create any third-party beneficiary rights, except as expressly provided herein.
            </p>
          </section>

          {/* Section 20 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              20. Contact Information
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <p className="text-neutral-700 dark:text-neutral-300 font-semibold mb-2">Orin Labs, Inc.</p>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Attn: Legal Department<br />
                965 Oak St<br />
                San Francisco, CA 94117<br />
                United States
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                <strong>General Inquiries:</strong>{' '}
                <a href="mailto:contact@orinlabs.com" className="text-primary hover:underline">contact@orinlabs.com</a>
              </p>
              <p className="text-neutral-600 dark:text-neutral-400">
                <strong>Legal Matters:</strong>{' '}
                <a href="mailto:legal@orinlabs.com" className="text-primary hover:underline">legal@orinlabs.com</a>
              </p>
            </div>
          </section>

          <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-4">
             <Link to="/" className="text-primary hover:underline flex items-center gap-2">
                &larr; Back to Home
             </Link>
             <Link to="/privacy" className="text-primary hover:underline flex items-center gap-2">
                Privacy Policy
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
