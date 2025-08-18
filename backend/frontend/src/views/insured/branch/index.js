import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const BranchIndex = ({ insuredId }) => {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetch(`/api/insureds/${insuredId}/branches`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBranches(data.branches || []));
  }, [insuredId]);

  const handleDelete = async (branchId) => {
    if (!window.confirm("Deseja excluir esta filial?")) return;
    await fetch(`/api/insureds/${insuredId}/branches/${branchId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setBranches((prev) => prev.filter((b) => b._id !== branchId));
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h3>Filiais</h3>
      <Button
        as={Link}
        to={`/insureds/${insuredId}/branches/new`}
        className="mb-3"
      >
        Nova Filial
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Empresa</th>
            <th>CNPJ</th>
            <th>Cidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch) => (
            <tr key={branch._id}>
              <td>{branch.company_name}</td>
              <td>{branch.cnpj}</td>
              <td>{branch.city}</td>
              <td>
                <Button
                  as={Link}
                  to={`/insureds/${insuredId}/branches/${branch._id}/edit`}
                  size="sm"
                  variant="warning"
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(branch._id)}
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

export default BranchIndex;
