import React from "react";
import { Table, Tabs, Tab } from "react-bootstrap";

const VictimsShowTabs = ({ victims }) => {
  if (!victims || victims.length === 0) {
    return <div>Nenhuma vítima cadastrada.</div>;
  }

  return (
    <Tabs defaultActiveKey="0" className="mb-3">
      {victims.map((victim, idx) => (
        <Tab
          eventKey={String(idx)}
          title={`Vítima ${idx + 1}`}
          key={victim._id || idx}
        >
          <Table bordered size="sm" className="mt-3">
            <tbody>
              <tr>
                <th style={{ width: 250 }}>#</th>
                <td>{idx + 1}</td>
              </tr>
              <tr>
                <th>Vítima?</th>
                <td>{victim.victim ? "Sim" : "Não"}</td>
              </tr>
              <tr>
                <th>Vítima Fatal?</th>
                <td>{victim.fatal_victim ? "Sim" : "Não"}</td>
              </tr>
              <tr>
                <th>Motorista Vítima</th>
                <td>{victim.driver_victim}</td>
              </tr>
              <tr>
                <th>Terceiro Vítima</th>
                <td>{victim.third_party_victim}</td>
              </tr>
              <tr>
                <th>Motorista Vítima Fatal</th>
                <td>{victim.fatal_driver_victim}</td>
              </tr>
              <tr>
                <th>Terceiro Vítima Fatal</th>
                <td>{victim.fatal_third_party_victim}</td>
              </tr>
              <tr>
                <th>Culpabilidade</th>
                <td>{victim.culpability ? "Sim" : "Não"}</td>
              </tr>
            </tbody>
          </Table>
        </Tab>
      ))}
    </Tabs>
  );
};

export default VictimsShowTabs;
