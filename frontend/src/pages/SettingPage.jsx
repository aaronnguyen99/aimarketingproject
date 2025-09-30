import { useState, useEffect } from "react";
import UpgradeButton from "../components/UpgradeButton";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";

export default function SettingsPage() {
  const [user, setUser] = useState({ name: "", email: "", phone: "" ,organization:"",address:"",tier:""});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
 const {logout}=useAuth();
   const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/info');
        setUser(response.data.user);
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  },[]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
        const response = await api.put('/auth/update',{name: user.name, phone: user.phone,organization:user.organization,address:user.address});
      setUser(response.data);           
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 5000); 
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
    }
    
  };

    const handleLogout = async () => {
    try {
      const response =await api.post("/auth/logout"); 
      logout(); 
      navigate("/auth"); 
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };



  return (

    <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto mb-8 ">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Update your information</p>
        </div>
      <div className="max-w-xl mx-auto">

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
{loading ? (
  <div className="flex justify-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-b-4 border-gray-300"></div>
  </div>
) : (undefined)}
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
    <UpgradeButton/>
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
      className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition inline-block"
    >
      Update Profile
    </button>

  </form>
          <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 w-full mt-4"
    >
      Logout
    </button>
</div>
</div>
  );
}
