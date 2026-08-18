import React from 'react'

const privacy = () => {
  return (
     <main className="min-h-screen bg-[#f8f8ff] py-16">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">

        {/* Page Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-600">
            Privacy Notice
          </h1>

          {/* Underline */}
          <div className="w-[188px] h-[3px] bg-pink-500 mx-auto mt-7"></div>

          <p className="mt-5 text-sm text-gray-500">
            Last Updated: August 15, 2026
          </p>
        </div>

        {/* Introduction */}
        <section className="bg-white rounded-2xl shadow-sm p-6 md:p-10 mb-8">
          <p className="text-gray-700 leading-7 mb-4">
            At <strong className="text-pink-600">Dermacare</strong>, operated by{" "}
            <strong>Seven Multi Trading Pvt. Ltd.</strong> ("Dermacare,"
            "we," "us," or "our"), we respect your privacy and are committed
            to protecting your personal information.
          </p>

          <p className="text-gray-700 leading-7 mb-4">
            This Privacy Notice explains how we collect, use, store, and
            protect your information when you visit or use our website,
            purchase our products, create an account, contact us, or otherwise
            interact with our services.
          </p>

          <p className="text-gray-700 leading-7">
            By using the Dermacare website and services, you agree to the
            practices described in this Privacy Notice.
          </p>
        </section>

        {/* 1 */}
        <PrivacySection title="1. WHAT INFORMATION DO WE COLLECT?">
          <SubTitle>Personal Information You Provide</SubTitle>

          <p>
            We collect information that you voluntarily provide when you
            create an account, place an order, contact us, subscribe to our
            services, or interact with our website.
          </p>

          <p>Depending on how you use Dermacare, we may collect:</p>

          <BulletList
            items={[
              "Full name",
              "Email address",
              "Phone number",
              "Username and password",
              "Delivery and billing address",
              "Order and purchase information",
              "Product preferences",
              "Payment-related information",
              "Contact preferences",
              "Information you provide when contacting customer support",
            ]}
          />

          <p>
            We ask that the information you provide is accurate and up to
            date.
          </p>

          <SubTitle>Payment Information</SubTitle>

          <p>
            When you purchase products from Dermacare, payment information may
            be required to complete your transaction.
          </p>

          <p>
            Payment information may be processed through third-party payment
            service providers. We do not unnecessarily store complete payment
            card information on our own systems.
          </p>

          <p>
            The payment information you provide may be subject to the privacy
            policies and security practices of the relevant payment provider.
          </p>

          <SubTitle>Information Automatically Collected</SubTitle>

          <p>
            When you visit our website, certain technical information may be
            collected automatically.
          </p>

          <p>This may include:</p>

          <BulletList
            items={[
              "IP address",
              "Browser type",
              "Device type",
              "Operating system",
              "Pages visited",
              "Date and time of visits",
              "Search and browsing activity on our website",
              "Referring website",
              "Device and usage information",
            ]}
          />

          <p>
            This information helps us maintain website security, understand
            how visitors use our website, and improve our services.
          </p>
        </PrivacySection>

        {/* 2 */}
        <PrivacySection title="2. HOW DO WE USE YOUR INFORMATION?">
          <p>We may use the information we collect for purposes including:</p>

          <SubTitle>To Process Your Orders</SubTitle>

          <p>We use your information to:</p>

          <BulletList
            items={[
              "Process and confirm orders",
              "Arrange delivery",
              "Process payments",
              "Manage returns and exchanges",
              "Provide order updates",
              "Contact you regarding your purchases",
            ]}
          />

          <SubTitle>To Provide Customer Support</SubTitle>

          <p>
            We may use your contact information to respond to your questions,
            complaints, requests, and other customer service inquiries.
          </p>

          <SubTitle>To Manage Your Account</SubTitle>

          <p>If you create an account, we use your information to:</p>

          <BulletList
            items={[
              "Create and maintain your account",
              "Authenticate your account",
              "Provide access to account features",
              "Help you manage your orders and preferences",
            ]}
          />

          <SubTitle>To Improve Our Website and Services</SubTitle>

          <p>We may analyze how customers use our website to improve:</p>

          <BulletList
            items={[
              "Website functionality",
              "Product selection",
              "Customer experience",
              "Services",
              "Marketing activities",
            ]}
          />

          <SubTitle>To Send Marketing Communications</SubTitle>

          <p>
            If you have provided appropriate consent, we may send you
            information about:
          </p>

          <BulletList
            items={[
              "New products",
              "Special offers",
              "Discounts",
              "Promotions",
              "Beauty and skincare-related updates",
            ]}
          />

          <p>You can unsubscribe from marketing communications at any time.</p>

          <SubTitle>For Security and Fraud Prevention</SubTitle>

          <p>
            We may use information to detect, investigate, and prevent
            fraudulent, unauthorized, or potentially harmful activities.
          </p>

          <SubTitle>To Meet Legal Requirements</SubTitle>

          <p>
            We may process and disclose information when necessary to comply
            with applicable laws, legal requests, regulations, or lawful
            government authorities.
          </p>
        </PrivacySection>

        {/* 3 */}
        <PrivacySection title="3. WHEN DO WE SHARE YOUR INFORMATION?">
          <p>
            We do not sell your personal information.
          </p>

          <p>
            However, we may share necessary information with trusted third
            parties when required to operate our business and provide services
            to you.
          </p>

          <p>These may include:</p>

          <BulletList
            items={[
              "Payment service providers",
              "Delivery and courier services",
              "Website hosting providers",
              "Data storage providers",
              "Analytics providers",
              "Customer support service providers",
              "Marketing service providers, where applicable",
            ]}
          />

          <p>
            We only share information that is reasonably necessary for the
            relevant service.
          </p>

          <p>
            We may also disclose information if required by law or when
            necessary to protect the rights, safety, and security of Dermacare,
            our customers, or others.
          </p>
        </PrivacySection>

        {/* 4 */}
        <PrivacySection title="4. COOKIES AND TRACKING TECHNOLOGIES">
          <p>
            Dermacare may use cookies and similar technologies to improve your
            browsing experience.
          </p>

          <p>Cookies may help us:</p>

          <BulletList
            items={[
              "Remember your preferences",
              "Keep items in your shopping cart",
              "Understand website traffic",
              "Improve website performance",
              "Provide relevant content",
              "Analyze customer interactions with our website",
            ]}
          />

          <p>
            You can control or disable cookies through your browser settings.
            However, disabling certain cookies may affect some website
            features.
          </p>
        </PrivacySection>

        {/* 5 */}
        <PrivacySection title="5. HOW LONG DO WE KEEP YOUR INFORMATION?">
          <p>
            We keep your personal information only for as long as reasonably
            necessary for the purposes described in this Privacy Notice.
          </p>

          <p>We may retain information for purposes such as:</p>

          <BulletList
            items={[
              "Completing transactions",
              "Providing customer services",
              "Maintaining business records",
              "Preventing fraud",
              "Resolving disputes",
              "Meeting legal, accounting, or regulatory requirements",
            ]}
          />

          <p>
            When your information is no longer required, we may delete,
            anonymize, or securely store it according to applicable
            requirements.
          </p>
        </PrivacySection>

        {/* 6 */}
        <PrivacySection title="6. HOW DO WE KEEP YOUR INFORMATION SAFE?">
          <p>
            We take reasonable technical and organizational measures to
            protect your personal information from unauthorized access, loss,
            misuse, alteration, or disclosure.
          </p>

          <p>
            However, no internet transmission or electronic storage system can
            be guaranteed to be completely secure.
          </p>

          <p>
            Therefore, while we make reasonable efforts to protect your
            information, we cannot guarantee absolute security.
          </p>
        </PrivacySection>

        {/* 7 */}
        <PrivacySection title="7. YOUR PRIVACY RIGHTS">
          <p>
            Depending on applicable law, you may have certain rights regarding
            your personal information.
          </p>

          <p>These may include the right to:</p>

          <BulletList
            items={[
              "Request access to your personal information",
              "Request correction of inaccurate information",
              "Request deletion of certain information",
              "Withdraw consent where processing is based on consent",
              "Object to certain processing activities",
              "Request information about how your data is used",
            ]}
          />

          <p>
            To exercise your rights, you can contact Dermacare using the
            contact information provided below.
          </p>
        </PrivacySection>

        {/* 8 */}
        <PrivacySection title="8. CHILDREN'S PRIVACY">
          <p>
            Dermacare's website and services are not intended to knowingly
            collect personal information from children without appropriate
            authorization.
          </p>

          <p>
            If you believe that a child has provided personal information to us
            without appropriate consent, please contact us so that we can take
            appropriate action.
          </p>
        </PrivacySection>

        {/* 9 */}
        <PrivacySection title="9. THIRD-PARTY WEBSITES">
          <p>
            Our website may contain links to third-party websites, payment
            services, social media platforms, or other external services.
          </p>

          <p>
            We are not responsible for the privacy practices or content of
            these third-party websites.
          </p>

          <p>
            We recommend reviewing the privacy notices of third-party services
            before providing them with your personal information.
          </p>
        </PrivacySection>

        {/* 10 */}
        <PrivacySection title="10. DO-NOT-TRACK FEATURES">
          <p>
            Some browsers provide Do-Not-Track features that allow users to
            indicate their preference regarding online tracking.
          </p>

          <p>
            Because there is currently no universally accepted standard for
            responding to all Do-Not-Track signals, Dermacare may not respond
            to all such signals.
          </p>
        </PrivacySection>

        {/* 11 */}
        <PrivacySection title="11. UPDATES TO THIS PRIVACY NOTICE">
          <p>
            We may update this Privacy Notice from time to time to reflect
            changes in our services, business practices, technology, or
            applicable requirements.
          </p>

          <p>
            When we make changes, we will update the{" "}
            <strong>"Last Updated"</strong> date at the top of this notice.
          </p>

          <p>
            We encourage you to review this page periodically to stay informed
            about how we protect your information.
          </p>
        </PrivacySection>

        {/* 12 */}
        <PrivacySection title="12. HOW CAN YOU CONTACT US?">
          <p>
            If you have questions, concerns, or requests regarding this
            Privacy Notice or the way Dermacare handles your personal
            information, please contact us.
          </p>

          <div className="mt-6 bg-pink-50 border border-pink-100 rounded-xl p-6">
            <p className="font-semibold text-gray-800">Dermacare</p>
            <p className="text-gray-700">
              <strong>Operated by:</strong> Seven Multi Trading Pvt. Ltd.
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> care@dermacare.com
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> +977-9800000002
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong> Dhulikhel, Kathmandu, Nepal
            </p>
          </div>
        </PrivacySection>

        {/* 13 */}
        <PrivacySection title="13. REVIEW, UPDATE, OR DELETE YOUR INFORMATION">
          <p>
            If you would like to review, update, correct, or request deletion
            of your personal information, please contact us using the contact
            details provided above.
          </p>

          <p>
            We will review your request and respond in accordance with
            applicable requirements.
          </p>
        </PrivacySection>

        {/* Bottom Message */}
        <div className="text-center mt-12 mb-8">
          <h2 className="text-2xl font-bold text-pink-600 mb-3">
            Your Privacy Matters to Us
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto leading-7">
            Dermacare is committed to handling your personal information
            responsibly and providing a safe and trustworthy shopping
            experience.
          </p>
        </div>

      </div>
    </main>
  );
}


/* Reusable Section Component */
function PrivacySection({ title, children }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 md:p-10 mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 pb-3 border-b border-pink-100">
        {title}
      </h2>

      <div className="space-y-4 text-gray-700 leading-7">
        {children}
      </div>
    </section>
  );
}


/* Reusable Subtitle Component */
function SubTitle({ children }) {
  return (
    <h3 className="text-lg font-semibold text-pink-600 pt-4">
      {children}
    </h3>
  );
}


/* Reusable Bullet List Component */
function BulletList({ items }) {
  return (
    <ul className="list-disc pl-6 space-y-2">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
 
  )
}

export default privacy