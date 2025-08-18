import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const PolicyNew = () => {
  const { insuredId } = useParams();
  const [form, setForm] = useState({
    company_name: "",
    cnpj: "",
    policy_name: "",
    policy_file_metadata: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    let fileName = "";
    if (file) {
      const data = new FormData();
      data.append("file", file);

      // Upload file to GridFS
      const uploadRes = await fetch("/api/image/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data,
      });
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        fileName = uploadData.filename;
      } else {
        setMessage("Erro ao enviar arquivo.");
        return;
      }
    }

    // Save policy with file reference
    const res = await fetch(`/api/insureds/${insuredId}/policies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ...form, policy_file_metadata: fileName }),
    });

    if (res.ok) {
      navigate(`/insureds/${insuredId}`);
    } else {
      setMessage("Erro ao salvar.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Nova Apólice</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Empresa</Form.Label>
          <Form.Control
            type="text"
            name="company_name"
            value={form.company_name}
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
          <Form.Label>Nome da Apólice</Form.Label>
          <Form.Control
            type="text"
            name="policy_name"
            value={form.policy_name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Arquivo/Metadados</Form.Label>
          <Form.Control
            type="file"
            name="policy_file_metadata"
            onChange={handleFileChange}
            accept="*"
          />
        </Form.Group>
        <Button type="submit">Cadastrar</Button>
        <span className="ms-3 text-danger">{message}</span>
      </Form>
    </div>
  );
};

export default PolicyNew;
