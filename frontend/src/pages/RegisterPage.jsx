import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (form.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    setLoading(true);

    try {
      await register({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        password: form.password,
      });

      navigate("/login", {
        replace: true,
        state: {
          message: "Đăng ký thành công! Vui lòng đăng nhập.",
        },
      });
    } catch (err) {
      const detail = err.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Đăng ký thất bại. Vui lòng kiểm tra thông tin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Đăng ký tài khoản</h1>
        <p>Tạo tài khoản để khám phá và đặt Tour</p>

        <form onSubmit={handleSubmit}>
          <label>Họ và tên</label>
          <input
            name="full_name"
            placeholder="Nhập họ và tên"
            value={form.full_name}
            onChange={handleChange}
            minLength={2}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Nhập email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Số điện thoại</label>
          <input
            name="phone"
            placeholder="Nhập số điện thoại"
            value={form.phone}
            onChange={handleChange}
          />

          <label>Mật khẩu</label>
          <input
            type="password"
            name="password"
            placeholder="Ít nhất 8 ký tự"
            value={form.password}
            onChange={handleChange}
            minLength={8}
            required
          />

          <label>Xác nhận mật khẩu</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="auth-footer">
          Đã có tài khoản?{" "}
          <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;