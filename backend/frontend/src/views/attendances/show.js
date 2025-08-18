import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Table, Tab, Tabs } from "react-bootstrap";
import RegulatorsTabs from "./regulators/show";
import VictimsShowTabs from "./victims/show";
import InteractionsIndex from "./interactions/index";

// List of all attachment fields
const attachmentFields = [
  "averbacao_filename",
  "aviso_sinistro_filename",
  "antt_filename",
  "conhecimento_transporte_filename",
  "nota_fiscal_filename",
  "manifesto_filename",
  "documento_motorista_filename",
  "documento_veiculo_filename",
  "ficha_cadastro_interno_filename",
  "contrato_transporte_filename",
  "boletim_ocorrencia_filename",
  "boletim_saque_filename",
  "comprovante_entrega_filename",
  "ticket_pesagem_filename",
  "comprovante_venda_salvados_filename",
  "declaracao_nao_recebimento_filename",
  "declaracao_motorista_filename",
  "discos_cronotacografo_filename",
  "consulta_gr_filename",
  "ordem_carregamento_filename",
  "relatorio_rastreamento_filename",
  "nota_debito_filename",
  "comprovante_pagamento_nd_filename",
  "comprovante_pagamento_seguradora_filename",
];

const formatDecimal = (value) =>
  value && value.$numberDecimal ? value.$numberDecimal : value || "";

const formatDate = (value) =>
  value ? new Date(value).toLocaleString("pt-BR") : "";

