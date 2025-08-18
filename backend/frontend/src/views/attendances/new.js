import React, { useEffect, useState } from "react";
import { Form, Button, Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import RegulatorsNewTabs from "./regulators/new";
import VictimsNewTabs from "./victims/new";
import Select from "react-select";

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

const uploadSingleFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/image/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.filename;
};

const initialState = {
  insured_company: "",
  insured_name: "",
  branch_name: "",
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

const AttendanceNew = () => {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [insureds, setInsureds] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [regulators, setRegulators] = useState([
    {
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
    },
  ]);
  const [victims, setVictims] = useState([]);
  const [attachments, setAttachments] = useState({});
  const [shippingCompanies, setShippingCompanies] = useState([]);
  const [drivers, setDrivers] = useState([]);
  // eslint-disable-next-line
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [origemEstados, setOrigemEstados] = useState([]);
  const [origemCidades, setOrigemCidades] = useState([]);
  const [destinoEstados, setDestinoEstados] = useState([]);
  const [destinoCidades, setDestinoCidades] = useState([]);
  const [settingLists, setSettingLists] = useState({});
  const navigate = useNavigate();

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

  // Buscar shipping companies ao carregar
  useEffect(() => {
    fetch("/api/shipping_companies", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setShippingCompanies(data.shippingCompanies || []));
  }, []);

  // Buscar estados ao carregar
  useEffect(() => {
    fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
    )
      .then((res) => res.json())
      .then((data) => {
        setEstados(data);
        setOrigemEstados(data);
        setDestinoEstados(data);
      });
  }, []);

  // Buscar cidades ao selecionar estado do evento
  useEffect(() => {
    if (form.event_state) {
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.event_state}/municipios`
      )
        .then((res) => res.json())
        .then((data) => setCidades(data));
    } else {
      setCidades([]);
    }
  }, [form.event_state]);

  // Buscar cidades de origem ao selecionar estado de origem
  useEffect(() => {
    if (form.origin_state) {
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.origin_state}/municipios`
      )
        .then((res) => res.json())
        .then((data) => setOrigemCidades(data));
    } else {
      setOrigemCidades([]);
    }
  }, [form.origin_state]);

  // Buscar cidades de destino ao selecionar estado de destino
  useEffect(() => {
    if (form.destination_state) {
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.destination_state}/municipios`
      )
        .then((res) => res.json())
        .then((data) => setDestinoCidades(data));
    } else {
      setDestinoCidades([]);
    }
  }, [form.destination_state]);

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

  // Buscar motoristas ao selecionar uma transportadora
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
    // eslint-disable-next-line
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
    setAttachments({ ...attachments, [field]: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // 1. Upload all new files and build fields for each attachment
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

    const attendancePayload = {
      ...form,
      plates: form.plates
        ? form.plates
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean)
        : [],
      ...attachmentsToSave,
    };

    const attendanceRes = await fetch("/api/attendances", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(attendancePayload),
    });
    const attendanceData = await attendanceRes.json();
    const attendanceId =
      attendanceData._id ||
      attendanceData.data?._id ||
      attendanceData.data?.attendance?._id ||
      attendanceData.attendance?._id;
    if (!attendanceId) {
      setMessage("Erro ao criar atendimento: ID não retornado.");
      return;
    }

    for (const reg of regulators) {
      // Monte o objeto só com os campos aceitos pelo backend
      const regPayload = {
        contractor: reg.contractor,
        recovered: reg.recovered,
        estimatedArrivalDate: reg.estimatedArrivalDate,
        arrivalDate: reg.arrivalDate,
        finalDate: reg.finalDate,
        serviceProvider: reg.serviceProvider,
        place: reg.place,
        km: reg.km,
        standingTime: reg.standingTime,
        observation: reg.observation,
        // Se o backend aceita apenas nomes dos arquivos:
        Attachments_filename: reg.Attachments_filename
          ? Array.from(reg.Attachments_filename).map((f) => f.name)
          : [],
        authDate: reg.authDate,
      };
      console.log("Enviando regulador:", regPayload);
      await fetch(`/api/attendances/${attendanceId}/regulators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(regPayload),
      });
    }

    for (const victim of victims) {
      const victimPayload = {
        victim: !!victim.victim,
        fatal_victim: !!victim.fatal_victim,
        driver_victim: victim.driver_victim || 0,
        third_party_victim: victim.third_party_victim || 0,
        fatal_driver_victim: victim.fatal_driver_victim || 0,
        fatal_third_party_victim: victim.fatal_third_party_victim || 0,
        culpability: !!victim.culpability,
      };
      await fetch(`/api/attendances/${attendanceId}/victims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(victimPayload),
      });
    }

    navigate("/attendances");
  };

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
    setRegulators([...regulators, { contractor: "", serviceProvider: "" }]);
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
    setVictims([...victims, {}]);
  };

  const removeVictim = (idx) => {
    setVictims(victims.filter((_, i) => i !== idx));
  };

  // Buscar listas de configuração ao carregar o componente
  useEffect(() => {
    fetch("/api/settingLists", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSettingLists(data || {}));
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Novo Atendimento</h2>
      <Form onSubmit={handleSubmit}>
        <Tabs
          defaultActiveKey="home"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="home" title="Home">
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
                options={(settingLists.event_status || []).map((v) => ({
                  value: v,
                  label: v,
                }))}
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
                value={form.attendance_date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Operação</Form.Label>
              <Select
                name="operation_type"
                options={(settingLists.operation_type || []).map((v) => ({
                  value: v,
                  label: v,
                }))}
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
                options={(settingLists.regulatory || []).map((v) => ({
                  value: v,
                  label: v,
                }))}
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
                options={(settingLists.event_nature || []).map((v) => ({
                  value: v,
                  label: v,
                }))}
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
              <Select
                name="event_nature_type"
                options={(settingLists.event_nature_type || []).map((v) => ({
                  value: v,
                  label: v,
                }))}
                value={
                  form.event_nature_type
                    ? {
                        value: form.event_nature_type,
                        label: form.event_nature_type,
                      }
                    : null
                }
                onChange={(option) =>
                  setForm({
                    ...form,
                    event_nature_type: option ? option.value : "",
                  })
                }
                isClearable
                placeholder="Selecione..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Carga Transportada</Form.Label>
              <Select
                name="transported_load"
                options={(settingLists.transported_load || []).map((v) => ({
                  value: v,
                  label: v,
                }))}
                value={
                  form.transported_load
                    ? {
                        value: form.transported_load,
                        label: form.transported_load,
                      }
                    : null
                }
                onChange={(option) =>
                  setForm({
                    ...form,
                    transported_load: option ? option.value : "",
                  })
                }
                isClearable
                placeholder="Selecione..."
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
              <Select
                name="origin_state"
                options={origemEstados.map((estado) => ({
                  value: estado.sigla,
                  label: `${estado.nome} (${estado.sigla})`,
                }))}
                value={
                  origemEstados.find(
                    (estado) => estado.sigla === form.origin_state
                  )
                    ? {
                        value: form.origin_state,
                        label:
                          origemEstados.find(
                            (estado) => estado.sigla === form.origin_state
                          ).nome +
                          " (" +
                          form.origin_state +
                          ")",
                      }
                    : null
                }
                onChange={(option) =>
                  setForm({ ...form, origin_state: option ? option.value : "" })
                }
                isClearable
                placeholder="Selecione..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Origem - Cidade</Form.Label>
              <Select
                name="origin_city"
                options={origemCidades.map((cidade) => ({
                  value: cidade.nome,
                  label: cidade.nome,
                }))}
                value={
                  origemCidades.find((c) => c.nome === form.origin_city)
                    ? { value: form.origin_city, label: form.origin_city }
                    : null
                }
                onChange={(option) =>
                  setForm({ ...form, origin_city: option ? option.value : "" })
                }
                isClearable
                placeholder="Digite ou selecione a cidade..."
                isDisabled={!form.origin_state}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Destino - Estado</Form.Label>
              <Select
                name="destination_state"
                options={destinoEstados.map((estado) => ({
                  value: estado.sigla,
                  label: `${estado.nome} (${estado.sigla})`,
                }))}
                value={
                  destinoEstados.find(
                    (estado) => estado.sigla === form.destination_state
                  )
                    ? {
                        value: form.destination_state,
                        label:
                          destinoEstados.find(
                            (estado) => estado.sigla === form.destination_state
                          ).nome +
                          " (" +
                          form.destination_state +
                          ")",
                      }
                    : null
                }
                onChange={(option) =>
                  setForm({
                    ...form,
                    destination_state: option ? option.value : "",
                  })
                }
                isClearable
                placeholder="Selecione..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Destino - Cidade</Form.Label>
              <Select
                name="destination_city"
                options={destinoCidades.map((cidade) => ({
                  value: cidade.nome,
                  label: cidade.nome,
                }))}
                value={
                  destinoCidades.find((c) => c.nome === form.destination_city)
                    ? {
                        value: form.destination_city,
                        label: form.destination_city,
                      }
                    : null
                }
                onChange={(option) =>
                  setForm({
                    ...form,
                    destination_city: option ? option.value : "",
                  })
                }
                isClearable
                placeholder="Digite ou selecione a cidade..."
                isDisabled={!form.destination_state}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado do Evento</Form.Label>
              <Select
                name="event_state"
                options={estados.map((estado) => ({
                  value: estado.sigla,
                  label: `${estado.nome} (${estado.sigla})`,
                }))}
                value={
                  estados.find((estado) => estado.sigla === form.event_state)
                    ? {
                        value: form.event_state,
                        label:
                          estados.find(
                            (estado) => estado.sigla === form.event_state
                          ).nome +
                          " (" +
                          form.event_state +
                          ")",
                      }
                    : null
                }
                onChange={(option) =>
                  setForm({ ...form, event_state: option ? option.value : "" })
                }
                isClearable
                placeholder="Selecione..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cidade do Evento</Form.Label>
              <Select
                name="event_city"
                options={cidades.map((cidade) => ({
                  value: cidade.nome,
                  label: cidade.nome,
                }))}
                value={
                  cidades.find((c) => c.nome === form.event_city)
                    ? { value: form.event_city, label: form.event_city }
                    : null
                }
                onChange={(option) =>
                  setForm({ ...form, event_city: option ? option.value : "" })
                }
                isClearable
                placeholder="Digite ou selecione a cidade..."
                isDisabled={!form.event_state}
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
                value={form.date_time_accident}
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
            <RegulatorsNewTabs
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
            <VictimsNewTabs
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
        <Button type="submit">Cadastrar</Button>
        <span className="ms-3 text-danger">{message}</span>
      </Form>
    </div>
  );
};

export default AttendanceNew;
