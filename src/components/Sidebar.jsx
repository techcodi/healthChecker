import { Link } from "react-router-dom";
import { FaStethoscope } from "react-icons/fa6";
import { RiHealthBookLine } from "react-icons/ri";
import { FaQuestionCircle } from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";
function Sidebar() {
  return (
    <div>
      <ul>
        <li>
          <FaStethoscope />
          <Link to="/app/symptom-checker">Check Symotoms</Link>
        </li>
        <li>
          <RiHealthBookLine />
          <Link to="/app/health-records">Health Records</Link>
        </li>
        <li>
          <FaQuestionCircle />
          <Link to="#">FAQs</Link>
        </li>
        <li>
          <MdOutlineSupportAgent />
          <Link to="#">Support</Link>
        </li>
      </ul>

      <div className="sidebar-contact">
        <div className="sidebar-contact-container">
          <h3>Need assistance</h3>
          <p>Our medical team is available 24/7 for emergency consultations.</p>
          <button>Contact Doctor</button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
