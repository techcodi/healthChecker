import supabase from "../supabase.js";
import { useState } from "react";
import { useSymptomsMutation } from "../hooks/useSymptoms";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { FcApproval } from "react-icons/fc";
import { IoWarning } from "react-icons/io5";
import { BsSendFill } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import "./Form.css";
import PrimarySpinner from "../ui/PrimarySpinner.jsx";
import Redirect from "./Redirect.jsx";
import Spinner from "../ui/Spinner.jsx";
function Form() {
  const { user, loading } = useAuth();
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm();

  if (!user) return <Redirect />;
  if (loading) return <Spinner />;
  // Voice recoder

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  function handleVoiceInput() {
    if (!recognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }
    recognition.lang = "en-US";
    recognition.start();
    setIsRecording(true);

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setValue("symptoms", transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setError("Speech recognition failed. Please try again.");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  }

  const mutation = useSymptomsMutation();
  const onSubmit = async (data) => {
    setResponse(null);
    setError("");

    try {
      setIsLoading(true);
      const result = await mutation.mutateAsync({
        symptoms: data.symptoms,
        language: data.language,
      });

      setIsLoading(false);
      setResponse(result);
      setNearbyPlaces([]);

      // Save to database

      // await supabse.from("symptom_checks").insert({
      //   symptoms: data.symptoms,
      //   result: result,
      //   user_id: user.id,
      // });
      let latitude = null;
      let longitude = null;

      const getLocation = () =>
        new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser."));
          } else {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
              },
              (error) => reject(new Error("Unable to retrieve location."))
            );
          }
        });

      try {
        const location = await getLocation();
        latitude = location.latitude;
        longitude = location.longitude;

        const radius = 0.05; // roughly 2km bounding box
        const viewbox = `${longitude - radius},${latitude + radius},${
          longitude + radius
        },${latitude - radius}`;

        const responseApi = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=pharmacy&limit=5&addressdetails=1&bounded=1&viewbox=${viewbox}`
        );
        const nearby = await responseApi.json();
        setNearbyPlaces(nearby);
      } catch (locationErr) {
        setError(
          "Could not get your location. Your check will still be saved."
        );
      }

      const { error: insertError } = await supabase
        .from("symptom_checks")
        .insert({
          symptoms: data.symptoms,
          result: result,
          user_id: user.id,
          latitude,
          longitude,
        });
      if (insertError) {
        setError("Failed to save result: " + insertError.message);
        return;
      }

      reset();
    } catch (error) {
      setError(error.message || "Something went wrong.");
    }
  };
  return (
    <div>
      <div className="check_your_symptoms">
        <h2>AI Symptom Checker</h2>
        <p>
          Describe your symptoms in detail for an AI-powered preliminary
          assessment. Remember, this is not a replacement for professional
          medical advice.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <strong> Describe your symptoms:</strong>
          <div className="language_select">
            <label htmlFor="language">Select Language:</label>
            <select
              {...register("language", { required: true })}
              className="select_language"
            >
              <option value="">Select language</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Chinese">Chinese</option>
              <option value="Yoruba">Yoruba</option>
              <option value="Hausa">Hausa</option>
              <option value="Igbo">Igbo</option>
              <option value="Pidgin">Pidgin</option>
            </select>
          </div>
          <textarea
            placeholder="Example: I've had a persistent headache for the last 3 days, concentrated on the right side of my head. The pain is throbbing and gets worse when I bend over.
"
            {...register("symptoms", { required: true })}
            rows={8}
            columns={10}
          />
          <div className="voice-input-container">
            <button type="button" onClick={handleVoiceInput}>
              {isRecording ? "Listening..." : <FaMicrophone />}
            </button>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Checking..." : <BsSendFill />}
            </button>
          </div>
        </form>
      </div>

      <div>
        {isLoading && <PrimarySpinner />}

        {response && (
          <>
            <h2 style={{ margin: "2rem 0" }}>Assessment Results</h2>
            <div className="response-box">
              <div className="response_warning">
                <span style={{ padding: " 10px  0" }}>
                  <IoWarning />
                </span>
                <div>
                  <h5>Important Notice</h5>
                  <small>
                    This is an AI-generated assessment and should not be
                    considered as a final diagnosis. Please consult with a
                    healthcare professional for proper medical evaluation and
                    treatment.
                  </small>
                </div>
              </div>
              {response
                .split(/\d+\.\s/) // Split by numbered sections like "1. ", "2. "
                .filter(Boolean)
                .map((section, index) => {
                  const titles = [
                    "Explanation",
                    "Suggested Medications",
                    "Important Warnings or Advice",
                  ];
                  const lines = section.trim().split("\n").filter(Boolean);

                  return (
                    <div key={index} style={{ marginBottom: "1.5rem" }}>
                      <h4>{titles[index] || `Section ${index + 1}`}</h4>
                      <ul>
                        {lines.map((line, i) => (
                          <li key={i}>
                            <span>
                              <FcApproval />
                              {line.replace(/^[-\d.]*\s*/, "").trim()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
            </div>

            <div
              className="ai-disclaimer"
              style={{
                background: "#fff8e1",
                padding: "1rem",
                marginTop: "1rem",
                border: "1px solid #fdd835",
                borderRadius: "8px",
                fontSize: "0.85rem",
              }}
            >
              ⚠️ <strong>Disclaimer:</strong> This advice was generated by AI.
              It is not a substitute for medical expertise. Please consult with
              a licensed medical professional for accurate diagnosis and
              treatment.
            </div>

            {nearbyPlaces.length > 0 && (
              <div className="nearby-places">
                <h3>Nearby Pharmacies</h3>
                <ul>
                  {nearbyPlaces.map((place, index) => (
                    <li key={index} style={{ marginBottom: "1rem" }}>
                      <strong>{place.display_name.split(",")[0]}</strong>
                      <p style={{ fontSize: "0.9rem", color: "#555" }}>
                        {place.display_name}
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: "0.85rem", color: "#007bff" }}
                      >
                        View on Google Maps
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default Form;
