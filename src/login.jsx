import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, User } from "lucide-react";

// เพิ่ม InputField Component
const InputField = ({ icon: Icon, type, name, placeholder, autoComplete }) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Icon size={18} />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-gray-800 text-white rounded-lg px-10 py-3 
        border border-gray-700 focus:border-blue-500 focus:ring-2 
        focus:ring-blue-500 focus:ring-opacity-20 transition-all
        placeholder:text-gray-500"
      />
    </div>
  );
};

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://rent-ease-api-beta.vercel.app/api/users",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`การเข้าสู่ระบบล้มเหลว: ${response.statusText}`);
      }

      const users = await response.json();
      const user = users.find(
        (u) => u.user_email === formData.email && u.user_pass === formData.password
      );

      if (user) {
        if (typeof onLogin === "function") {
          onLogin(user);
        }
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert(`ยินดีต้อนรับ ${user.user_name}!`);
        navigate("/");
        window.location.reload();
      } else {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (err) {
      console.error("Login Failed:", err.message);
      setError(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">เข้าสู่ระบบ</h2>
          <p className="text-gray-400">ยินดีต้อนรับกลับ! กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
        </div>

        <div className="space-y-4">
          {/* อัปเดต InputField สำหรับอีเมล */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              name="email"
              placeholder="อีเมล"
              autoComplete="email"
              className="w-full bg-gray-800 text-white rounded-lg px-10 py-3 
              border border-gray-700 focus:border-blue-500 focus:ring-2 
              focus:ring-blue-500 focus:ring-opacity-20 transition-all
              placeholder:text-gray-500"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <User size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="รหัสผ่าน"
              className="w-full bg-gray-800 text-white rounded-lg px-10 py-3 
              border border-gray-700 focus:border-blue-500 focus:ring-2 
              focus:ring-blue-500 focus:ring-opacity-20 transition-all
              placeholder:text-gray-500"
              onChange={handleChange}
              value={formData.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 
          hover:from-blue-600 hover:to-blue-700 text-white font-semibold 
          rounded-lg py-3 transition-all transform hover:scale-[1.02] 
          active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
              <span>กำลังเข้าสู่ระบบ...</span>
            </div>
          ) : (
            "เข้าสู่ระบบ"
          )}
        </button>

        {error && (
          <div className="text-red-500 text-center bg-red-100/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-center text-gray-400">
            ยังไม่มีบัญชี?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-500 hover:text-blue-400 font-medium"
            >
              สมัครสมาชิก
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;