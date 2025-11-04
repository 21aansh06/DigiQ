import React from 'react'

function Navbar() {
  return (
    <div>
        <header className="fixed w-full bg-white z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <img src="/digiQ.jpg" alt="Logo" className="h-10 w-auto" />
          <nav className="space-x-5 text-gray-700 font-medium">
            {/* <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition">How It Works</a>
            <a href="#contact" className="hover:text-blue-600 transition">Contact</a> */}
            <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">Login</a>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default Navbar
