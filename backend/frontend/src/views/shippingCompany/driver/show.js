import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const DriverEdit = () => {
  const { shippingCompanyId, id } = useParams();
  const [form, setForm] = useState({
    name: "",
    cpf: "",
    contact: "",
    plates: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/shipping_companies/${shippingCompanyId}/drivers/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.driver)
          setForm({
            ...data.data.driver,
            plates: Array.isArray(data.data?.driver.plates)
              ? data.data.driver.plates.join(", ")
              : "",
          });
      });
  }, [shippingCompanyId, id]);

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
      `/api/shipping_companies/${shippingCompanyId}/drivers/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      <h2>Editar Motorista</h2>
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
        <Button type="submit">Salvar</Button>
        <span className="ms-3 text-danger">{message}</span>
      </Form>
    </div>
  );
};

export default DriverEdit;
