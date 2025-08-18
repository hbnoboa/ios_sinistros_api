import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import DriverIndex from "./driver/index";

const ShippingCompanyShow = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    fetch(`/api/shipping_companies/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCompany(data.data?.shippingCompany));
  }, [id]);

  if (!company) return <div>Carregando...</div>;

  return (
    <div>
      <Card style={{ maxWidth: 400, margin: "40px auto" }}>
        <Card.Body>
          <Card.Title>{company.company_name}</Card.Title>
          <Card.Text>
            <strong>CNPJ/CPF:</strong> {company.cnpj_cpf}
            <br />
            <strong>RNTRC:</strong> {company.rntrc}
          </Card.Text>
          <Button
            as={Link}
            to={`/shipping_companies/${id}/edit`}
            variant="warning"
            className="me-2"
          >
            Editar
          </Button>
          <Button as={Link} to="/shipping_companies" variant="secondary">
            Voltar
          </Button>
        </Card.Body>
      </Card>
      <DriverIndex shippingCompanyId={id} />
    </div>
  );
};

export default ShippingCompanyShow;
