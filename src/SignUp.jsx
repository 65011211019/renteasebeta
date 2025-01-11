import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, Calendar } from "lucide-react";

// InputField Component
const InputField = ({ icon: Icon, type, name, placeholder, autoComplete, className, onChange, value }) => {
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
        className={`w-full bg-gray-800 text-white rounded-lg px-10 py-3 
        border border-gray-700 focus:border-blue-500 focus:ring-2 
        focus:ring-blue-500 focus:ring-opacity-20 transition-all
        placeholder:text-gray-500 ${className || ''}`}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    birthday: "",
    phoneNumber: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || 
        !formData.confirmPassword || !formData.birthday || !formData.phoneNumber) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return false;
    }

    if (formData.password.length < 6) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("รูปแบบอีเมลไม่ถูกต้อง");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก");
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      // ตรวจสอบว่ามีอีเมลซ้ำหรือไม่
      const checkEmailResponse = await fetch(
        "https://rent-ease-api-beta.vercel.app/api/users"
      );
      const existingUsers = await checkEmailResponse.json();
      const emailExists = existingUsers.some(
        (user) => user.user_email === formData.email
      );

      if (emailExists) {
        setError("อีเมลนี้ถูกใช้งานแล้ว");
        setLoading(false);
        return;
      }

      const user = {
        user_name: formData.username,
        user_email: formData.email,
        user_pass: formData.password,
        user_imgurl: "https://i.ibb.co/NCzHn39/user.png",
        user_birthday: formData.birthday,
        user_numberphone: formData.phoneNumber,
        user_verified: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const response = await fetch("https://rent-ease-api-beta.vercel.app/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(`การสมัครสมาชิกล้มเหลว: ${response.statusText}`);
      }

      const newUser = await response.json();
      alert(`สร้างบัญชีสำเร็จ! ยินดีต้อนรับ ${newUser.user_name}!`);
      navigate("/login");

    } catch (err) {
      console.error("Sign-up Failed:", err.message);
      setError(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">สร้างบัญชีใหม่</h2>
          <p className="text-gray-400">กรอกข้อมูลด้านล่างเพื่อเริ่มต้นใช้งาน</p>
        </div>

        <div className="space-y-4">
          <InputField
            icon={User}
            type="text"
            name="username"
            placeholder="ชื่อผู้ใช้"
            autoComplete="username"
            onChange={handleChange}
            value={formData.username}
          />

          <InputField
            icon={Mail}
            type="email"
            name="email"
            placeholder="อีเมล"
            autoComplete="email"
            onChange={handleChange}
            value={formData.email}
          />

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

          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <User size={18} />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="ยืนยันรหัสผ่าน"
              className="w-full bg-gray-800 text-white rounded-lg px-10 py-3 
              border border-gray-700 focus:border-blue-500 focus:ring-2 
              focus:ring-blue-500 focus:ring-opacity-20 transition-all
              placeholder:text-gray-500"
              onChange={handleChange}
              value={formData.confirmPassword}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <InputField
            icon={Calendar}
            type="date"
            name="birthday"
            className="text-gray-400"
            onChange={handleChange}
            value={formData.birthday}
          />

          <InputField
            icon={Phone}
            type="tel"
            name="phoneNumber"
            placeholder="เบอร์โทรศัพท์"
            autoComplete="tel"
            onChange={handleChange}
            value={formData.phoneNumber}
          />
        </div>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 
          hover:from-blue-600 hover:to-blue-700 text-white font-semibold 
          rounded-lg py-3 transition-all transform hover:scale-[1.02] 
          active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
              <span>กำลังดำเนินการ...</span>
            </div>
          ) : (
            "สมัครสมาชิก"
          )}
        </button>

        {error && (
          <div className="text-red-500 text-center bg-red-100/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        <p className="text-center text-gray-400">
          มีบัญชีอยู่แล้ว?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:text-blue-400 font-medium"
          >
            เข้าสู่ระบบ
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;