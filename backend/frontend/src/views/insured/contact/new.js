import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const ContactNew = () => {
  const { insuredId } = useParams();
  const [form, setForm] = useState({
    name: "",
    role: "",
    number: "",
    email: "",
    field: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`/api/insureds/${insuredId}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      navigate(`/insureds/${insuredId}`);
    } else {
      setMessage("Erro ao salvar.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Novo Contato</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Cargo</Form.Label>
          <Form.Control
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Telefone</Form.Label>
          <Form.Control
            type="text"
            name="number"
            value={form.number}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Área</Form.Label>
          <Form.Control
            type="text"
            name="field"
            value={form.field}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type="submit">Cadastrar</Button>
        <span className="ms-3 text-danger">{message}</span>
      </Form>
    </div>
  );
};

export default ContactNew;
