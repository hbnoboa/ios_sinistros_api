import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

const AuditLogTable = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/api/audit-logs")
      .then((res) => res.json())
      .then(setLogs);
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h2>Auditoria de Alterações</h2>
      <Table bordered>
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Ação</th>
            <th>Campo</th>
            <th>Valor Antigo</th>
            <th>Valor Novo</th>
            <th>Data/Hora</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx}>
              <td>{log.user}</td>
              <td>{log.action}</td>
              <td>{log.field}</td>
              <td>{JSON.stringify(log.oldValue)}</td>
              <td>{JSON.stringify(log.newValue)}</td>
              <td>{new Date(log.date).toLocaleString()}</td>
              <td>{log.ip}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AuditLogTable;
