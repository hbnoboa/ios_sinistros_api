import React, { useState, useEffect } from "react";
import { Form, Button, Tab, Tabs } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import RegulatorsEditTabs from "./regulators/edit";
import VictimsEditTabs from "./victims/edit";
import Select from "react-select";

const initialState = {
  insured_company: "",
  insured_name: "",
  fast_track: false,
  event_status: "PENDENTE DE DOC",
  comunicator_name: "",
  communicator_contact: "",
  attendance_date: "",
  operation_type: "",
  manifest_number: "",
  transport_knowledge_number: "",
  invoice_number: "",
  regulatory: "",
  event_nature: "",
  event_nature_type: "",
  transported_load: "",
  load_value: "",
  insurance_value: "",
  loss_estimation: "",
  saved_value: "",
  shipping_company: "",
  shipping_company_cnpj: "",
  driver_name: "",
  plates: "",
  origin_state: "",
  origin_city: "",
  destination_state: "",
  destination_city: "",
  event_state: "",
  event_city: "",
  event_address: "",
  n_km: "",
  latitude: "",
  longitude: "",
  date_time_accident: "",
  register: "",
  insurance_claim: "",
  description: "",
};

const initialRegulator = {
  authDate: "",
  contractor: "",
  recovered: "",
  estimatedArrivalDate: "",
  arrivalDate: "",
  finalDate: "",
  serviceProvider: "",
  place: "",
  km: "",
  standingTime: "",
  Attachments_filename: [],
  observation: "",
};

const initialVictim = {
  name: "",
  cpf: "",
  rg: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  description: "",
  Attachments_filename: [],
};

// List of all attachment fields (declare só uma vez!)
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

