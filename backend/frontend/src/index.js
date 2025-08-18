import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import Container from "react-bootstrap/Container";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <SocketProvider>
    <Router>
      <AuthProvider>
        <Container>
          <App />
        </Container>
      </AuthProvider>
    </Router>
  </SocketProvider>
);
