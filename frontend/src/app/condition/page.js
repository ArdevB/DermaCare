import React from 'react'

const terms = () => {
  return (
    <main className="min-h-screen bg-[#f8f8ff] py-16">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">

        {/* ================= HEADER ================= */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-600">
            Terms of Use
          </h1>

          <div className="w-[188px] h-[3px] bg-pink-500 mx-auto mt-7"></div>

          <p className="mt-5 text-sm text-gray-500">
            Last Updated: August 15, 2026
          </p>
        </div>

        {/* ================= INTRODUCTION ================= */}
        <section className="bg-white rounded-2xl shadow-sm p-6 md:p-10 mb-8">
          <p className="text-gray-700 leading-7 mb-4">
            The domain name <strong>www.dermacare.com</strong> (hereinafter
            referred to as the “Website”) is owned and operated by{" "}
            <strong>Seven Multi Trading Pvt. Ltd.</strong>, a company
            incorporated under the applicable laws of Nepal (hereinafter
            referred to as “Seven”).
          </p>

          <p className="text-gray-700 leading-7 mb-4">
            You may access our Website from a computer, mobile phone, tablet,
            or other device. These Terms of Use govern your use of our Website,
            services, features, and content regardless of the means of access.
          </p>

          <p className="text-gray-700 leading-7">
            The Website is intended for your personal and non-commercial use
            and information. Your use of the Website and its services is
            governed by these Terms of Use together with our Privacy Notice,
            Shipping Policy, and Cancellation, Refund & Return Policy.
          </p>
        </section>

        {/* ================= ACCEPTANCE ================= */}
        <TermsSection title="1. ACCEPTANCE OF TERMS">
          <p>
            By accessing, browsing, or using the Dermacare Website, you
            acknowledge that you have read, understood, and agreed to be bound
            by these Terms of Use and our applicable policies.
          </p>

          <p>
            If you do not agree with any part of these Terms of Use or our
            policies, please do not access or use the Website.
          </p>

          <p>
            You are responsible for ensuring that your use of the Website and
            the materials available through it complies with all applicable
            laws and regulations.
          </p>
        </TermsSection>

        {/* ================= CHANGES ================= */}
        <TermsSection title="2. CHANGES TO THESE TERMS">
          <p>
            Dermacare reserves the right to change, modify, or update these
            Terms of Use and related policies from time to time.
          </p>

          <p>
            Any updated version will be posted on the Website along with the
            updated date. Changes will become effective when they are posted
            on the Website.
          </p>

          <p>
            Your continued use of the Website after changes have been posted
            means that you accept the revised Terms of Use.
          </p>

          <p>
            We recommend that you review these Terms periodically to stay
            informed about the terms applicable to your use of the Website.
          </p>
        </TermsSection>

        {/* ================= PRIVACY ================= */}
        <TermsSection title="3. PRIVACY PRACTICES">
          <p>
            We understand the importance of protecting your personal
            information. Dermacare has established a Privacy Notice explaining
            how personal information is collected, used, stored, and
            protected.
          </p>

          <p>
            Your use of the Website is also governed by our Privacy Notice.
            By continuing to use the Website, you acknowledge that you have
            read and accepted the Privacy Notice.
          </p>

          <p>
            Your personal information will be handled in accordance with the
            Privacy Notice and applicable laws.
          </p>
        </TermsSection>

        {/* ================= ACCOUNT ================= */}
        <TermsSection title="4. YOUR ACCOUNT">
          <p>
            Certain features of the Website may require you to create an
            account.
          </p>

          <p>
            You are responsible for maintaining the confidentiality of your
            account information, including your password, and for restricting
            unauthorized access to your account.
          </p>

          <p>
            You are responsible for all activities that occur under your
            account.
          </p>

          <p>
            The information you provide to Dermacare must be accurate,
            complete, and current. You should notify us if any of your
            information changes.
          </p>

          <p>
            If you believe that the security of your account has been
            compromised, you should contact Dermacare immediately.
          </p>

          <p>
            Dermacare reserves the right to suspend or terminate an account if
            these Terms of Use are violated or if necessary to protect the
            security and interests of Dermacare and its users.
          </p>
        </TermsSection>

        {/* ================= PRODUCT INFORMATION ================= */}
        <TermsSection title="5. PRODUCT & SERVICES INFORMATION">
          <p>
            Dermacare makes reasonable efforts to provide accurate information
            about products displayed on the Website.
          </p>

          <p>
            However, we do not guarantee that product descriptions, colors,
            images, prices, availability, specifications, or other Website
            content will always be completely accurate, current, reliable, or
            error-free.
          </p>

          <p>
            Product images are provided for illustrative purposes and may
            differ slightly from the actual product because of lighting,
            photography, screen settings, packaging changes, or other factors.
          </p>

          <p>
            Dermacare reserves the right to correct, change, or update product
            information, pricing, availability, errors, or omissions at any
            time.
          </p>
        </TermsSection>

        {/* ================= PRODUCT USE ================= */}
        <TermsSection title="6. PRODUCT USE & SERVICES">
          <p>
            Products and services available through Dermacare are intended for
            personal use unless otherwise stated.
          </p>

          <p>
            Products purchased from Dermacare should not be resold for
            unauthorized commercial purposes without appropriate permission.
          </p>

          <p>
            Customers should carefully read product labels, instructions,
            warnings, and usage information before using skincare, beauty, or
            personal-care products.
          </p>

          <p>
            If you experience irritation, an allergic reaction, or any other
            unexpected reaction after using a product, discontinue use and
            consult an appropriate healthcare professional.
          </p>

          <p>
            Dermacare does not provide medical diagnosis or treatment through
            its Website. Product information is provided for general
            informational purposes and should not replace professional medical
            advice.
          </p>
        </TermsSection>

        {/* ================= RECOMMENDATIONS ================= */}
        <TermsSection title="7. PRODUCT RECOMMENDATIONS">
          <p>
            Any product recommendations, skincare suggestions, or other
            information provided through the Dermacare Website are intended for
            general informational and convenience purposes.
          </p>

          <p>
            Such recommendations do not constitute medical advice,
            professional diagnosis, or a guarantee that a particular product
            will be suitable for every individual.
          </p>

          <p>
            Customers should consider their individual skin type, allergies,
            sensitivities, and other personal circumstances before purchasing
            or using a product.
          </p>
        </TermsSection>

        {/* ================= LICENSE ================= */}
        <TermsSection title="8. LIMITED LICENSE">
          <p>
            Dermacare grants you a limited, non-exclusive,
            non-transferable, and non-sublicensable license to access and use
            the Website for personal and non-commercial purposes.
          </p>

          <p>
            You may not reproduce, copy, modify, distribute, sell, publish, or
            commercially exploit any portion of the Website without prior
            written permission from Dermacare.
          </p>

          <p>
            All rights not expressly granted under these Terms of Use are
            reserved by Dermacare and its licensors.
          </p>

          <p>
            Dermacare may restrict, suspend, or terminate your access to the
            Website at any time if these Terms of Use are violated.
          </p>
        </TermsSection>

        {/* ================= ORDERS ================= */}
        <TermsSection title="9. ORDERS & PAYMENTS">
          <p>
            When you place an order through the Dermacare Website, you agree
            to provide accurate and complete information.
          </p>

          <p>
            Placing an order does not necessarily guarantee acceptance of the
            order. Dermacare reserves the right to accept, reject, or cancel
            an order where necessary.
          </p>

          <p>
            Orders may be cancelled if a product is unavailable, pricing or
            product information contains an error, payment cannot be
            confirmed, or the order does not comply with our Website policies.
          </p>

          <p>
            If Dermacare cancels a prepaid order, any applicable refund will be
            processed through the appropriate payment method within a
            reasonable period.
          </p>
        </TermsSection>

        {/* ================= REFUNDS ================= */}
        <TermsSection title="10. REFUNDS & CANCELLATIONS">
          <p>
            Dermacare aims to provide a convenient cancellation and return
            process for eligible orders.
          </p>

          <SubTitle>Order Has Not Been Shipped</SubTitle>

          <p>
            An order that has not yet been shipped may be eligible for partial
            or complete cancellation depending on the circumstances and
            applicable policy.
          </p>

          <p>
            If payment has already been made, an eligible refund will be
            processed through the applicable payment method.
          </p>

          <SubTitle>Order Arrived Damaged</SubTitle>

          <p>
            We take reasonable care when packaging products. However, products
            may occasionally be damaged during transportation.
          </p>

          <p>
            If you receive a damaged product, please contact Dermacare as soon
            as possible after receiving your order and provide your order
            details and photographs of the damaged product where applicable.
          </p>

          <SubTitle>Incorrect Product Received</SubTitle>

          <p>
            If you receive a product different from the product you ordered,
            please contact Dermacare with your order ID and details of the
            issue.
          </p>

          <p>
            After reviewing the issue, Dermacare may arrange a replacement,
            return, or applicable refund in accordance with our Refund &
            Return Policy.
          </p>

          <SubTitle>Other Returns</SubTitle>

          <p>
            Requests for cancellation, return, or replacement for reasons not
            specifically covered by our policy will be reviewed on a
            case-by-case basis.
          </p>
        </TermsSection>

        {/* ================= NON RETURNABLE ================= */}
        <TermsSection title="11. PRODUCTS NOT ELIGIBLE FOR RETURN OR REPLACEMENT">
          <p>
            Unless otherwise required by applicable law, certain products may
            not be eligible for return or replacement, including:
          </p>

          <BulletList
            items={[
              "Products damaged due to misuse or improper handling",
              "Products that have been opened or used where hygiene or safety considerations prevent resale",
              "Products that are damaged due to customer negligence",
              "Products with missing or damaged original packaging where applicable",
              "Products returned without required accessories or components",
              "Products that do not meet the conditions specified in our Return Policy",
            ]}
          />

          <p>
            Additional restrictions may apply depending on the product and
            applicable return policy.
          </p>
        </TermsSection>

        {/* ================= REFUND METHOD ================= */}
        <TermsSection title="12. REFUND PROCESS">
          <p>
            Where a refund is approved, the refund will generally be processed
            through the original payment method or another method agreed upon
            by Dermacare and the customer.
          </p>

          <p>
            The time required for the refund to appear in the customer's
            account may depend on the payment provider or financial
            institution.
          </p>
        </TermsSection>

        {/* ================= CANCELLATION ================= */}
        <TermsSection title="13. CANCELLATION OF ORDERS">
          <p>
            Dermacare reserves the right to cancel an order where we are
            unable to fulfill the order, the requested product is unavailable,
            payment cannot be verified, the order violates Website policies,
            or other circumstances prevent us from completing the transaction.
          </p>

          <p>
            Where an order is cancelled after payment has been received,
            Dermacare will process any applicable refund within a reasonable
            period.
          </p>
        </TermsSection>

        {/* ================= DISCLAIMER ================= */}
        <TermsSection title="14. DISCLAIMER OF WARRANTY">
          <p>
            The Website and its content are provided on an “as is” and “as
            available” basis to the fullest extent permitted by applicable
            law.
          </p>

          <p>
            Dermacare does not guarantee that the Website will always be
            uninterrupted, error-free, secure, or completely accurate.
          </p>

          <p>
            We do not guarantee that defects or errors in the Website will
            always be corrected.
          </p>
        </TermsSection>

        {/* ================= LIMITATION ================= */}
        <TermsSection title="15. LIMITATION OF LIABILITY">
          <p>
            To the fullest extent permitted by applicable law, Dermacare,
            Seven Multi Trading Pvt. Ltd., its employees, directors, partners,
            affiliates, service providers, and licensors will not be liable
            for indirect, incidental, special, consequential, or punitive
            damages arising from your use of the Website.
          </p>

          <p>
            This may include losses resulting from Website interruptions,
            access delays, technical failures, data loss, third-party links,
            viruses, inaccuracies, or events beyond our reasonable control.
          </p>

          <p>
            Nothing in these Terms is intended to exclude or limit liability
            that cannot legally be excluded or limited under applicable law.
          </p>
        </TermsSection>

        {/* ================= THIRD PARTY LINKS ================= */}
        <TermsSection title="16. THIRD-PARTY LINKS">
          <p>
            The Dermacare Website may contain links to third-party websites,
            applications, payment providers, social media platforms, or other
            external services.
          </p>

          <p>
            These links are provided for convenience. Dermacare does not
            control and is not responsible for the content, security, or
            privacy practices of third-party websites.
          </p>

          <p>
            You should review the terms and privacy policies of third-party
            websites before using them.
          </p>
        </TermsSection>

        {/* ================= TERMINATION ================= */}
        <TermsSection title="17. TERMINATION">
          <p>
            These Terms of Use remain effective until terminated by you or
            Dermacare.
          </p>

          <p>
            You may stop using the Website at any time.
          </p>

          <p>
            Dermacare may suspend or terminate your access to the Website,
            without prior notice where permitted by law, if you violate these
            Terms of Use or if necessary to protect the Website, our users, or
            our business.
          </p>

          <p>
            Termination will not cancel obligations relating to purchases
            already made or liabilities that arose before termination.
          </p>
        </TermsSection>

        {/* ================= INDEMNITY ================= */}
        <TermsSection title="18. INDEMNITY">
          <p>
            You agree to defend, indemnify, and hold harmless Dermacare, Seven
            Multi Trading Pvt. Ltd., its employees, directors, officers,
            agents, affiliates, partners, and service providers from claims,
            losses, liabilities, damages, costs, and expenses arising from:
          </p>

          <BulletList
            items={[
              "Your violation of these Terms of Use",
              "Your misuse of the Website",
              "Your violation of applicable laws or regulations",
              "Your infringement of intellectual property or other rights",
              "Information or content submitted by you that violates the rights of others",
              "Your unauthorized use of the Website or its services",
            ]}
          />

          <p>
            This provision will survive the termination or expiry of these
            Terms to the extent permitted by applicable law.
          </p>
        </TermsSection>

        {/* ================= CONTACT ================= */}
        <TermsSection title="19. CONTACT INFORMATION">
          <p>
            If you have any questions, concerns, or complaints regarding these
            Terms of Use, please contact Dermacare.
          </p>

          <div className="mt-6 bg-pink-50 border border-pink-100 rounded-xl p-6">
            <p className="font-semibold text-gray-800 mb-2">
              Dermacare
            </p>

            <p className="text-gray-700">
              <strong>Operated by:</strong> Seven Multi Trading Pvt. Ltd.
            </p>

            <p className="text-gray-700">
              <strong>Email:</strong> care@dermacare.com
            </p>

            <p className="text-gray-700">
              <strong>Phone:</strong> +977-980000002
            </p>

            <p className="text-gray-700">
              <strong>Address:</strong> Dhulikhel, Kathmandu, Nepal
            </p>
          </div>
        </TermsSection>

        {/* ================= FOOTER MESSAGE ================= */}
        <div className="text-center mt-12 mb-8">
          <h2 className="text-2xl font-bold text-pink-600 mb-3">
            Thank You for Choosing Dermacare
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto leading-7">
            By using our Website, you agree to follow these Terms of Use and
            help us maintain a safe, reliable, and enjoyable shopping
            experience for everyone.
          </p>
        </div>

      </div>
    </main>
  );
}


// /* =====================================================
//    REUSABLE TERMS SECTION
// ===================================================== */

function TermsSection({ title, children }) {
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


// /* =====================================================
//    REUSABLE SUBTITLE
// ===================================================== */

function SubTitle({ children }) {
  return (
    <h3 className="text-lg font-semibold text-pink-600 pt-4">
      {children}
    </h3>
  );
}




function BulletList({ items }) {
  return (
    <ul className="list-disc pl-6 space-y-2">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default terms