import React from "react";
import { Table, Tabs, Tab } from "react-bootstrap";

const formatDate = (value) =>
  value ? new Date(value).toLocaleString("pt-BR") : "";

const RegulatorsTabs = ({ regulators }) => {
  if (!regulators || regulators.length === 0) {
    return <div>Nenhum regulador cadastrado.</div>;
  }

  return (
    <Tabs defaultActiveKey={regulators[0]._id || "0"} className="mb-3">
      {regulators.map((reg, idx) => (
        <Tab
          eventKey={reg._id || String(idx)}
          title={`Regulador ${idx + 1}`}
          key={reg._id || idx}
        >
          <Table bordered size="sm" className="mt-3">
            <tbody>
              <tr>
                <th style={{ width: 250 }}>#</th>
                <td>{idx + 1}</td>
              </tr>
              <tr>
                <th>Data Autorização</th>
                <td>{formatDate(reg.authDate)}</td>
              </tr>
              <tr>
                <th>Contratante</th>
                <td>{reg.contractor}</td>
              </tr>
              <tr>
                <th>Recuperado/Localizado</th>
                <td>
                  {reg.recovered === true || reg.recovered === "true"
                    ? "Sim"
                    : reg.recovered === false || reg.recovered === "false"
                    ? "Não"
                    : ""}
                </td>
              </tr>
              <tr>
                <th>Previsão Chegada Prestador</th>
                <td>{formatDate(reg.estimatedArrivalDate)}</td>
              </tr>
              <tr>
                <th>Data Chegada Prestador</th>
                <td>{formatDate(reg.arrivalDate)}</td>
              </tr>
              <tr>
                <th>Data Finalização</th>
                <td>{formatDate(reg.finalDate)}</td>
              </tr>
              <tr>
                <th>Nome Prestador</th>
                <td>{reg.serviceProvider}</td>
              </tr>
              <tr>
                <th>Local</th>
                <td>{reg.place}</td>
              </tr>
              <tr>
                <th>KM</th>
                <td>{reg.km}</td>
              </tr>
              <tr>
                <th>Horas Paradas</th>
                <td>{reg.standingTime}</td>
              </tr>
              <tr>
                <th>Anexos</th>
                <td>
                  {Array.isArray(reg.Attachments_filename) &&
                  reg.Attachments_filename.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {reg.Attachments_filename.map((f, i) =>
                        typeof f === "string" ? (
                          <li key={i}>
                            <a
                              href={`/uploads/${f}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {f}
                            </a>
                          </li>
                        ) : (
                          <li key={i}>{f.name}</li>
                        )
                      )}
                    </ul>
                  ) : (
                    "Nenhum"
                  )}
                </td>
              </tr>
              <tr>
                <th>Observações</th>
                <td>{reg.observation}</td>
              </tr>
            </tbody>
          </Table>
        </Tab>
      ))}
    </Tabs>
  );
};

export default RegulatorsTabs;
