import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import UpgradeButton from "../components/UpgradeButton";

export default function SettingsPage() {
const { token } = useAuth();
const backendUrl=import.meta.env.VITE_BACKEND_URL
  const [user, setUser] = useState({ name: "", email: "", phone: "" ,organization:"",address:""});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(backendUrl+'/auth/info',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        setUser(response.data);
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
        const response = await axios.put(backendUrl+'/auth/update',
        {name: user.name, phone: user.phone,organization:user.organization,address:user.address},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);           // update state with new info
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 5000); // hide after 5s
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
    }
    
  };



  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!user) return null;

  return (
<div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
  <h1 className="text-3xl font-bold mb-6 text-gray-800">Settings</h1>

  {/* Success/Error Messages */}
  {success && (
    <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-200 rounded">
      {success}
    </div>
  )}
  {error && (
    <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-200 rounded">
      {error}
    </div>
  )}

  <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
    {/* Name */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
      <input
        type="text"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    {/* Email */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">Email (read-only)</label>
      <input
        type="email"
        value={user.email}
        readOnly
        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
      />
    </div>

    {/* Tier */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">Tier (read-only)</label>
      <input
        type="text"
        value={
          user.tier === "free" && user.freeTrialEnds
            ? `FREE (ends ${new Date(user.freeTrialEnds).toLocaleDateString()})`
            : user.tier.toUpperCase()
        }
        readOnly
        className={`w-full p-3 border rounded-lg ${
          user.tier === "free"
            ? "bg-yellow-100 border-yellow-300"
                    : user.tier === "pro"
        ? "bg-green-100 border-green-300 text-green-800"
        : "bg-gray-100 border-gray-300 text-gray-700"
        } cursor-not-allowed`}
      />
 {user.tier !== "pro" && (
  <div className="mt-4 p-4 border rounded bg-yellow-50">
    <p className="mb-2 font-medium text-gray-700">
      Upgrade to Pro
    </p>
    <UpgradeButton token={token} />
  </div>
)}

    </div>

    {/* Phone */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
      <input
        type="text"
        value={user.phone || ""}
        onChange={(e) => setUser({ ...user, phone: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    {/* Organization */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">Organization</label>
      <input
        type="text"
        value={user.organization || ""}
        onChange={(e) => setUser({ ...user, organization: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    {/* Address */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
      <input
        type="text"
        value={user.address || ""}
        onChange={(e) => setUser({ ...user, address: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    >
      Update Profile
    </button>
  </form>
</div>
  );
}
