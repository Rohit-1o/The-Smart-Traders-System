import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import BrowseCrops from "../trader/BrowseCrops";
import VendorPurchases from "./VendorPurchases";
import VendorTransportation from "./VendorTransportation";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errorHandler";
import {
  getMyListings,
  createListing,
  updateListing,
  deleteListing,
} from "../../api/vendorApi";

function VendorDashboard() {
  const [tab, setTab] = useState("listings");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    pricePerUnit: "",
    unit: "",
    description: "",
  });

  const { showToast } = useToast();

  const tabs = [
    { key: "listings", label: "🏪 My Listings" },
    { key: "buy", label: "🌾 Buy Crops" },
    { key: "purchases", label: "🛒 My Purchases" },
    { key: "transport", label: "🚚 Transportation" },
  ];

  const loadListings = async () => {
    setLoading(true);

    try {
      const response = await getMyListings();
      setListings(response.data);
    } catch (err) {
      showToast(extractErrorMessage(err, "Failed to load listings"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "listings") {
      loadListings();
    }
  }, [tab]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      itemName: "",
      category: "",
      pricePerUnit: "",
      unit: "",
      description: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      pricePerUnit: parseFloat(formData.pricePerUnit),
    };

    try {
      if (editingId) {
        await updateListing(editingId, payload);
        showToast("Listing updated successfully", "success");
      } else {
        await createListing(payload);
        showToast("Listing created successfully", "success");
      }

      resetForm();
      loadListings();
    } catch (err) {
      showToast(extractErrorMessage(err, "Failed to save listing"), "error");
    }
  };

  const handleEdit = (listing) => {
    setFormData({
      itemName: listing.itemName,
      category: listing.category,
      pricePerUnit: listing.pricePerUnit,
      unit: listing.unit,
      description: listing.description || "",
    });

    setEditingId(listing.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await deleteListing(deleteId);
      showToast("Listing deleted successfully", "success");
      setDeleteId(null);
      loadListings();
    } catch (err) {
      showToast(extractErrorMessage(err, "Failed to delete listing"), "error");
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-3xl shadow-xl text-white p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold">
            Vendor Dashboard
          </h1><br></br>

          <p className="mt-3 text-green-100 text-lg">
            Manage your listings, purchase crops, and organize transportation.
          </p>
        </div>

        {/* Dashboard Card */}
        <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">

          {/* Tabs */}
          <div className="flex gap-3 overflow-x-auto p-5 border-b bg-gray-50">

            {tabs.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                  tab === item.key
                    ? "bg-green-600 text-white shadow-lg scale-105"
                    : "bg-white border text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                }`}
              >
                {item.label}
              </button>
            ))}

          </div>

          <div className="p-6 md:p-8">

            {tab === "listings" && (
              <>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">

                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      My Vendor Listings
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Create, update and manage your agricultural products.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      showForm ? resetForm() : setShowForm(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition"
                  >
                    {showForm ? "✖ Close Form" : "+ Add New Listing"}
                  </button>

                </div>

                {showForm && (
                  <form
                    onSubmit={handleSubmit}
                    className="bg-green-50 border rounded-2xl p-6 mb-8 shadow"
                  >

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <input
                        name="itemName"
                        placeholder="Item Name"
                        value={formData.itemName}
                        onChange={handleChange}
                        className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />

                      <input
                        name="category"
                        placeholder="Category"
                        value={formData.category}
                        onChange={handleChange}
                        className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />

                      <input
                        type="number"
                        step="0.01"
                        name="pricePerUnit"
                        placeholder="Price Per Unit"
                        value={formData.pricePerUnit}
                        onChange={handleChange}
                        className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />

                      <input
                        name="unit"
                        placeholder="Unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />

                    </div>

                    <textarea
                      rows="3"
                      name="description"
                      placeholder="Description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full mt-4 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <div className="flex gap-3 mt-6">

                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
                      >
                        {editingId ? "Update Listing" : "Create Listing"}
                      </button>

                      <button
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl font-semibold"
                      >
                        Cancel
                      </button>

                    </div>

                  </form>
                )}

                {loading ? (
                  <Spinner />
                ) : listings.length === 0 ? (
                  <EmptyState
                    icon="🏪"
                    message="No listings available. Create your first listing."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="bg-white border rounded-2xl shadow-lg hover:shadow-xl transition p-5"
                      >

                        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {listing.category}
                        </span>

                        <h3 className="text-xl font-bold mt-3">
                          {listing.itemName}
                        </h3>

                        <p className="text-green-700 font-bold mt-2">
                          ₹{listing.pricePerUnit} / {listing.unit}
                        </p>

                        {listing.description && (
                          <p className="text-gray-600 mt-3">
                            {listing.description}
                          </p>
                        )}

                        <div className="flex gap-3 mt-5">

                          <button
                            onClick={() => handleEdit(listing)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => setDeleteId(listing.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                          >
                            Delete
                          </button>

                        </div>

                      </div>
                    ))}

                  </div>
                )}
              </>
            )}

            {tab === "buy" && <BrowseCrops />}
            {tab === "purchases" && <VendorPurchases />}
            {tab === "transport" && <VendorTransportation />}

          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Listing"
        message="Are you sure you want to delete this listing?"
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

export default VendorDashboard;