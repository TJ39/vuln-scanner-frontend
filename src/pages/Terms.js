import React from "react";

function Terms() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-8">
      <div className="max-w-3xl mx-auto neon-box rounded-xl p-8">
        <h1 className="text-4xl font-bold text-cyan-300 mb-6">Terms of Service</h1>
        <p className="mb-4">
          By using Inspectra, you agree to the following terms and conditions.
        </p>
        <h2 className="text-2xl text-cyan-200 mt-6 mb-2">1. Usage</h2>
        <p className="mb-4">
          You may use this tool for ethical security testing, research, and
          educational purposes only.
        </p>
        <h2 className="text-2xl text-cyan-200 mt-6 mb-2">2. Restrictions</h2>
        <p className="mb-4">
          Do not use Inspectra for malicious activities. Unauthorized scanning of
          third-party systems without permission is prohibited.
        </p>
        <h2 className="text-2xl text-cyan-200 mt-6 mb-2">3. Liability</h2>
        <p className="mb-4">
          Inspectra and its developers are not responsible for damages or misuse of
          this tool.
        </p>
        <p className="mt-8 text-sm text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default Terms;