const AttachmentsShow = ({ attendance }) => (
  <Table bordered size="sm">
    <tbody>
      {attachmentFields.map((field) => (
        <tr key={field}>
          <th>
            {field.replace(/_/g, " ").replace("filename", "").toUpperCase()}
          </th>
          <td>
            {attendance[field] && attendance[field].length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {attendance[field].map((file, idx) => (
                  <li key={idx}>
                    <a
                      href={`/uploads/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              "Nenhum"
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const AttendanceShow = () => {
  const { id } = useParams();
  const [attendance, setAttendance] = useState(null);
  const [regulators, setRegulators] = useState([]);
  const [victims, setVictims] = useState([]);

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    fetch(`/api/attendances/${id}`, { headers })
      .then((res) => res.json())
      .then((data) => setAttendance(data.data?.attendance));

    fetch(`/api/attendances/${id}/regulators`, {
      headers,
    })
      .then((res) => res.json())
      .then((data) => setRegulators(data.regulators || []));

    fetch(`/api/attendances/${id}/victims`, {
      headers,
    })
      .then((res) => res.json())
      .then((data) => setVictims(data.victims || []));
  }, [id]);

  if (!attendance) return <div>Carregando...</div>;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h2>Atendimento {attendance._id}</h2>
      <Tabs defaultActiveKey="atendimento" className="mb-3">
        <Tab eventKey="atendimento" title="Atendimento">
          <Table bordered size="sm">
            <tbody>
              <tr>
                <th>Data do Atendimento</th>
                <td>{formatDate(attendance.attendance_date)}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{attendance.event_status}</td>
              </tr>
              <tr>
                <th>Seguradora</th>
                <td>{attendance.insured_company}</td>
              </tr>
              <tr>
                <th>Nome do Segurado</th>
                <td>{attendance.insured_name}</td>
              </tr>
              <tr>
                <th>Nome da Filial</th>
                <td>{attendance.branch_name}</td>
              </tr>
              <tr>
                <th>Fast Track</th>
                <td>{attendance.fast_track ? "Sim" : "Não"}</td>
              </tr>
              <tr>
                <th>Nome do Comunicante</th>
                <td>{attendance.comunicator_name}</td>
              </tr>
              <tr>
                <th>Contato do Comunicante</th>
                <td>{attendance.communicator_contact}</td>
              </tr>
              <tr>
                <th>Tipo de Operação</th>
                <td>{attendance.operation_type}</td>
              </tr>
              <tr>
                <th>Número do Manifesto</th>
                <td>{attendance.manifest_number}</td>
              </tr>
              <tr>
                <th>Número do Conhecimento de Transporte</th>
                <td>{attendance.transport_knowledge_number}</td>
              </tr>
              <tr>
                <th>Número da Nota Fiscal</th>
                <td>{attendance.invoice_number}</td>
              </tr>
              <tr>
                <th>Reguladora</th>
                <td>{attendance.regulatory}</td>
              </tr>
              <tr>
                <th>Natureza do Evento</th>
                <td>{attendance.event_nature}</td>
              </tr>
              <tr>
                <th>Tipo de Natureza do Evento</th>
                <td>{attendance.event_nature_type}</td>
              </tr>
              <tr>
                <th>Carga Transportada</th>
                <td>{attendance.transported_load}</td>
              </tr>
              <tr>
                <th>Valor da Carga</th>
                <td>{formatDecimal(attendance.load_value)}</td>
              </tr>
              <tr>
                <th>Valor Segurado</th>
                <td>{formatDecimal(attendance.insurance_value)}</td>
              </tr>
              <tr>
                <th>Estimativa de Prejuízo</th>
                <td>{formatDecimal(attendance.loss_estimation)}</td>
              </tr>
              <tr>
                <th>Valor Recuperado</th>
                <td>{formatDecimal(attendance.saved_value)}</td>
              </tr>
              <tr>
                <th>Transportadora</th>
                <td>{attendance.shipping_company}</td>
              </tr>
              <tr>
                <th>CNPJ Transportadora</th>
                <td>{attendance.shipping_company_cnpj}</td>
              </tr>
              <tr>
                <th>Nome do Motorista</th>
                <td>{attendance.driver_name}</td>
              </tr>
              <tr>
                <th>Placas</th>
                <td>
                  {Array.isArray(attendance.plates)
                    ? attendance.plates.join(", ")
                    : attendance.plates}
                </td>
              </tr>
              <tr>
                <th>Origem - Estado</th>
                <td>{attendance.origin_state}</td>
              </tr>
              <tr>
                <th>Origem - Cidade</th>
                <td>{attendance.origin_city}</td>
              </tr>
              <tr>
                <th>Destino - Estado</th>
                <td>{attendance.destination_state}</td>
              </tr>
              <tr>
                <th>Destino - Cidade</th>
                <td>{attendance.destination_city}</td>
              </tr>
              <tr>
                <th>Estado do Evento</th>
                <td>{attendance.event_state}</td>
              </tr>
              <tr>
                <th>Cidade do Evento</th>
                <td>{attendance.event_city}</td>
              </tr>
              <tr>
                <th>Endereço do Evento</th>
                <td>{attendance.event_address}</td>
              </tr>
              <tr>
                <th>KM</th>
                <td>{attendance.n_km}</td>
              </tr>
              <tr>
                <th>Latitude</th>
                <td>{attendance.latitude}</td>
              </tr>
              <tr>
                <th>Longitude</th>
                <td>{attendance.longitude}</td>
              </tr>
              <tr>
                <th>Data/Hora do Acidente</th>
                <td>{formatDate(attendance.date_time_accident)}</td>
              </tr>
              <tr>
                <th>Registro</th>
                <td>{attendance.register}</td>
              </tr>
              <tr>
                <th>Sinistro</th>
                <td>{attendance.insurance_claim}</td>
              </tr>
              <tr>
                <th>Descrição</th>
                <td>{attendance.description}</td>
              </tr>
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="reguladores" title="Reguladores">
          <RegulatorsTabs regulators={regulators} />
        </Tab>
        <Tab eventKey="victims" title="Vítimas">
          <VictimsShowTabs victims={victims} />
        </Tab>
        <Tab eventKey="anexos" title="Anexos">
          <AttachmentsShow attendance={attendance} />
        </Tab>
      </Tabs>

      {/* Interações abaixo das tabs */}
      <div className="mt-4">
        <h4>Interações</h4>
        <InteractionsIndex attendanceId={id} />
      </div>

      <Button
        as={Link}
        to={`/attendances/${id}/edit`}
        variant="warning"
        className="me-2"
      >
        Editar
      </Button>
      <Button as={Link} to="/attendances" variant="secondary">
        Voltar
      </Button>
    </div>
  );
};

export default AttendanceShow;
