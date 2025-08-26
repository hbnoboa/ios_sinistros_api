import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const InsuredNew = () => {
  const [form, setForm] = useState({
    company_name: "",
    fantasy_name: "",
    cnpj: "",
    state: "",
    city: "",
    address: "",
    business_field: "",
  });
  const [message, setMessage] = useState("");
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
    )
      .then((res) => res.json())
      .then((data) => setEstados(data));
  }, []);

  useEffect(() => {
    if (form.state) {
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.state}/municipios`
      )
        .then((res) => res.json())
        .then((data) => setCidades(data));
    } else {
      setCidades([]);
    }
  }, [form.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "state") setForm((prev) => ({ ...prev, city: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/insureds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      navigate("/insureds");
    } else {
      setMessage("Erro ao salvar.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Novo Segurado</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Razão Social</Form.Label>
          <Form.Control
            type="text"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Nome Fantasia</Form.Label>
          <Form.Control
            type="text"
            name="fantasy_name"
            value={form.fantasy_name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>CNPJ</Form.Label>
          <Form.Control
            type="text"
            name="cnpj"
            value={form.cnpj}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Estado</Form.Label>
          <Form.Select
            name="state"
            value={form.state}
            onChange={handleChange}
            required
          >
            <option value="">Selecione...</option>
            {estados.map((estado) => (
              <option key={estado.sigla} value={estado.sigla}>
                {estado.nome} ({estado.sigla})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Cidade</Form.Label>
          <Form.Select
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            disabled={!form.state}
          >
            <option value="">Selecione...</option>
            {cidades.map((cidade) => (
              <option key={cidade.id} value={cidade.nome}>
                {cidade.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Endereço</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Área de Atuação</Form.Label>
          <Form.Control
            type="text"
            name="business_field"
            value={form.business_field}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type="submit">Cadastrar</Button>
        <span className="ms-3 text-danger">{message}</span>
      </Form>
    </div>
  );
};

export default InsuredNew;
