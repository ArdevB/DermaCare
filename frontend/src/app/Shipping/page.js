import React from "react";

const shipping = () => {
  return (
    <>
      <div className="bg-white text-gray-700 min-h-screen ">
        {/* Image */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#fdf5f7]">
          <img
            src="/images/contacts.png"
            className="block w-full h-auto object-cover mt-10"
          ></img>
        </div>
        <section className="">
          {/*Shipping Policy */}
          <div className="max-w-6xl mx-auto px-8 py-12 ">
            <h1 className="text-4xl font-bold mb-8 text-pink-500 text-center ">
              Shipping Policy
            </h1>

            <div className="w-48 h-[3px] bg-pink-500 mx-auto mt-6"></div>
          </div>

          <section className="w-full text-gray-800 max-w-7xl mx-auto px-10 py-10 bg-white border border-gray-200 shadow-sm">
            {/* Heading */}
            <div className="">
              <p className="text-2xl font-bold px-2">
                How does the delivery process work?
              </p>
              <div className="px-8">
                <li className="">
                  Once you place an order, we carefully check and inspect the
                  products to ensure they are in perfect condition. Once they
                  pass the quality checks, we pack them securely to protect them
                  during transportation.
                </li>
                <li>
                  Once packed, your order will be sent from our warehouse to our
                  delivery partner. You'll receive a notification confirming
                  that your order has been dispatched, keeping you updated on
                  its progress.
                </li>
                <li>
                  Our trusted delivery partner takes charge of the package and
                  ensures it is safely delivered to your provided address. They
                  strive to deliver it quickly, but if they encounter any
                  issues, they will promptly contact you to resolve them.
                </li>
              </div>
            </div>

            {/* Shipping CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
              {/*  1 */}
              <div className=" border border-gray-200 rounded-2xl p-6 bg-[#FCEFF3]">
                <p className="font-bold text-[#3A5134] ">
                  How are items packaged?
                </p>

                <p className="text-gray-600 mt-2 leading-relaxed ">
                  We package our products in boxes covered with a plastic layer.
                  Each product is individually wrapped in bubble wrap, and
                  fragile items like bottles are additionally secured with
                  bubble wrap. We take pride in the quality of our packaging
                </p>
              </div>

              {/*  2 */}
              <div className=" border border-gray-200 rounded-2xl p-6 bg-[#F3EFFB]">
                <p className="font-bold text-[#3A5134]">
                  What is the range of locations where DermaCare ships its
                  products?
                </p>

                <p className="text-gray-600 mt-2 leading-relaxed">
                  DermaCare offers shipping services throughout Nepal. Our goal
                  is to make our products accessible to customers all over the
                  country, regardless of their location. From major cities to
                  remote areas, we aim to reach every corner of Nepal with our
                  shipping services.
                </p>
              </div>

              {/* 3 */}
              <div className=" border border-gray-200 rounded-2xl p-6 bg-[#F3EFFB]">
                <p className="font-bold text-[#3A5134] ">
                  What is the estimated delivery time?
                </p>

                <p className="text-gray-600 mt-2 leading-relaxed ">
                  We usually dispatch most orders within 1-3 business days
                  (excluding Saturdays and public holidays). While 90% of our
                  catalogue is in stock, certain products may need to be sourced
                  directly from the brand, causing a delay. If you order during
                  a Mega Sale Campaign, dispatches may take up to 5 days. We
                  strive to deliver your order as quickly as possible.
                </p>
              </div>

              {/*  4 */}
              <div className=" border border-gray-200 rounded-2xl p-6 bg-[#FCEFF3]">
                <p className="font-bold text-[#3A5134] ">
                  Will my order be shipped in multiple shipments?
                </p>

                <p className="text-gray-600 mt-2 leading-relaxed ">
                  No, we try to streamline our shipping process to deliver your
                  order in a single shipment whenever possible. We understand
                  the importance of convenience and efficiency, and
                  consolidating items into one shipment helps us achieve that
                  goal.
                </p>
              </div>
              {/* 5 */}
              <div className=" border border-gray-200 rounded-2xl p-6 bg-[#FCEFF3]">
                <p className="font-bold text-[#3A5134]">
                  Are there any shipping charges applicable to my order?
                </p>

                <p className="text-gray-600 mt-2 leading-relaxed ">
                  We have standard shipping charges for most addresses. For
                  deliveries outside the valley below Rs.1000, there is a fixed
                  shipping charge of Rs.100/-. For deliveries outside the valley
                  above Rs.1000, the shipping charge is Rs.79/- per delivery.
                  For deliveries inside the valley below Rs.1000, there will be
                  a shipping charge of Rs.50/-. However, for orders above
                  Rs.1000, we offer free delivery within the valley.
                </p>
              </div>
              {/* 6 */}
              <div className=" border border-gray-200 rounded-2xl p-6 bg-[#F3EFFB]">
                <p className="font-bold text-[#3A5134] ">
                  Does DermaCare ship outside Nepal?
                </p>

                <p className="text-gray-600 mt-2 leading-relaxed ">
                  Currently, DermaCare only ships within Nepal. We do not offer
                  international shipping services. However, we are working on
                  expanding our reach and exploring options for international
                  delivery to serve customers in other countries. We appreciate
                  your support and encourage you to stay tuned for updates
                  regarding international shipping availability.
                </p>
              </div>
            </div>
          </section>
        </section>
      </div>
    </>
  );
};

export default shipping;
