import { useNavigate } from "react-router-dom";
import "./Redirect.css";
function Redirect() {
  const navigate = useNavigate();
  return (
    <div className="redirect">
      <img src="/4o4.png" alt="404image" />
      <p> Please log in to access this application. </p>
      <button onClick={() => navigate("/")}>Go back</button>{" "}
    </div>
  );
}

export default Redirect;
