"use client";




import { useState } from "react";

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "What are your delivery charges and the delivery times?",
      answer: (
        <>
          <p>
            We deliver beauty products across Nepal at the most affordable
            fees, with rates varying by location.
          </p>

          <p className="mt-3">
            Add a product to your cart, select your delivery location and type
            (Standard or Express), and see the delivery fees instantly.
          </p>

          <p className="mt-3">
            The order generally gets dispatched in 1–2 working days and
            shipment time is around 1–2 working days for inside valley.
            Orders from outside valley may take 2–4 days.
          </p>
        </>
      ),
    },

    {
      question: "What payment methods are available?",
      answer: (
        <p>
          We accept Cash on Delivery, eSewa, Khalti, and bank transfer.
        </p>
      ),
    },

    {
      question: "How to track my order?",
      answer: (
        <>
          <p>
            You can track your order using the tracking link sent to your
            email.
          </p>

          <p className="mt-3">
            Or, login to your account and under My Account, there is a My
            Order option from where you can track the current status of your
            respective orders.
          </p>
        </>
      ),
    },

    {
      question: "How to change OR cancel my order?",
      answer: (
        <>
          <p>
            The order or item(s) can be canceled from your “My Order” section
            until the order is being processed, and cannot be canceled once
            the order is confirmed.
          </p>

          <p className="mt-3">
            However, if you wish to cancel the order after it has been
            confirmed, please contact our support team.
          </p>

          <p className="mt-3">
            If you need to make any changes to your order, please call us
            immediately after making your purchase at{" "}
            <strong>+977 9802624342</strong>.
          </p>
        </>
      ),
    },

    {
      question: "How do I add, remove or minimize products to my existing order?",
      answer: (
        <p>
          Once you place an order, other products cannot be added or
          minimized. To add a new product, you need to place a new order. If
          you wish to get all of your orders together, please write remarks
          mentioning the previous order number on your new order.
        </p>
      ),
    },

    {
      question: "Are there any cancellation charges?",
      answer: (
        <p>
          There are no separate cancellation charges.
        </p>
      ),
    },

    {
      question: "What to do in cases of failed delivery?",
      answer: (
        <p>
          Kindly give us a call at <strong>+977 9802524642</strong> and our
          team will follow up with you.
        </p>
      ),
    },
  ];

  const handleFAQClick = (index) => {
    if (openFAQ === index) {
      setOpenFAQ(null);
    } else {
      setOpenFAQ(index);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* FAQ Section */}
      <section className="w-full bg-white py-16">

        <div className="max-w-5xl mx-auto px-10 py-10 bg-white border border-gray-200 rounded-2xl shadow-sm">

          {/* Heading */}
          <div className="text-center mb-10">

            <h1 className="text-4xl md:text-5xl font-extrabold text-pink-500">
              Frequently Asked Questions
            </h1>

            <p className="text-gray-600 mt-3">
              Find answers to the most common questions about Dermacare.
            </p>

          </div>


          {/* FAQ List */}
          <div className="space-y-3">

            {faqs.map((faq, index) => {

              const isOpen = openFAQ === index;

              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                >

                  {/* Question */}
                  <button
                    type="button"
                    onClick={() => handleFAQClick(index)}
                    className={`w-full flex justify-between items-center p-5 text-left transition duration-200 ${
                      isOpen
                        ? "bg-[#f7dce3] text-pink-600"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}
                  >

                    <span className="font-semibold pr-4">
                      {faq.question}
                    </span>

                    <span
                      className={`text-xl flex-shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "rotate-180 text-pink-600"
                          : "text-gray-600"
                      }`}
                    >
                      ▼
                    </span>

                  </button>


                  {/* Answer */}
                  {isOpen && (
                    <div className="p-5 bg-white text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}

                </div>
              );
            })}

          </div>


          {/* Help Center */}
          <div className="text-center mt-12">

            <p className="text-gray-600">
              Still have questions?
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-emerald-800 font-semibold mt-2 hover:underline"
            >
              View our full Help Center

              <span className="text-lg">
                →
              </span>
            </a>

          </div>

        </div>

      </section>

    </div>
  );
};

export default FAQ;