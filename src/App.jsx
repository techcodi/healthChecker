import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthForm from "./pages/AuthForm";
import AuthProvider from "./context/AuthContext";
import "./App.css";
import Verification from "./pages/Verification";
import Application from "./pages/Application";
import LandingPage from "./pages/LandingPage";
import CheckSymptoms from "./pages/CheckSymptoms";
import HealthRecoords from "./pages/HealthRecoords";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staletime: 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route
              path="/verification-code-to-mail"
              element={<Verification />}
            />
            <Route path="/app" element={<Application />}>
              <Route index element={<CheckSymptoms />} />
              <Route path="symptom-checker" element={<CheckSymptoms />} />
              <Route path="health-records" element={<HealthRecoords />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
