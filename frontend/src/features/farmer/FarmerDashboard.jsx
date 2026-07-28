import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import CropForm from "./CropForm";
import CropCard from "./CropCard";
import MySales from "./MySales";
import BrowseCrops from "../trader/BrowseCrops";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errorHandler";
import {
  getMyCrops,
  createCrop,
  updateCrop,
  deleteCrop,
} from "../../api/cropApi";

function FarmerDashboard() {
  const [tab, setTab] = useState("crops");
  const [crops, setCrops] = useState([]);
  const [editingCrop, setEditingCrop] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const { showToast } = useToast();

  const loadCrops = async () => {
    setLoading(true);

    try {
      const response = await getMyCrops();
      setCrops(response.data);
    } catch (err) {
      showToast(extractErrorMessage(err, "Failed to load crops"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "crops") {
      loadCrops();
    }
  }, [tab]);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editingCrop) {
        await updateCrop(editingCrop.id, data);
        showToast("Crop updated successfully", "success");
      } else {
        await createCrop(data);
        showToast("Crop created successfully", "success");
      }

      setShowForm(false);
      setEditingCrop(null);
      loadCrops();
    } catch (err) {
      showToast(extractErrorMessage(err, "Failed to save crop"), "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCrop(deleteId);
      showToast("Crop deleted successfully", "success");
      setDeleteId(null);
      loadCrops();
    } catch (err) {
      showToast(extractErrorMessage(err, "Failed to delete crop"), "error");
      setDeleteId(null);
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-3xl shadow-xl text-white p-8 mb-8 text-center">

          <h1 className="text-4xl font-bold">
            Farmer Dashboard
          </h1><br></br>

          <p className="mt-3 text-green-100 text-lg">
            Welcome back! Manage your crops, track your sales and explore the marketplace.
          </p>

        </div>

        {/* Dashboard Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border">

          {/* Navigation */}
          <div className="flex gap-3 overflow-x-auto p-5 border-b bg-gray-50">

            <button
              onClick={() => setTab("crops")}
              className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                tab === "crops"
                  ? "bg-green-600 text-white shadow-lg scale-105"
                  : "bg-white border text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              🌾 My Crops
            </button>

            <button
              onClick={() => setTab("sales")}
              className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                tab === "sales"
                  ? "bg-green-600 text-white shadow-lg scale-105"
                  : "bg-white border text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              💰 My Sales
            </button>

            <button
              onClick={() => setTab("browse")}
              className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                tab === "browse"
                  ? "bg-green-600 text-white shadow-lg scale-105"
                  : "bg-white border text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              🌱 Browse Crops
            </button>

          </div>

          {/* Content */}
          <div className="p-6 md:p-8">

            {tab === "crops" && (
              <>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">

                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      My Crops
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Add, edit and manage all your crop listings.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowForm(!showForm);
                      setEditingCrop(null);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
                  >
                    {showForm ? "✖ Close Form" : "+ Add New Crop"}
                  </button>

                </div>

                {showForm && (
                  <div className="bg-green-50 rounded-2xl p-6 mb-8 border">
                    <CropForm
                      initialData={editingCrop}
                      onSubmit={handleCreateOrUpdate}
                      onCancel={() => {
                        setShowForm(false);
                        setEditingCrop(null);
                      }}
                    />
                  </div>
                )}

                {loading ? (
                  <Spinner />
                ) : crops.length === 0 ? (
                  <EmptyState
                    message="No crops found. Start by adding your first crop."
                    icon="🌱"
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {crops.map((crop) => (
                      <CropCard
                        key={crop.id}
                        crop={crop}
                        onEdit={handleEdit}
                        onDelete={(id) => setDeleteId(id)}
                        onImageUploaded={loadCrops}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {tab === "sales" && <MySales />}

            {tab === "browse" && <BrowseCrops />}

          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Crop"
        message="Are you sure you want to delete this crop? This action cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

export default FarmerDashboard;