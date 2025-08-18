import React from "react";
import { Form, Button, Tabs, Tab } from "react-bootstrap";

const RegulatorsNewTabs = ({
  regulators,
  handleRegulatorChange,
  handleRegulatorFileChange,
  addRegulator,
  removeRegulator,
}) => {
  if (!regulators || regulators.length === 0) {
    return (
      <div>
        Nenhum regulador cadastrado.
        <Button
          variant="secondary"
          onClick={addRegulator}
          type="button"
          className="ms-2"
        >
          Adicionar Regulador
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultActiveKey="0" className="mb-3">
      {regulators.map((reg, idx) => (
        <Tab eventKey={String(idx)} title={`Regulador ${idx + 1}`} key={idx}>
          <div
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Data Autorização</Form.Label>
              <Form.Control
                type="datetime-local"
                name="authDate"
                value={reg.authDate || ""}
                onChange={(e) => handleRegulatorChange(idx, e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contratante</Form.Label>
              <Form.Control
                type="text"
                name="contractor"
                value={reg.contractor}
                onChange={(e) => handleRegulatorChange(idx, e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Recuperado/Localizado</Form.Label>
              <Form.Select
                name="recovered"
                value={reg.recovered || ""}
                onChange={(e) => handleRegulatorChange(idx, e)}
              >
                <option value="">Selecione...</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Previsão Chegada Prestador</Form.Label>
              <Form.Control
                type="datetime-local"
                name="estimatedArrivalDate"
                value={reg.estimatedArrivalDate || ""}
                onChange={(e) => handleRegulatorChange(idx, e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data Chegada Prestador</Form.Label>
              <Form.Control
                type="datetime-local"
                name="arrivalDate"
                value={reg.arrivalDate || ""}
                onChange={(e) => handleRegulatorChange(idx, e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data Finalização</Form.Label>
              <Form.Control
                type="datetime-local"
                name="finalDate"
                value={reg.finalDate || ""}
                onChange={(e) => handleRegulatorChange(idx, e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nome Prestador</Form.Label>
              <Form.Control
                type="text"
                name="serviceProvider"
                value={reg.serviceProvider}
                onChange={(e) => handleRegulatorChange(idx, e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Local</Form.Label>
              <Form.Control
                type="text"
                name="place"
                value={reg.place || ""}
                onChange={(e) => handleRegulatorChange(idx, e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>KM</Form.Label>
              <Form.Control
                type="number"
                name="km"
                value={reg.km || ""}
                onChange={(e) => handleRegulatorChange(idx, e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Horas Paradas</Form.Label>
              <Form.Control
                type="number"
                name="standingTime"
                value={reg.standingTime || ""}
                onChange={(e) => handleRegulatorChange(idx, e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Anexos (arquivos)</Form.Label>
              <Form.Control
                type="file"
                name="Attachments_filename"
                multiple
                onChange={(e) => handleRegulatorFileChange(idx, e)}
              />
              {reg.Attachments_filename &&
                reg.Attachments_filename.length > 0 && (
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    {Array.from(reg.Attachments_filename)
                      .map((f) => f.name)
                      .join(", ")}
                  </div>
                )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Observações</Form.Label>
              <Form.Control
                type="text"
                name="observation"
                value={reg.observation || ""}
                onChange={(e) => handleRegulatorChange(idx, e)}
              />
            </Form.Group>
            <Button
              variant="danger"
              size="sm"
              onClick={() => removeRegulator(idx)}
              type="button"
            >
              Remover
            </Button>
          </div>
        </Tab>
      ))}
      <Tab eventKey="add" title="+ Adicionar Regulador" disabled />
    </Tabs>
  );
};

export default RegulatorsNewTabs;
