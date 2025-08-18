import React from "react";
import { Form, Button, Tabs, Tab } from "react-bootstrap";

const VictimsNewTabs = ({
  victims,
  handleVictimChange,
  addVictim,
  removeVictim,
}) => {
  if (!victims || victims.length === 0) {
    return (
      <div>
        Nenhuma vítima cadastrada.
        <Button
          variant="secondary"
          onClick={addVictim}
          type="button"
          className="ms-2"
        >
          Adicionar Vítima
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultActiveKey="0" className="mb-3">
      {victims.map((victim, idx) => (
        <Tab eventKey={String(idx)} title={`Vítima ${idx + 1}`} key={idx}>
          <div
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Vítima?</Form.Label>
              <Form.Check
                type="checkbox"
                name="victim"
                checked={!!victim.victim}
                onChange={(e) =>
                  handleVictimChange(idx, {
                    target: { name: "victim", value: e.target.checked },
                  })
                }
                label="Sim"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vítima Fatal?</Form.Label>
              <Form.Check
                type="checkbox"
                name="fatal_victim"
                checked={!!victim.fatal_victim}
                onChange={(e) =>
                  handleVictimChange(idx, {
                    target: { name: "fatal_victim", value: e.target.checked },
                  })
                }
                label="Sim"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Motorista Vítima</Form.Label>
              <Form.Control
                type="number"
                name="driver_victim"
                value={victim.driver_victim || ""}
                onChange={(e) => handleVictimChange(idx, e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Terceiro Vítima</Form.Label>
              <Form.Control
                type="number"
                name="third_party_victim"
                value={victim.third_party_victim || ""}
                onChange={(e) => handleVictimChange(idx, e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Motorista Vítima Fatal</Form.Label>
              <Form.Control
                type="number"
                name="fatal_driver_victim"
                value={victim.fatal_driver_victim || ""}
                onChange={(e) => handleVictimChange(idx, e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Terceiro Vítima Fatal</Form.Label>
              <Form.Control
                type="number"
                name="fatal_third_party_victim"
                value={victim.fatal_third_party_victim || ""}
                onChange={(e) => handleVictimChange(idx, e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Culpabilidade</Form.Label>
              <Form.Check
                type="checkbox"
                name="culpability"
                checked={!!victim.culpability}
                onChange={(e) =>
                  handleVictimChange(idx, {
                    target: { name: "culpability", value: e.target.checked },
                  })
                }
                label="Sim"
              />
            </Form.Group>
            <Button
              variant="danger"
              size="sm"
              onClick={() => removeVictim(idx)}
              type="button"
            >
              Remover
            </Button>
          </div>
        </Tab>
      ))}
      <Tab eventKey="add" title="+ Adicionar Vítima" disabled />
    </Tabs>
  );
};

export default VictimsNewTabs;
