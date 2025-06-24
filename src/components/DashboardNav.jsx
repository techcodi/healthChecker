import { useAuth } from "../context/AuthContext.jsx";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import "./DashboardNav.css";
import { useState } from "react";
function DashboardNav({ onToggleSidebar, sideBarOpen }) {
  const { user, signOut } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  return (
    <div className="dashboard-nav">
      <div style={{ display: "flex", alignItems: "center" }}>
        <button className="sidebar-toggle-btn" onClick={onToggleSidebar}>
          {sideBarOpen ? <IoMdClose /> : <IoMdMenu />}
        </button>

        <h3 className="dashboard-logo">CareLens</h3>
      </div>

      <p>AI Telemedicine Dashboard</p>

      <div className="dashboard-name">
        <span
          style={{ cursor: "pointer", fontSize: "2rem", color: "#007c91" }}
          className="user-profile"
          onClick={() => setShowProfile(!showProfile)}
        >
          <CgProfile />
        </span>
        {showProfile && (
          <div className="user-name-card">
            <span>
              {user.user_metadata?.name ||
                user.user_metadata?.display_name ||
                user.email}{" "}
            </span>

            <span onClick={() => signOut()}>Sign out</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardNav;
