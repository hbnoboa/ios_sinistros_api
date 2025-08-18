import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const ShippingCompanyEdit = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    company_name: "",
    cnpj_cpf: "",
    rntrc: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/shipping_companies/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.shippingCompany) setForm(data.data?.shippingCompany);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`/api/shipping_companies/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      navigate("/shipping_companies");
    } else {
      setMessage("Erro ao salvar.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Editar Transportadora</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>CNPJ/CPF</Form.Label>
          <Form.Control
            type="text"
            name="cnpj_cpf"
            value={form.cnpj_cpf}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>RNTRC</Form.Label>
          <Form.Control
            type="text"
            name="rntrc"
            value={form.rntrc}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type="submit">Salvar</Button>
        <span className="ms-3 text-danger">{message}</span>
      </Form>
    </div>
  );
};

export default ShippingCompanyEdit;
