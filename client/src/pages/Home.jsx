import React from "react";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* Navbar */}
      <Navbar/>

      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-r from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-10">
          <div className="lg:w-1/2 space-y-5">
            <h2 className="text-4xl font-semibold leading-snug text-gray-900">
              Kill the Waiting Line with QueueLess
            </h2>
            <p className="text-gray-600 text-lg">
              Smart digital queue management for hospitals, banks, and services. Track your token and wait time in real-time, anywhere.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition">
                Get Started
              </a>
              <a href="#how-it-works" className="border border-blue-600 text-blue-600 px-5 py-2 rounded-full font-medium hover:bg-blue-50 transition">
                Learn More
              </a>
            </div>
          </div>
          <div className="lg:w">
            <img
              src="/queue.png"
              alt="Queue Illustration"
              className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-500 w-93 h-51"
            />
          </div>
        </div>
      </section>
      
        

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-semibold text-gray-900 text-center mb-12">Features</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 duration-300 text-center">
            <h4 className="text-xl font-medium text-blue-600 mb-2">Real-time Queue</h4>
            <p className="text-gray-600 text-sm">Track your waiting line digitally with live updates and token numbers.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 duration-300 text-center">
            <h4 className="text-xl font-medium text-blue-600 mb-2">Remote Joining</h4>
            <p className="text-gray-600 text-sm">Join queues from anywhere, avoiding long waits in person.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 duration-300 text-center">
            <h4 className="text-xl font-medium text-blue-600 mb-2">OTP Verification</h4>
            <p className="text-gray-600 text-sm">Secure phone verification ensures only valid users join the queue.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <h3 className="text-3xl font-semibold text-gray-900 text-center mb-12">How It Works</h3>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 duration-300 text-center">
            <h4 className="text-lg font-medium text-blue-600 mb-2">Select Service</h4>
            <p className="text-gray-600 text-sm">Pick a service from a registered organization.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 duration-300 text-center">
            <h4 className="text-lg font-medium text-blue-600 mb-2">Verify OTP</h4>
            <p className="text-gray-600 text-sm">Confirm your phone number via OTP for security.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 duration-300 text-center">
            <h4 className="text-lg font-medium text-blue-600 mb-2">Join Queue</h4>
            <p className="text-gray-600 text-sm">Receive your token number and track your queue in real-time.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center bg-white">
        <h3 className="text-3xl font-semibold mb-4 text-gray-900">Skip the Line Today!</h3>
        <p className="text-gray-600 mb-6 text-sm max-w-xl mx-auto">
          Join QueueLess and experience hassle-free, modern queue management.
        </p>
        <a href="/register" className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition">
          Get Started
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} QueueLess. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