const AttendanceEdit = () => {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [insureds, setInsureds] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [regulators, setRegulators] = useState([initialRegulator]);
  const [victims, setVictims] = useState([initialVictim]);
  const [attachments, setAttachments] = useState({});
  const [shippingCompanies, setShippingCompanies] = useState([]);
  const [drivers, setDrivers] = useState([]);
  // eslint-disable-next-line
  const [selectedDriver, setSelectedDriver] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Buscar seguradoras e clientes ao carregar o componente
  useEffect(() => {
    fetch("/api/insureds", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setInsureds(data.insureds || []));
  }, []);

  useEffect(() => {
    fetch(`/api/attendances/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.attendance) {
          setForm({ ...initialState, ...data.data.attendance });
          const att = {};
          attachmentFields.forEach((field) => {
            att[field] = data.data.attendance[field] || [];
          });
          setAttachments(att);
        }
      });

    fetch(`/api/attendances/${id}/regulators`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRegulators(
          Array.isArray(data.regulators) && data.regulators.length > 0
            ? data.regulators.map((reg) => ({
                ...initialRegulator,
                ...reg,
                Attachments_filename: reg.Attachments_filename || [],
              }))
            : [{ ...initialRegulator }]
        );
      });

    fetch(`/api/attendances/${id}/victims`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setVictims(
          Array.isArray(data.victims) && data.victims.length > 0
            ? data.victims.map((vic) => ({
                ...initialVictim,
                ...vic,
                Attachments_filename: vic.Attachments_filename || [],
              }))
            : [{ ...initialVictim }]
        );
      });
  }, [id]);

  useEffect(() => {
    if (form.insured_company) {
      const insured = insureds.find(
        (i) => i.company_name === form.insured_company
      );
      if (insured && insured._id) {
        fetch(`/api/insureds/${insured._id}/branches`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setBranches(data.data?.branches || data.branches || []);
          });
      } else {
        setBranches([]);
      }
    } else {
      setBranches([]);
    }
  }, [form.insured_company, insureds]);

  useEffect(() => {
    if (form.insured_company) {
      const insured = insureds.find(
        (i) => i.company_name === form.insured_company
      );
      if (insured && insured._id) {
        fetch(`/api/insureds/${insured._id}/contacts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setContacts(data.data?.contacts || data.contacts || []);
          });
      } else {
        setContacts([]);
      }
    } else {
      setContacts([]);
    }
  }, [form.insured_company, insureds]);

  useEffect(() => {
    fetch("/api/shipping_companies", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setShippingCompanies(data.shippingCompanies || []));
  }, []);

  useEffect(() => {
    if (form.shipping_company) {
      const company = shippingCompanies.find(
        (c) => c.company_name === form.shipping_company
      );
      if (company && company._id) {
        fetch(`/api/shipping_companies/${company._id}/drivers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then((data) => setDrivers(data.drivers || []));
      } else {
        setDrivers([]);
      }
      setForm((prev) => ({
        ...prev,
        driver_name: "",
        plates: "",
      }));
      setSelectedDriver(null);
    } else {
      setDrivers([]);
      setForm((prev) => ({
        ...prev,
        driver_name: "",
        plates: "",
      }));
      setSelectedDriver(null);
    }
  }, [form.shipping_company, shippingCompanies]);

  // Atualiza placas ao selecionar motorista
  useEffect(() => {
    if (form.driver_name && drivers.length > 0) {
      const driver = drivers.find((d) => d.name === form.driver_name);
      setSelectedDriver(driver || null);
      setForm((prev) => ({
        ...prev,
        plates: driver && driver.plates ? driver.plates.join(", ") : "",
      }));
    }
    // eslint-disable-next-line
  }, [form.driver_name, drivers]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAttachmentFileChange = (field, e) => {
    setAttachments((prev) => ({
      ...prev,
      [field]: Array.from(e.target.files),
    }));
  };

  // Remove file from attachments
  const handleRemoveAttachmentFile = (field, idx) => {
    setAttachments((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }));
  };

  // Upload a single file to /api/image/upload and return the filename
  async function uploadSingleFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/image/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.filename;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // 1. Upload all new files and build attachmentsToSave
    const attachmentsToSave = {};
    for (const field of attachmentFields) {
      if (attachments[field] && attachments[field].length > 0) {
        const filenames = [];
        for (const file of attachments[field]) {
          if (file instanceof File) {
            const filename = await uploadSingleFile(file);
            filenames.push(filename);
          } else {
            filenames.push(file); // already uploaded
          }
        }
        attachmentsToSave[field] = filenames;
      } else {
        attachmentsToSave[field] = [];
      }
    }

    // 2. Prepare attendancePayload with attachments spread
    let plates = form.plates;
    if (Array.isArray(plates)) {
      plates = plates.map((p) => p.trim()).filter(Boolean);
    } else if (typeof plates === "string") {
      plates = plates
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
    } else {
      plates = [];
    }

    const attendancePayload = {
      ...form,
      plates,
      ...attachmentsToSave, // <-- cada campo de anexo como campo próprio
    };

    // 3. Save attendance as before
    const attendanceRes = await fetch(`/api/attendances/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attendancePayload),
    });
    if (!attendanceRes.ok) {
      setMessage("Erro ao atualizar atendimento.");
      return;
    }

    // Reguladores
    for (const reg of regulators) {
      if (reg._id) {
        // Atualizar existente
        await fetch(`/api/attendances/${id}/regulators/${reg._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reg),
        });
      } else if (
        // Só faz POST se algum campo relevante foi preenchido
        Object.values(reg).some(
          (v) => v && v !== "" && !(Array.isArray(v) && v.length === 0)
        )
      ) {
        await fetch(`/api/attendances/${id}/regulators`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reg),
        });
      }
    }

    // Vítimas
    for (const victim of victims) {
      if (victim._id) {
        await fetch(`/api/attendances/${id}/victims/${victim._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(victim),
        });
      } else if (
        Object.values(victim).some(
          (v) => v && v !== "" && !(Array.isArray(v) && v.length === 0)
        )
      ) {
        await fetch(`/api/attendances/${id}/victims`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(victim),
        });
      }
    }

    navigate("/attendances");
  };

  // Handlers for regulators and victims (sem duplicatas)
  const handleRegulatorChange = (idx, e) => {
    const { name, value } = e.target;
    const newRegs = [...regulators];
    newRegs[idx][name] = value;
    setRegulators(newRegs);
  };

  const handleRegulatorFileChange = (idx, e) => {
    const files = Array.from(e.target.files);
    const newRegs = [...regulators];
    newRegs[idx].Attachments_filename = files;
    setRegulators(newRegs);
  };

  const addRegulator = () => {
    setRegulators([...regulators, { ...initialRegulator }]);
  };

  const removeRegulator = (idx) => {
    setRegulators(regulators.filter((_, i) => i !== idx));
  };

  const handleVictimChange = (idx, e) => {
    const { name, value } = e.target;
    const newVictims = [...victims];
    newVictims[idx][name] = value;
    setVictims(newVictims);
  };

  const addVictim = () => {
    setVictims([...victims, { ...initialVictim }]);
  };

  const removeVictim = (idx) => {
    setVictims(victims.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Editar Atendimento</h2>
      <Form onSubmit={handleSubmit}>
        <Tabs
          defaultActiveKey="atendimento"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="atendimento" title="Atendimento">
            <Form.Group className="mb-3">
              <Form.Label>Seguradora</Form.Label>
              <Select
                name="insured_company"
                options={insureds.map((i) => ({
                  value: i.company_name,
                  label: i.company_name,
                }))}
                value={
                  insureds.find((i) => i.company_name === form.insured_company)
                    ? {
                        value: form.insured_company,
                        label: form.insured_company,
                      }
                    : null
                }
                onChange={(option) =>
                  setForm({
                    ...form,
                    insured_company: option ? option.value : "",
                  })
                }
                isClearable
                placeholder="Selecione..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nome do Segurado</Form.Label>
              <Select
                name="insured_name"
                options={contacts.map((contact) => ({
                  value: contact.name,
                  label: contact.name,
                }))}
                value={
                  contacts.find((contact) => contact.name === form.insured_name)
                    ? {
                        value: form.insured_name,
                        label: form.insured_name,
                      }
                    : null
                }
                onChange={(option) =>
                  setForm({ ...form, insured_name: option ? option.value : "" })
                }
                isClearable
                placeholder="Selecione..."
                isDisabled={!form.insured_company}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Filial</Form.Label>
              <Select
                name="branch_name"
                options={branches.map((branch) => ({
                  value: branch.company_name,
                  label: branch.company_name,
                }))}
                value={
                  branches.find(
                    (branch) => branch.company_name === form.branch_name
                  )
                    ? {
                        value: form.branch_name,
                        label: form.branch_name,
                      }
                    : null
                }
                onChange={(option) =>
                  setForm({ ...form, branch_name: option ? option.value : "" })
                }
                isClearable
                placeholder="Selecione a filial..."
                isDisabled={!form.insured_company}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Fast Track"
                name="fast_track"
                checked={form.fast_track}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status do Evento</Form.Label>
              <Select
                name="event_status"
                options={[
                  { value: "PENDENTE DE DOC", label: "PENDENTE DE DOC" },
                  { value: "REGULAÇÃO", label: "REGULAÇÃO" },
                  { value: "LIQUIDAÇÃO", label: "LIQUIDAÇÃO" },
                  { value: "INDENIZADO", label: "INDENIZADO" },
                  { value: "NEGADO", label: "NEGADO" },
                  { value: "SEM PREJUÍZO", label: "SEM PREJUÍZO" },
                  { value: "ABAIXO DA FRANQUIA", label: "ABAIXO DA FRANQUIA" },
                ]}
                value={
                  form.event_status
                    ? { value: form.event_status, label: form.event_status }
                    : null
                }
                onChange={(option) =>
                  setForm({ ...form, event_status: option ? option.value : "" })
                }
                isClearable
                placeholder="Selecione..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nome do Comunicante</Form.Label>
              <Form.Control
                type="text"
                name="comunicator_name"
                value={form.comunicator_name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contato do Comunicante</Form.Label>
              <Form.Control
                type="text"
                name="communicator_contact"
                value={form.communicator_contact}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data do Atendimento</Form.Label>
              <Form.Control
                type="datetime-local"
                name="attendance_date"
                value={
                  form.attendance_date ? form.attendance_date.slice(0, 16) : ""
                }
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Operação</Form.Label>
              <Select
                name="operation_type"
                options={[
                  { value: "Sompo Seguros", label: "Sompo Seguros" },
                  { value: "Mapfre Seguros", label: "Mapfre Seguros" },
                  {
                    value: "Start Insurance Companies",
                    label: "Start Insurance Companies",
                  },
                  {
                    value: "FAIRFAX Brasil Seguros Corporativos",
                    label: "FAIRFAX Brasil Seguros Corporativos",
                  },
                  { value: "Austral Seguradora", label: "Austral Seguradora" },
                  { value: "Ezze Seguros", label: "Ezze Seguros" },
                  { value: "Tokio Marine", label: "Tokio Marine" },
                  { value: "Axa Seguros", label: "Axa Seguros" },
                  { value: "Particular", label: "Particular" },
                ]}
                value={
                  form.operation_type
                    ? { value: form.operation_type, label: form.operation_type }
                    : null
                }
                onChange={(option) =>
                  setForm({
                    ...form,
                    operation_type: option ? option.value : "",
                  })
                }
                isClearable
                placeholder="Selecione..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Número do Manifesto</Form.Label>
              <Form.Control
                type="text"
                name="manifest_number"
                value={form.manifest_number}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Número do Conhecimento de Transporte</Form.Label>
              <Form.Control
                type="text"
                name="transport_knowledge_number"
                value={form.transport_knowledge_number}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Número da Nota Fiscal</Form.Label>
              <Form.Control
                type="text"
                name="invoice_number"
                value={form.invoice_number}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reguladora</Form.Label>
              <Select
                name="regulatory"
                options={[
                  { value: "Dórica", label: "Dórica" },
                  { value: "Federal", label: "Federal" },
                  { value: "Global", label: "Global" },
                  { value: "Moraes Velleda", label: "Moraes Velleda" },
                  { value: "Particular", label: "Particular" },
                  { value: "Serra e CIA", label: "Serra e CIA" },
                  { value: "Wagner", label: "Wagner" },
                ]}
                value={
                  form.regulatory
                    ? { value: form.regulatory, label: form.regulatory }
                    : null
                }
                onChange={(option) =>
                  setForm({ ...form, regulatory: option ? option.value : "" })
                }
                isClearable
                placeholder="Selecione..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Natureza do Evento</Form.Label>
              <Select
                name="event_nature"
                options={[
                  { value: "Acidente", label: "Acidente" },
                  { value: "Incidente", label: "Incidente" },
                  { value: "Roubo", label: "Roubo" },
                ]}
                value={
                  form.event_nature
                    ? { value: form.event_nature, label: form.event_nature }
                    : null
                }
                onChange={(option) =>
                  setForm({ ...form, event_nature: option ? option.value : "" })
                }
                isClearable
                placeholder="Selecione..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Natureza do Evento</Form.Label>
              <Form.Control
                type="text"
                name="event_nature_type"
                value={form.event_nature_type}
                onChange={handleChange}
                placeholder="Ex: Colisão, Furto, Tombamento, etc."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Carga Transportada</Form.Label>
              <Form.Control
                type="text"
                name="transported_load"
                value={form.transported_load}
                onChange={handleChange}
                placeholder="Ex: Soja, Milho, Açucar, etc."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valor da Carga</Form.Label>
              <Form.Control
                type="number"
                name="load_value"
                value={form.load_value.$numberDecimal}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valor Segurado</Form.Label>
              <Form.Control
                type="number"
                name="insurance_value"
                value={form.insurance_value.$numberDecimal}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estimativa de Prejuízo</Form.Label>
              <Form.Control
                type="number"
                name="loss_estimation"
                value={form.loss_estimation.$numberDecimal}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valor Recuperado</Form.Label>
              <Form.Control
                type="number"
                name="saved_value"
                value={form.saved_value.$numberDecimal}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Transportadora</Form.Label>
              <Select
                name="shipping_company"
                options={shippingCompanies.map((sc) => ({
                  value: sc.company_name,
                  label: sc.company_name,
                }))}
                value={
                  shippingCompanies.find(
                    (sc) => sc.company_name === form.shipping_company
                  )
                    ? {
                        value: form.shipping_company,
                        label: form.shipping_company,
                      }
                    : null
                }
                onChange={(option) =>
                  setForm({
                    ...form,
                    shipping_company: option ? option.value : "",
                  })
                }
                isClearable
                placeholder="Selecione..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nome do Motorista</Form.Label>
              <Select
                name="driver_name"
                options={drivers.map((d) => ({
                  value: d.name,
                  label: d.name,
                }))}
                value={
                  drivers.find((d) => d.name === form.driver_name)
                    ? { value: form.driver_name, label: form.driver_name }
                    : null
                }
                onChange={(option) =>
                  setForm({ ...form, driver_name: option ? option.value : "" })
                }
                isClearable
                placeholder="Selecione..."
                isDisabled={!form.shipping_company}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Placas do Motorista</Form.Label>
              <Form.Control
                type="text"
                name="plates"
                value={
                  Array.isArray(form.plates)
                    ? form.plates.join(", ")
                    : form.plates || ""
                }
                onChange={handleChange}
                placeholder="Ex: ABC1234, XYZ5678"
                disabled={!form.driver_name}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Origem - Estado</Form.Label>
              <Form.Control
                type="text"
                name="origin_state"
                value={form.origin_state}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Origem - Cidade</Form.Label>
              <Form.Control
                type="text"
                name="origin_city"
                value={form.origin_city}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Destino - Estado</Form.Label>
              <Form.Control
                type="text"
                name="destination_state"
                value={form.destination_state}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Destino - Cidade</Form.Label>
              <Form.Control
                type="text"
                name="destination_city"
                value={form.destination_city}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado do Evento</Form.Label>
              <Form.Control
                type="text"
                name="event_state"
                value={form.event_state}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cidade do Evento</Form.Label>
              <Form.Control
                type="text"
                name="event_city"
                value={form.event_city}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Endereço do Evento</Form.Label>
              <Form.Control
                type="text"
                name="event_address"
                value={form.event_address}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>KM</Form.Label>
              <Form.Control
                type="text"
                name="n_km"
                value={form.n_km}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="text"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                type="text"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data/Hora do Acidente</Form.Label>
              <Form.Control
                type="datetime-local"
                name="date_time_accident"
                value={
                  form.date_time_accident
                    ? form.date_time_accident.slice(0, 16)
                    : ""
                }
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Registro</Form.Label>
              <Form.Control
                type="text"
                name="register"
                value={form.register}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sinistro</Form.Label>
              <Form.Control
                type="text"
                name="insurance_claim"
                value={form.insurance_claim}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </Form.Group>
          </Tab>
          <Tab eventKey="regulator" title="Regulador">
            <RegulatorsEditTabs
              regulators={regulators}
              handleRegulatorChange={handleRegulatorChange}
              handleRegulatorFileChange={handleRegulatorFileChange}
              addRegulator={addRegulator}
              removeRegulator={removeRegulator}
            />
            <Button
              variant="secondary"
              onClick={addRegulator}
              type="button"
              className="mt-2"
            >
              Adicionar Regulador
            </Button>
          </Tab>
          <Tab eventKey="victims" title="Vítimas">
            <VictimsEditTabs
              victims={victims}
              handleVictimChange={handleVictimChange}
              addVictim={addVictim}
              removeVictim={removeVictim}
            />
            <Button
              variant="secondary"
              onClick={addVictim}
              type="button"
              className="mt-2"
            >
              Adicionar Vítima
            </Button>
          </Tab>
          <Tab eventKey="anexos" title="Anexos">
            {attachmentFields.map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>
                  {field
                    .replace(/_/g, " ")
                    .replace("filename", "")
                    .toUpperCase()}
                </Form.Label>
                {attachments[field] && attachments[field].length > 0 && (
                  <ul>
                    {attachments[field].map((file, idx) => (
                      <li key={idx}>
                        {typeof file === "string" ? (
                          <a
                            href={`/uploads/${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {file}
                          </a>
                        ) : (
                          file.name
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          className="ms-2"
                          onClick={() => handleRemoveAttachmentFile(field, idx)}
                          type="button"
                        >
                          Remover
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
                <Form.Control
                  type="file"
                  name={field}
                  multiple
                  onChange={(e) => handleAttachmentFileChange(field, e)}
                />
              </Form.Group>
            ))}
          </Tab>
        </Tabs>
        <Button type="submit">Salvar</Button>
        <span className="ms-3 text-danger">{message}</span>
      </Form>
    </div>
  );
};

export default AttendanceEdit;
