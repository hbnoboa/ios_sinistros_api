import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ShippingCompanyIndex = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetch("/api/shipping_companies", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCompanies(data.shippingCompanies || []));
  }, []);

  return (
    <div>
      <h2>Transportadoras</h2>
      <Button as={Link} to="/shipping_companies/new" className="mb-3">
        Nova Transportadora
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CNPJ/CPF</th>
            <th>RNTRC</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company._id}>
              <td>
                <Link to={`/shipping_companies/${company._id}`}>
                  {company.company_name}
                </Link>
              </td>
              <td>{company.cnpj_cpf}</td>
              <td>{company.rntrc}</td>
              <td>
                <Button
                  as={Link}
                  to={`/shipping_companies/${company._id}/edit`}
                  size="sm"
                  variant="warning"
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  as={Link}
                  to={`/shipping_companies/${company._id}`}
                  size="sm"
                  variant="info"
                  className="me-2"
                >
                  Visualizar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Deseja realmente excluir este atendimento?"
                      )
                    ) {
                      await fetch(`/api/shippingCompanies/${company.id}`, {
                        method: "DELETE",
                      });
                      setCompanies((prev) =>
                        prev.filter((d) => d._id !== company._id)
                      );
                    }
                  }}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ShippingCompanyIndex;
