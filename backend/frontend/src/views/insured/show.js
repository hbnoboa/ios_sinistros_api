import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import BranchIndex from "./branch/index";
import ContactIndex from "./contact/index";
import PolicyIndex from "./policy/index";

const InsuredShow = () => {
  const { id } = useParams();
  const [insured, setInsured] = useState(null);

  useEffect(() => {
    fetch(`/api/insureds/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setInsured(data.data?.insured));
  }, [id]);

  if (!insured) return <div>Carregando...</div>;

  return (
    <div>
      <Card style={{ maxWidth: 500, margin: "40px auto" }}>
        <Card.Body>
          <Card.Title>{insured.company_name}</Card.Title>
          <Card.Text>
            <strong>Nome Fantasia:</strong> {insured.fantasy_name}
            <br />
            <strong>CNPJ:</strong> {insured.cnpj}
            <br />
            <strong>Estado:</strong> {insured.state}
            <br />
            <strong>Cidade:</strong> {insured.city}
            <br />
            <strong>Endereço:</strong> {insured.address}
            <br />
            <strong>Área de Atuação:</strong> {insured.business_field}
          </Card.Text>
          <Button
            as={Link}
            to={`/insureds/${id}/edit`}
            variant="warning"
            className="me-2"
          >
            Editar
          </Button>
          <Button as={Link} to="/insureds" variant="secondary">
            Voltar
          </Button>
        </Card.Body>
      </Card>
      <BranchIndex insuredId={id} />
      <ContactIndex insuredId={id} />
      <PolicyIndex insuredId={id} />
    </div>
  );
};

export default InsuredShow;
