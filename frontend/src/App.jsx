import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TourDetailPage from "./pages/TourDetailPage";
import MyBookingsPage from "./pages/MyBookingsPage";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tours/:id" element={<TourDetailPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
      </Routes>
    </>
  );
}

export default App;