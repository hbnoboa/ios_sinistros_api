import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const DriverIndex = ({ shippingCompanyId }) => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetch(
      `http://192.168.15.67:5000/api/shipping_companies/${shippingCompanyId}/drivers`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setDrivers(data.drivers || []));
  }, [shippingCompanyId]);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h3>Motoristas</h3>
      <Button
        as={Link}
        to={`/shipping_companies/${shippingCompanyId}/drivers/new`}
        className="mb-3"
      >
        Novo Motorista
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Contato</th>
            <th>Placas</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver._id}>
              <td>
                <Link
                  to={`/shipping_companies/${shippingCompanyId}/drivers/${driver._id}`}
                >
                  {driver.name}
                </Link>
              </td>
              <td>{driver.cpf}</td>
              <td>{driver.contact}</td>
              <td>{driver.plates?.join(", ")}</td>
              <td>
                <Button
                  as={Link}
                  to={`/shipping_companies/${shippingCompanyId}/drivers/${driver._id}/edit`}
                  size="sm"
                  variant="warning"
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  as={Link}
                  to={`/shipping_companies/${shippingCompanyId}/drivers/${driver._id}`}
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
                      await fetch(
                        `http://192.168.15.67:5000/api/shippingCompanies/${shippingCompanyId}/drivers/${driver._id}`,
                        {
                          method: "DELETE",
                        }
                      );
                      setDrivers((prev) =>
                        prev.filter((d) => d._id !== driver._id)
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

export default DriverIndex;
