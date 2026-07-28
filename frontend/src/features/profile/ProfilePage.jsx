import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import {
  getMyProfile,
  updateProfile,
  updateLocation,
} from "../../api/userApi";

function ProfilePage() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });

  const [locationData, setLocationData] = useState({
    latitude: "",
    longitude: "",
  });

  const [message, setMessage] = useState("");

  const loadProfile = async () => {
    const response = await getMyProfile();

    setProfile(response.data);

    setFormData({
      fullName: response.data.fullName,
      phoneNumber: response.data.phoneNumber || "",
      address: response.data.address || "",
    });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(formData);
      setMessage("✅ Profile updated successfully.");
      loadProfile();
    } catch {
      setMessage("❌ Failed to update profile.");
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateLocation({
        latitude: parseFloat(locationData.latitude),
        longitude: parseFloat(locationData.longitude),
      });

      setMessage("📍 Location updated successfully.");
    } catch {
      setMessage("❌ Failed to update location.");
    }
  };

  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocationData({
        latitude: position.coords.latitude.toFixed(6),
        longitude: position.coords.longitude.toFixed(6),
      });
    });
  };

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-50 via-white to-emerald-100">
          <h2 className="text-xl font-semibold text-green-700">
            Loading Profile...
          </h2>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">

        {/* Header */}

        <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-3xl shadow-xl text-white p-8 mb-8">

          <div className="flex flex-col md:flex-row items-center gap-6">

            <div className="w-24 h-24 rounded-full bg-white text-green-700 flex items-center justify-center text-4xl font-bold shadow-lg">
              {profile.fullName?.charAt(0).toUpperCase()}
            </div>

            <div>

              <h1 className="text-4xl font-bold">
                {profile.fullName}
              </h1>

              <p className="text-green-100 mt-2">
                {profile.email}
              </p>

              <span className="inline-block mt-3 bg-white/20 px-4 py-1 rounded-full text-sm font-semibold">
                {profile.role}
              </span>

            </div>

          </div>

        </div>

        {message && (
          <div className="bg-green-100 border border-green-300 text-green-800 rounded-xl p-4 mb-6">
            {message}
          </div>
        )}

        {/* Profile Information */}

        <div className="bg-white rounded-3xl shadow-2xl border p-8 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Personal Information
          </h2>

          <form onSubmit={handleProfileSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fullName: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Phone Number
                </label>

                <input
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

            </div>

            <div className="mt-5">

              <label className="block mb-2 font-medium text-gray-700">
                Email
              </label>

              <input
                value={profile.email}
                readOnly
                className="w-full border rounded-xl p-3 bg-gray-100 cursor-not-allowed"
              />

            </div>

            <div className="mt-5">

              <label className="block mb-2 font-medium text-gray-700">
                Address
              </label>

              <textarea
                rows="3"
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            <button
              type="submit"
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-lg font-semibold transition"
            >
              Save Profile
            </button>

          </form>

        </div>

        {/* Location */}

        {(profile.role === "FARMER" ||
          profile.role === "TRADER") && (

          <div className="bg-white rounded-3xl shadow-2xl border p-8">

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Location Information
            </h2>

            <form onSubmit={handleLocationSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <input
                  value={locationData.latitude}
                  onChange={(e) =>
                    setLocationData({
                      ...locationData,
                      latitude: e.target.value,
                    })
                  }
                  placeholder="Latitude"
                  className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

                <input
                  value={locationData.longitude}
                  onChange={(e) =>
                    setLocationData({
                      ...locationData,
                      longitude: e.target.value,
                    })
                  }
                  placeholder="Longitude"
                  className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              <div className="flex flex-wrap gap-4 mt-6">

                <button
                  type="button"
                  onClick={useCurrentLocation}
                  className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl font-semibold transition"
                >
                  📍 Use Current Location
                </button>

                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
                >
                  Save Location
                </button>

              </div>

            </form>

          </div>

        )}

      </div>
    </div>
  );
}

export default ProfilePage;