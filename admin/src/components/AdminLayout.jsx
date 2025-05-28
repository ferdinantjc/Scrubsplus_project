import React from 'react'

const AdminLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 🟦 Banner with Wave */}
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32 w-full"></div>
        <svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="white"
            d="M0,80 C360,0 1080,0 1440,80 L1440,0 L0,0 Z"
          />
        </svg>
        <div className="absolute top-4 left-6 text-white">
          <h1 className="text-2xl font-bold">🩺 ScrubsPlus Admin</h1>
          <p className="text-sm">Manage your products, orders, and inventory.</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6 -mt-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="bg-white p-6 rounded-xl shadow">{children}</div>
      </main>
    </div>
  )
}

export default AdminLayout
