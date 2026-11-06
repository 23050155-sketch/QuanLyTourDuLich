import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        DU LỊCH VIỆT NAM
      </Link>

      <div className="navbar-links">
        <Link to="/">Trang chủ</Link>

        {loading ? (
          <span>Đang kiểm tra...</span>
        ) : user ? (
          <>
            <span className="navbar-user">
              Xin chào, {user.full_name}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register" className="register-btn">
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;