import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";

const AuditLogPanel = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    fetch("/api/audit-logs", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setLoading(false);
        if (res.status === 403) {
          setForbidden(true);
          return null;
        }
        if (!res.ok) throw new Error("Erro ao buscar logs");
        return res.json();
      })
      .then((data) => {
        if (data) setLogs(data);
      })
      .catch(() => {
        setLoading(false);
        setForbidden(true);
      });
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  if (forbidden) {
    return null;
  }

  return (
    <div>
      <h2>Logs de Auditoria</h2>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Data</th>
            <th>Usuário</th>
            <th>Ação</th>
            <th>Rota</th>
            <th>Campo</th>
            <th>Valor Antigo</th>
            <th>Valor Novo</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{new Date(log.date).toLocaleString("pt-BR")}</td>
              <td>{log.user}</td>
              <td>{log.action}</td>
              <td>{log.route}</td>
              <td>{log.field}</td>
              <td>
                <pre style={{ maxWidth: 200, whiteSpace: "pre-wrap" }}>
                  {log.oldValue ? JSON.stringify(log.oldValue, null, 2) : ""}
                </pre>
              </td>
              <td>
                <pre style={{ maxWidth: 200, whiteSpace: "pre-wrap" }}>
                  {log.newValue ? JSON.stringify(log.newValue, null, 2) : ""}
                </pre>
              </td>
              <td>{log.ip}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {logs.length === 0 && (
        <Alert variant="info">Nenhum log encontrado.</Alert>
      )}
    </div>
  );
};

export default AuditLogPanel;
