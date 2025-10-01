import React from 'react'
const Contact = () => {
  return (
    <section id="contact" className="bg-gray-50 min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-3xl w-full bg-white p-10 rounded-xl shadow-xl border border-gray-200">
        <h2 className="text-4xl font-extrabold mb-4 text-center text-gray-900">
          Contact Us
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Have questions or want a personalized demo? Fill out the form below and
          we’ll get back to you promptly.
        </p>

        <form className="space-y-6">
          <div className="flex flex-col md:flex-row md:gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <input
              type="email"
              placeholder="Email"
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 mt-4 md:mt-0"
            />
          </div>

          <input
            type="text"
            placeholder="School / University"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <textarea
            placeholder="Message"
            rows="5"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-sky-500 text-white font-semibold py-3 rounded-lg shadow hover:bg-sky-600 transition"
          >
            Send Message
          </button>
        </form>

        <div className="mt-10 text-center text-gray-700 space-y-2">
          <p>Email: <a href="mailto:support@meiryoai.com" className="text-sky-500 hover:underline">support@meiryoai.com</a></p>
          <p>Phone: <a href="tel:+1234567890" className="text-sky-500 hover:underline">+1 (234) 567-890</a></p>
        </div>
      </div>
    </section>

  );
}

export default Contact