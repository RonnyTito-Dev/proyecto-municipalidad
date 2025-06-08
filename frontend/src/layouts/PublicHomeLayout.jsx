import React, { useState } from "react";
import CreateRequestPage from "../pages/Public/CreateRequestPage";
import LoginPage from "../pages/Public/LoginPage";
import TrackRequestPage from "../pages/Public/TrackRequestPage";

const PublicHomeLayout = () => {
  const [currentPage, setCurrentPage] = useState("tracking");

  const renderPage = () => {
    switch (currentPage) {
      case "create":
        return <CreateRequestPage />;
      case "login":
        return <LoginPage />;
      case "tracking":
      default:
        return <TrackRequestPage />;
    }
  };

  return (
    <div className="public-layout">
      <div className="overlay">
        <nav className="nav-menu">
          <button
            className={`nav-button ${currentPage === "tracking" ? "active" : ""}`}
            onClick={() => setCurrentPage("tracking")}
          >
            Rastrear Solicitud
          </button>
          <button
            className={`nav-button ${currentPage === "create" ? "active" : ""}`}
            onClick={() => setCurrentPage("create")}
          >
            Crear Solicitud
          </button>
          <button
            className={`nav-button ${currentPage === "login" ? "active" : ""}`}
            onClick={() => setCurrentPage("login")}
          >
            Login
          </button>
        </nav>

        <main className="content-area">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default PublicHomeLayout;
