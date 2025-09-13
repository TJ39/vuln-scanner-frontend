import React from "react";

function Contact() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-8">
      <div className="max-w-3xl mx-auto neon-box rounded-xl p-8">
        <h1 className="text-4xl font-bold text-cyan-300 mb-6">Contact Us</h1>
        <p className="mb-4">
          Have questions or feedback? We’d love to hear from you.
        </p>
        <form className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-cyan-200">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-800 border border-cyan-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-cyan-200">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-800 border border-cyan-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-cyan-200">Message</label>
            <textarea
              rows="5"
              className="w-full px-4 py-2 bg-gray-800 border border-cyan-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Your message here..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg neon-button"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
