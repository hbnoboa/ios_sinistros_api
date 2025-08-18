// Este script cria 100 atendimentos, cada um com 2 reguladores e 2 vítimas.
// Ele busca as opções de selects usando os mesmos endpoints do frontend (attendance new).
// É necessário rodar com Node.js >= 18 (fetch nativo) ou instalar node-fetch para Node < 18.

const BASE_URL = "http://192.168.15.67:5000/api";
const TOKEN =
  process.env.TOKEN ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODM5YjQ4MzZjNDMxNjU2ODJjYTM5NjkiLCJlbWFpbCI6Imhibm9ib2ExMUBnbWFpbC5jb20iLCJpYXQiOjE3NTAxNTkzOTF9.tSv4mP4Mga3zPImMWOFG4lw-FYjFwItgySAJJ8NTN_o"; // Defina seu token JWT aqui ou exporte TOKEN=... node createWithFetch.js

function authHeaders(extra = {}) {
  return {
    ...extra,
    Authorization: `Bearer ${TOKEN}`,
  };
}

async function fetchOptions(endpoint) {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  return data;
}

async function getInsureds() {
  const data = await fetchOptions("insureds");
  return data.insureds || data.data?.insureds || [];
}

async function getShippingCompanies() {
  const data = await fetchOptions("shipping_companies");
  return data.shippingCompanies || data.data?.shippingCompanies || [];
}

async function getSettingList(field) {
  const data = await fetchOptions("settingLists");
  return data[field] || [];
}

async function getBranches(insuredId) {
  const data = await fetchOptions(`insureds/${insuredId}/branches`);
  return data.branches || data.data?.branches || [];
}

async function getContacts(insuredId) {
  const data = await fetchOptions(`insureds/${insuredId}/contacts`);
  return data.contacts || data.data?.contacts || [];
}

async function getDrivers(shippingCompanyId) {
  const data = await fetchOptions(
    `shipping_companies/${shippingCompanyId}/drivers`
  );
  return data.drivers || data.data?.drivers || [];
}

async function createAttendance(attendance) {
  const res = await fetch(`${BASE_URL}/attendances`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(attendance),
  });
  return res.json();
}

async function createRegulator(attendanceId, regPayload) {
  await fetch(`${BASE_URL}/attendances/${attendanceId}/regulators`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(regPayload),
  });
}

async function createVictim(attendanceId, victimPayload) {
  await fetch(`${BASE_URL}/attendances/${attendanceId}/victims`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(victimPayload),
  });
}

async function main() {
  // Busca opções dos selects
  const insureds = await getInsureds();
  const shippingCompanies = await getShippingCompanies();
  const eventStatusList = await getSettingList("event_status");
  const operationTypes = await getSettingList("operation_type");
  const regulatoryList = await getSettingList("regulatory");
  const eventNatureList = await getSettingList("event_nature");
  const eventNatureTypeList = await getSettingList("event_nature_type");
  const transportedLoadList = await getSettingList("transported_load");

  for (let i = 1; i <= 100; i++) {
    // Seleciona opções válidas
    const insured = insureds[i % insureds.length];
    const shippingCompany = shippingCompanies[i % shippingCompanies.length];
    const insuredId = insured?._id;
    const shippingCompanyId = shippingCompany?._id;

    // Busca branches, contacts e drivers para o insured/shippingCompany
    const branches = insuredId ? await getBranches(insuredId) : [];
    const contacts = insuredId ? await getContacts(insuredId) : [];
    const drivers = shippingCompanyId
      ? await getDrivers(shippingCompanyId)
      : [];

    const attendance = {
      insured_company: insured?.company_name || "",
      insured_name: contacts[0]?.name || `Contato ${i}`,
      branch_name: branches[0]?.name || `Filial ${i}`,
      fast_track: i % 2 === 0,
      event_status:
        eventStatusList[i % eventStatusList.length] || "PENDENTE DE DOC",
      comunicator_name: contacts[0]?.name || `Comunicante ${i}`,
      communicator_contact: contacts[0]?.phone || `1199999000${i}`,
      attendance_date: new Date(),
      operation_type: operationTypes[i % operationTypes.length] || "",
      manifest_number: `MAN${i}2024`,
      transport_knowledge_number: `CTE${i}2024`,
      invoice_number: `NF${i}2024`,
      regulatory: regulatoryList[i % regulatoryList.length] || "",
      event_nature: eventNatureList[i % eventNatureList.length] || "",
      event_nature_type:
        eventNatureTypeList[i % eventNatureTypeList.length] || "",
      transported_load:
        transportedLoadList[i % transportedLoadList.length] || "",
      load_value: 100000 + i * 1000,
      insurance_value: 120000 + i * 1000,
      loss_estimation: 5000 + i * 100,
      saved_value: 1000 + i * 50,
      shipping_company: shippingCompany?.company_name || `Transportadora ${i}`,
      shipping_company_cnpj: shippingCompany?.cnpj || `00.000.000/000${i}-00`,
      driver_name: drivers[0]?.name || `Motorista ${i}`,
      plates: Array.isArray(drivers[0]?.plates)
        ? drivers[0].plates
        : drivers[0]?.plates
        ? [drivers[0].plates]
        : [`ABC${i}23${i}`],
      origin_state: "SP",
      origin_city: "São Paulo",
      destination_state: "RJ",
      destination_city: "Rio de Janeiro",
      event_state: "SP",
      event_city: "São Paulo",
      event_address: `Rodovia Exemplo, KM ${i * 10}`,
      n_km: `${i * 10}`,
      latitude: "-23.5",
      longitude: "-46.6",
      date_time_accident: new Date(),
      register: `REG${i}`,
      insurance_claim: `SIN${i}`,
      description: `Descrição do atendimento ${i}`,
    };

    // Cria o atendimento
    const data = await createAttendance(attendance);
    const attendanceId =
      data._id ||
      data.data?._id ||
      data.data?.attendance?._id ||
      data.attendance?._id;

    if (!attendanceId) {
      console.log(`Erro ao criar atendimento ${i}:`, data);
      continue;
    }

    // Cria 2 reguladores
    for (let r = 1; r <= 2; r++) {
      const regPayload = {
        contractor: `Contratada ${r}`,
        recovered: r % 2 === 0,
        estimatedArrivalDate: new Date(),
        arrivalDate: new Date(),
        finalDate: new Date(),
        serviceProvider: `Prestador ${r}`,
        place: `Local ${r}`,
        km: 100 + r,
        standingTime: 10 + r,
        observation: `Observação ${r}`,
        Attachments_filename: [],
        authDate: new Date(),
      };
      await createRegulator(attendanceId, regPayload);
    }

    // Cria 2 vítimas
    for (let v = 1; v <= 2; v++) {
      const victimPayload = {
        victim: v % 2 === 1,
        fatal_victim: v % 2 === 0,
        driver_victim: v,
        third_party_victim: v,
        fatal_driver_victim: 0,
        fatal_third_party_victim: 0,
        culpability: v % 2 === 0,
      };
      await createVictim(attendanceId, victimPayload);
    }

    console.log(`Atendimento ${i} criado com 2 reguladores e 2 vítimas.`);
  }
}

main().catch((err) => {
  console.error("Erro geral:", err);
});
