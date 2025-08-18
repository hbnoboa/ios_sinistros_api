import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const DriverNew = () => {
  const { shippingCompanyId } = useParams();
  const [form, setForm] = useState({
    name: "",
    cpf: "",
    contact: "",
    plates: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const payload = {
      ...form,
      plates: form.plates.split(",").map((p) => p.trim()),
    };
    const res = await fetch(
      `http://192.168.15.67:5000/api/shipping_companies/${shippingCompanyId}/drivers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      }
    );
    if (res.ok) {
      navigate(`/shipping_companies/${shippingCompanyId}`);
    } else {
      setMessage("Erro ao salvar.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Novo Motorista</h2>
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
          <Form.Label>CPF</Form.Label>
          <Form.Control
            type="text"
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contato</Form.Label>
          <Form.Control
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Placas (separadas por vírgula)</Form.Label>
          <Form.Control
            type="text"
            name="plates"
            value={form.plates}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type="submit">Cadastrar</Button>
        <span className="ms-3 text-danger">{message}</span>
      </Form>
    </div>
  );
};

export default DriverNew;
