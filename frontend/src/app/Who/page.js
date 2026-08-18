import React from 'react'

const Who = () => {
   return (
    <main className="min-h-screen bg-[#f7f7ff] text-gray-800">

      {/* ================= HERO / WHO WE ARE ================= */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-7xl mx-auto text-center">

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-pink-600">
            Who We Are
          </h1>

          {/* Underline */}
          <div className="w-[188px] h-[3px] bg-pink-500 mx-auto mt-7"></div>

          {/* Introduction */}
          <div className="max-w-6xl mx-auto mt-8 space-y-5">
            <p className="text-base md:text-lg leading-8 text-gray-700">
              <strong className="text-pink-600">DermaCare</strong> is a
              beauty and skincare e-commerce platform dedicated to helping
              people discover quality products for their everyday beauty and
              self-care needs.
            </p>

            <p className="text-base md:text-lg leading-8 text-gray-700">
              We believe that skincare and self-care should be simple,
              accessible, and enjoyable. Our platform brings together a
              carefully selected range of skincare, haircare, bodycare,
              makeup, and beauty products in one convenient place.
            </p>

            <p className="text-base md:text-lg leading-8 text-gray-700">
              At DermaCare, our goal is to create a shopping experience where
              customers can discover products they love, make informed
              choices, and feel confident in their everyday beauty routine.
            </p>
          </div>

        </div>
      </section>


      {/* ================= MISSION & VISION ================= */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">

          {/* Mission */}
          <div className="bg-white p-8 md:p-12 min-h-[300px]">

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <span className="text-2xl">♡</span>
              </div>

              <h2 className="text-2xl font-bold text-gray-800">
                Our Mission
              </h2>
            </div>

            <p className="text-gray-700 text-base md:text-lg leading-8">
              Our mission is to make quality beauty and skincare products
              easier to discover and access. We aim to provide a convenient,
              reliable, and enjoyable shopping experience while helping
              individuals embrace their unique beauty and take better care of
              themselves.
            </p>

          </div>


          {/* Vision */}
          <div className="bg-[#f3dbea] p-8 md:p-12 min-h-[300px]">

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <span className="text-2xl">✦</span>
              </div>

              <h2 className="text-2xl font-bold text-gray-800">
                Our Vision
              </h2>
            </div>

            <p className="text-gray-700 text-base md:text-lg leading-8">
              Our vision is to become a trusted beauty and skincare platform
              where everyone can explore products that suit their individual
              needs. We envision a future where beauty is inclusive,
              accessible, and centered around confidence and self-expression.
            </p>

          </div>

        </div>
      </section>


      {/* ================= WHY CHOOSE DERMACARE ================= */}
      <section className="px-6 py-16 bg-white">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">

            <h2 className="text-3xl md:text-4xl font-bold text-pink-600">
              Why Choose DermaCare?
            </h2>

            <div className="w-[150px] h-[3px] bg-pink-500 mx-auto mt-5"></div>

            <p className="text-gray-600 mt-5 max-w-2xl mx-auto leading-7">
              We focus on making your beauty shopping experience simple,
              convenient, and trustworthy.
            </p>

          </div>


          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Card 1 */}
            <div className="bg-[#f8f8ff] p-7 rounded-xl text-center hover:-translate-y-1 transition duration-300">

              <div className="w-14 h-14 mx-auto rounded-full bg-pink-100 flex items-center justify-center mb-5">
                <span className="text-2xl">✓</span>
              </div>

              <h3 className="text-lg font-bold mb-3">
                Quality Products
              </h3>

              <p className="text-gray-600 leading-6 text-sm">
                We aim to provide quality beauty and personal-care products
                that meet the needs of our customers.
              </p>

            </div>


            {/* Card 2 */}
            <div className="bg-[#f8f8ff] p-7 rounded-xl text-center hover:-translate-y-1 transition duration-300">

              <div className="w-14 h-14 mx-auto rounded-full bg-pink-100 flex items-center justify-center mb-5">
                <span className="text-2xl">♡</span>
              </div>

              <h3 className="text-lg font-bold mb-3">
                Customer First
              </h3>

              <p className="text-gray-600 leading-6 text-sm">
                Your satisfaction matters to us. We strive to create a smooth
                and customer-friendly shopping experience.
              </p>

            </div>


            {/* Card 3 */}
            <div className="bg-[#f8f8ff] p-7 rounded-xl text-center hover:-translate-y-1 transition duration-300">

              <div className="w-14 h-14 mx-auto rounded-full bg-pink-100 flex items-center justify-center mb-5">
                <span className="text-2xl">✦</span>
              </div>

              <h3 className="text-lg font-bold mb-3">
                Easy Shopping
              </h3>

              <p className="text-gray-600 leading-6 text-sm">
                We bring different beauty categories together so you can
                discover products conveniently in one place.
              </p>

            </div>


            {/* Card 4 */}
            <div className="bg-[#f8f8ff] p-7 rounded-xl text-center hover:-translate-y-1 transition duration-300">

              <div className="w-14 h-14 mx-auto rounded-full bg-pink-100 flex items-center justify-center mb-5">
                <span className="text-2xl">♡</span>
              </div>

              <h3 className="text-lg font-bold mb-3">
                Beauty for Everyone
              </h3>

              <p className="text-gray-600 leading-6 text-sm">
                We believe beauty is personal and everyone deserves to feel
                confident in their own skin.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= OUR VALUES ================= */}
      <section className="px-6 py-16 bg-[#f7f7ff]">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">

            <h2 className="text-3xl md:text-4xl font-bold text-pink-600">
              Our Values
            </h2>

            <div className="w-[150px] h-[3px] bg-pink-500 mx-auto mt-5"></div>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Value 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">

              <span className="text-pink-500 text-3xl">
                01
              </span>

              <h3 className="text-xl font-bold mt-4 mb-3">
                Trust
              </h3>

              <p className="text-gray-600 leading-7">
                We believe trust is the foundation of a strong relationship
                with our customers. We aim to communicate clearly and
                responsibly.
              </p>

            </div>


            {/* Value 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">

              <span className="text-pink-500 text-3xl">
                02
              </span>

              <h3 className="text-xl font-bold mt-4 mb-3">
                Quality
              </h3>

              <p className="text-gray-600 leading-7">
                We continuously work toward providing products and services
                that deliver value and meet customer expectations.
              </p>

            </div>


            {/* Value 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">

              <span className="text-pink-500 text-3xl">
                03
              </span>

              <h3 className="text-xl font-bold mt-4 mb-3">
                Inclusivity
              </h3>

              <p className="text-gray-600 leading-7">
                Beauty comes in many forms. We believe everyone should feel
                welcome and confident when exploring beauty and self-care.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= OUR COMMITMENT ================= */}
      <section className="px-6 py-16">

        <div className="max-w-7xl mx-auto">

          <div className="bg-pink-600 rounded-2xl px-8 py-12 md:px-16 md:py-14 text-center">

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
              Our Commitment
            </h2>

            <p className="max-w-3xl mx-auto text-white/90 text-base md:text-lg leading-8">
              At DermaCare, we are committed to continuously improving the
              way you shop for beauty and skincare products. From discovering
              products to completing your order, we want every step to feel
              simple, convenient, and reliable.
            </p>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="px-6 pb-20">

        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Discover Your Beauty Essentials
          </h2>

          <p className="text-gray-600 leading-7 mb-7">
            Explore our collection and find products that fit your beauty and
            self-care routine.
          </p>

          <a
            href="/products"
            className="inline-block bg-pink-600 hover:bg-[#3A5134] text-white font-semibold px-8 py-3 rounded-full transition duration-300"
          >
            Shop Now
          </a>

        </div>

      </section>

    </main>
  );
}

export default Who