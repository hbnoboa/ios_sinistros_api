import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Image,
} from "react-bootstrap";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Entrando...");
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token);
        setMessage("Login realizado!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage(data.error || "Erro ao entrar.");
      }
    } catch {
      setMessage("Erro ao entrar.");
    }
  };

  return (
    <section
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Container>
        <Card style={{ borderRadius: "1rem" }}>
          <Card.Body className="p-5">
            <Row className="d-flex justify-content-center align-items-center">
              <Col md={9} lg={6} xl={5} className="mb-4 mb-lg-0 text-center">
                <Image
                  src="/integrary-logo.png"
                  alt="integrary-logo"
                  fluid
                  style={{ maxHeight: 500 }}
                />
              </Col>
              <Col md={8} lg={6} xl={4} className="offset-xl-1">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="formEmail">
                    <Form.Label>E-Mail</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      size="lg"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      size="lg"
                      required
                    />
                  </Form.Group>
                  <div className="text-center text-lg-end mt-4 pt-2">
                    <Button variant="secondary" type="submit" size="lg">
                      Login
                    </Button>
                  </div>
                  <div className="text-center mt-3">
                    <span
                      style={{
                        color: message === "Login realizado!" ? "green" : "red",
                      }}
                    >
                      {message}
                    </span>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
};

export default Login;
