import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";

const AppNavbar = () => {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    if (darkTheme) {
      document.body.style.backgroundColor = "#181818";
      document.body.style.color = "#fff";
      document.body.classList.add("dark-theme");
    } else {
      document.body.style.backgroundColor = "#fff";
      document.body.style.color = "#000";
      document.body.classList.remove("dark-theme");
    }
  }, [darkTheme]);

  if (!token) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleThemeToggle = () => {
    setDarkTheme((prev) => !prev);
  };

  // Só mostra a aba Administração para Admin e Manager
  const showAdmin = user && (user.role === "Admin" || user.role === "Manager");

  return (
    <Navbar
      bg={darkTheme ? "dark" : "light"}
      variant={darkTheme ? "dark" : "light"}
      expand="lg"
      className="mb-4"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          IOS Sinistros
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/attendances">
              Atendimentos
            </Nav.Link>
            <Nav.Link as={Link} to="/settingList">
              Campos
            </Nav.Link>
            <NavDropdown title="Cadastros" id="nav-dropdown-cadastros">
              <NavDropdown.Item as={Link} to="/insureds">
                Segurados
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/shipping_companies">
                Transportadoras
              </NavDropdown.Item>
            </NavDropdown>
            {showAdmin && (
              <NavDropdown title="Administração" id="nav-dropdown-admin">
                <NavDropdown.Item as={Link} to="/userPanel">
                  Usuários
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/auditLog">
                  Logs
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
          <Button
            variant={darkTheme ? "secondary" : "dark"}
            onClick={handleThemeToggle}
            className="me-2"
          >
            {darkTheme ? "Tema Claro" : "Tema Escuro"}
          </Button>
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

// Adicione este CSS global (por exemplo, em index.css ou App.css):
/*
.dark-theme table {
  background-color: #232323 !important;
  color: #fff !important;
}
.dark-theme th, .dark-theme td {
  background-color: #232323 !important;
  color: #fff !important;
  border-color: #444 !important;
}
.dark-theme thead {
  background-color: #181818 !important;
}
*/
