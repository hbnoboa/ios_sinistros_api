import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ContactIndex = ({ insuredId }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetch(`/api/insureds/${insuredId}/contacts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setContacts(data.contacts || []));
  }, [insuredId]);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h3>Contatos</h3>
      <Button
        as={Link}
        to={`/insureds/${insuredId}/contacts/new`}
        className="mb-3"
      >
        Novo Contato
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cargo</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact._id}>
              <td>{contact.name}</td>
              <td>{contact.role}</td>
              <td>{contact.number}</td>
              <td>{contact.email}</td>
              <td>
                <Button
                  as={Link}
                  to={`/insureds/${insuredId}/contacts/${contact._id}/edit`}
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

export default ContactIndex;
