import { Link } from "react-router-dom";
import { useState } from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { IoWifiSharp } from "react-icons/io5";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import "./LandingPage.css";

const howItworks = [
  {
    id: 0,
    image: "/img1.jpg",
    icon: <IoChatbubbleEllipsesOutline />,
    title: "AI Symptoms Checker",
    details:
      "Get instant health advice by describing your symptoms in your local language. Our AI-powered system will analyze your input and provide you with relevant information.",
  },
  {
    id: 1,
    image: "/img2.jpg",
    icon: <LiaUserFriendsSolid />,
    title: "Connect with Doctors",
    details:
      "Connect with licensed healthcare professionals who can provide personalized advice and treatment options based on your symptoms.",
  },
  {
    id: 2,
    image: "/img3.jpg",
    icon: <IoWifiSharp />,
    title: "Offline Access",
    details:
      "Access our platform even without an internet connection. You can download health resources and advice for offline use, ensuring you have the information you need when you need it.",
  },
];

function LandingPage() {
  const [openNav, setOpenNav] = useState(false);

  return (
    <div className="main-landing-page">
      <nav>
        <div className="nav-container">
          <strong>
            <em>CareLens</em>{" "}
          </strong>

          <div className="nav-left">
            <ul>
              <li>
                {" "}
                <a href="how_it_works">How it works</a>{" "}
              </li>
              <li>
                <a href="">Features</a>
              </li>
              <li>
                <a href="">Pricing</a>
              </li>
              <li>
                <a href="">Contact</a>
              </li>
            </ul>
            <Link to="/auth" className="auth-btn">
              Sign Up
            </Link>

            <div className="nav_icons">
              <button onClick={() => setOpenNav(!openNav)}>
                {" "}
                {openNav ? <IoMdClose /> : <IoMdMenu />}
              </button>
            </div>
          </div>
        </div>

        {openNav && (
          <div className="mobile-nav">
            <ul>
              <li>
                <a href="how_it_works">How it works</a>{" "}
              </li>
              <li>
                <a href="">Features</a>
              </li>
              <li>
                <a href="">Pricing</a>
              </li>
              <li>
                <a href="">Contact</a>
              </li>

              <Link to="/auth" className="auth-btn">
                Sign Up
              </Link>
            </ul>
          </div>
        )}
      </nav>
      {/* HEADER */}
      <header>
        <div className="header-overlay"></div>
        <div className="header_container">
          <h1>
            Get Doctor Advice in Your <br /> Language,Anytime!
          </h1>

          <p>Ai-powered health help for rural Nigeria-no internect needed </p>
          <Link to="/auth" className="auth-btn">
            Sign Up (Free)
          </Link>
        </div>
      </header>

      {/* HOW IT WORKS SECTION */}
      <section className="how_it_works" id="how_it_works">
        <div className="how_container">
          <h2>How CareLens works</h2>
          <p className="p">
            CareLens is a platform that connects you with healthcare
            professionals in your local language, anytime, anywhere.
          </p>
          <div className="how_cards">
            {howItworks.map((item) => (
              <div className="how_card" key={item.id}>
                <div className="how_img">
                  <img src={item.image} alt={item.title} />
                </div>
                <span className="how_icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHECKING */}
      <section className="checking">
        <div className="checking_container">
          <h2>AI Symptom Checker</h2>
          <p>
            Get instant health insights with our AI-powered symptom checker.
            Simply describe your symptoms in your local language, and our AI
            will analyze them to provide you with relevant information and
            advice.
          </p>
          <Link to="/auth" className="check_btn">
            Start Chat
          </Link>
        </div>

        <div className="checking_container">
          <h2>Connect with a Doctor</h2>
          <p>
            Connect with licensed healthcare professionals who can provide
            personalized advice and treatment options based on your symptoms.
            Our platform ensures you receive the care you need, when you need
            it.
          </p>
          <Link to="/auth" className="check_btn">
            Connect with a Doctor now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
