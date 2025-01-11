import React, { useEffect, useState } from "react";
import axios from "axios";
import imageCompression from 'browser-image-compression';
import { User, Mail, Phone, Calendar, Camera, Loader2, Save, X } from "lucide-react";

function ManageProfile() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [oldImageId, setOldImageId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const imgbbAPIKey = "1c0006ef8fc002b4e7177e2181f7d4fc";

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUserId(parsedUser.user_id);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `https://rent-ease-api-beta.vercel.app/api/user/${userId}`
          );
          setUserData(response.data);
          setFormData(response.data);
          setOldImageId(response.data.user_img_id);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true
    };

    setIsUploading(true);

    try {
      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append("image", compressedFile);

      if (oldImageId) {
        await axios.delete(`https://api.imgbb.com/1/delete/${oldImageId}?key=${imgbbAPIKey}`);
      }

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
        formData
      );
      setUploadedImageUrl(response.data.data.url);
      setOldImageId(response.data.data.id);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (isUploading) return;

    try {
      setLoading(true);
      const updateData = {
        ...formData,
        user_imgurl: uploadedImageUrl || userData.user_imgurl,
        user_img_id: uploadedImageUrl ? oldImageId : userData.user_img_id,
      };
      
      await axios.put(
        `https://rent-ease-api-beta.vercel.app/api/user/${userId}`,
        updateData
      );
      
      const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const updatedUser = { ...savedUser, ...updateData };
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      
      window.location.reload();
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 font-medium">User data not found!</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 px-6 py-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={uploadedImageUrl || userData.user_imgurl || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Camera className="w-5 h-5 text-gray-600" />
                </label>
              )}
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">
              {userData.user_name}
            </h1>
            <p className="text-purple-200">{userData.user_email}</p>
          </div>
        </div>

        <div className="px-6 py-8">
          {!isEditing ? (
            <div className="space-y-6">
              <InfoField icon={User} label="Name" value={userData.user_name} />
              <InfoField icon={Mail} label="Email" value={userData.user_email} />
              <InfoField icon={Phone} label="Phone" value={userData.user_numberphone} />
              <InfoField
                icon={Calendar}
                label="Birthday"
                value={new Date(userData.user_birthday).toLocaleDateString()}
              />

              <button
                onClick={() => setIsEditing(true)}
                className="w-full mt-6 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 font-medium"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <FormField
                icon={User}
                label="Name"
                name="user_name"
                value={formData.user_name}
                onChange={handleInputChange}
              />
              <FormField
                icon={Mail}
                label="Email"
                name="user_email"
                type="email"
                value={formData.user_email}
                onChange={handleInputChange}
              />
              <FormField
                icon={Phone}
                label="Phone"
                name="user_numberphone"
                value={formData.user_numberphone}
                onChange={handleInputChange}
              />
              <FormField
                icon={Calendar}
                label="Birthday"
                name="user_birthday"
                type="date"
                value={formData.user_birthday.split("T")[0]}
                onChange={handleInputChange}
              />

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isUploading}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const InfoField = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
    <Icon className="w-5 h-5 text-gray-500" />
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-900">{value}</p>
    </div>
  </div>
);

const FormField = ({ icon: Icon, label, name, type = "text", value, onChange }) => (
  <div className="space-y-2">
    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
    />
  </div>
);

export default ManageProfile;