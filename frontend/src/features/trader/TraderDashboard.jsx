import { useState } from "react";
import Navbar from "../../components/Navbar";
import BrowseCrops from "./BrowseCrops";
import MyProducts from "./MyProducts";
import MyPurchases from "./MyPurchases";

function TraderDashboard() {
  const [tab, setTab] = useState("browse");

  const tabs = [
    { key: "browse", label: "🌾 Browse Crops" },
    { key: "products", label: "📦 My Product Requests" },
    { key: "purchases", label: "🛒 My Purchases" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-3xl shadow-xl text-white p-8 mb-8 text-center">

          <h1 className="text-4xl font-bold">
            Trader Dashboard
          </h1><br></br>

          <p className="mt-3 text-green-100 text-lg">
            Welcome back! Browse crops, manage product requests and track your purchases.
          </p>

        </div>

        {/* Main Dashboard Card */}
        <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">

          {/* Navigation */}
          <div className="flex gap-3 overflow-x-auto p-5 border-b bg-gray-50">

            {tabs.map((tabItem) => (
              <button
                key={tabItem.key}
                onClick={() => setTab(tabItem.key)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                  tab === tabItem.key
                    ? "bg-green-600 text-white shadow-lg scale-105"
                    : "bg-white border text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                }`}
              >
                {tabItem.label}
              </button>
            ))}

          </div>

          {/* Content */}
          <div className="p-6 md:p-8">

            {tab === "browse" && (
              <>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">
                    Browse Available Crops
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Explore fresh crops listed by farmers and purchase directly.
                  </p>
                </div>

                <BrowseCrops />
              </>
            )}

            {tab === "products" && (
              <>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">
                    My Product Requests
                  </h2>

                  <p className="text-gray-500 mt-1">
                    View and manage all the product requests you have created.
                  </p>
                </div>

                <MyProducts />
              </>
            )}

            {tab === "purchases" && (
              <>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">
                    My Purchases
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Track your purchase history and completed transactions.
                  </p>
                </div>

                <MyPurchases />
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default TraderDashboard;