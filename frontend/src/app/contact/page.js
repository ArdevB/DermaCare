import React from "react";
export const metadata = {
  title: "Contact",
};
export default function Contact() {
  return (
    <>
      <div className="bg-white text-gray-900 min-h-screen ">
        {/* HERO */}

        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#fdf5f7] ">
          <img
            src="/images/contacts.png"
            className="block w-full h-auto object-cover mt-10"
          ></img>
        </div>

        {/*  CONTACT SECTION  */}
        <section className="max-w-6xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 ">
            {/*  CONTACT FORM  */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <h2 className="text-4xl font-bold mb-8 text-[#3A5134]">
                Have any questions? Feel free to reach out
              </h2>

              <form className="mt-6 space-y-5">
                {/* Full Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-semibold mb-1.5"
                    >
                      Full Name
                    </label>

                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="E.g. Alex Rivera"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold mb-1.5"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="alex@example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold mb-1.5"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What can we help you with?"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold mb-1.5"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="hover:bg-[#3A5134] bg-pink-500 text-white font-semibold px-8 py-3 rounded-lg transition duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* ==================== INFORMATION PANEL ==================== */}
            <div className="space-y-6">
              <div className="bg-gray-100 rounded-2xl p-6">
                {/* Support Email */}
                <div className="flex gap-4">
                  {/* Email Icon */}
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-emerald-800"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />

                      <path
                        d="M3 7l9 6 9-6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {/* Email Information */}
                  <div>
                    <p className="font-bold">Support Email</p>

                    <p className="text-gray-600 mt-1">care@dermacare.com</p>

                    <p className="text-gray-500 italic text-sm mt-0.5">
                      Expected response time: 24h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== QUICK ANSWERS ==================== */}
        <section className="w-full mx-auto px-8 py-16 bg-[#f5a5c1]">
          {/* Heading */}
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-[#3A5134]">
              Quick Answers
            </h2>

            <p className="text-gray-600 mt-2">
              Common questions our community asks us.
            </p>
          </div>

          {/* ==================== FAQ CARDS ==================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
            {/* Question 1 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="font-bold text-[#3A5134] text-center">
                How do I track my order?
              </p>

              <p className="text-gray-600 mt-2 leading-relaxed text-center">
                You can track your order using the link sent in your shipping
                confirmation email or via your account dashboard.
              </p>
            </div>

            {/* Question 2 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="font-bold text-[#3A5134] text-center">
                Are products dermatologically tested?
              </p>

              <p className="text-gray-600 mt-2 leading-relaxed text-center">
                Yes, 100% of our clinical formulations undergo rigorous
                independent dermatological testing for safety and efficacy.
              </p>
            </div>

            {/* Question 3 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="font-bold text-[#3A5134] text-center">
                Do you offer international shipping?
              </p>

              <p className="text-gray-600 mt-2 leading-relaxed text-center">
                Currently, we ship only all over Nepal.
              </p>
            </div>

            {/* Question 4 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="font-bold text-[#3A5134] text-center">
                What is your return policy?
              </p>

              <p className="text-gray-600 mt-2 leading-relaxed text-center">
                If the product is defective or damaged, you can exchange it
                within 7 days.
              </p>
            </div>
          </div>

          {/* ==================== HELP CENTER ==================== */}
          <div className="text-center mt-12">
            <p className="text-gray-600">Still have questions?</p>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-[#3A5134] font-semibold mt-2 hover:underline hover:text-pink-500"
            >
              View our full Help Center
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
