import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Redirect from "../components/Redirect.jsx";
import Spinner from "../ui/Spinner.jsx";
import DashboardNav from "../components/DashboardNav.jsx";
import Sidebar from "../components/Sidebar.jsx";
import "./Application.css";
import { useState } from "react";
function Application() {
  const { user, loading } = useAuth();
  const [sideBarOpen, setSideBarOpen] = useState(false);

  if (loading) return <Spinner />;
  if (!user) return <Redirect />;

  return (
    <div className="dashboard">
      <div className="dashboard-nav">
        <DashboardNav
          onToggleSidebar={() => setSideBarOpen((open) => !open)}
          sideBarOpen={sideBarOpen}
        />
      </div>

      <div className="dashboard-main">
        {sideBarOpen && (
          <div className={`sidebar_dashbaord${sideBarOpen ? "" : " closed"}`}>
            <Sidebar />
          </div>
        )}
        <div className="outlets">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Application;
