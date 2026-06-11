import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./i18n/i18n.jsx";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./auth/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <BrowserRouter>
          <AuthProvider>
              <LanguageProvider>
                  <App />
              </LanguageProvider>
          </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>
);
