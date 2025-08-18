import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const InsuredIndex = () => {
  const [insureds, setInsureds] = useState([]);

  useEffect(() => {
    fetch("/api/insureds", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setInsureds(data.insureds || []));
  }, []);

  return (
    <div>
      <h2>Segurados</h2>
      <Button as={Link} to="/insureds/new" className="mb-3">
        Novo Segurado
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Razão Social</th>
            <th>Nome Fantasia</th>
            <th>CNPJ</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {insureds.map((insured) => (
            <tr key={insured._id}>
              <td>
                <Link to={`/insureds/${insured._id}`}>
                  {insured.company_name}
                </Link>
              </td>
              <td>{insured.fantasy_name}</td>
              <td>{insured.cnpj}</td>
              <td>
                <Button
                  as={Link}
                  to={`/insureds/${insured._id}/edit`}
                  size="sm"
                  variant="warning"
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  as={Link}
                  to={`/insureds/${insured._id}`}
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
                      await fetch(`/api/insureds/${insured._id}`, {
                        method: "DELETE",
                      });
                      setInsureds((prev) =>
                        prev.filter((i) => i._id !== insured._id)
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

export default InsuredIndex;
