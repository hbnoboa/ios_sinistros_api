import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const PolicyIndex = ({ insuredId }) => {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    fetch(`/api/insureds/${insuredId}/policies`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPolicies(data.policies || []));
  }, [insuredId]);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h3>Apólices</h3>
      <Button
        as={Link}
        to={`/insureds/${insuredId}/policies/new`}
        className="mb-3"
      >
        Nova Apólice
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Empresa</th>
            <th>CNPJ</th>
            <th>Nome da Apólice</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr key={policy._id}>
              <td>{policy.company_name}</td>
              <td>{policy.cnpj}</td>
              <td>{policy.policy_name}</td>
              <td>
                <Button
                  as={Link}
                  to={`/insureds/${insuredId}/policies/${policy._id}/edit`}
                  size="sm"
                  variant="warning"
                  className="me-2"
                >
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PolicyIndex;
