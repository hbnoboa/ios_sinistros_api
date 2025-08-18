// Este script atualiza todos os atendimentos existentes para cidades e endereços aleatórios
// dos estados: SP, RJ, MG, GO, SC, PR, RS, usando a API do IBGE para obter cidades reais.

const BASE_URL = "http://192.168.15.67:5000/api";
const TOKEN =
  process.env.TOKEN ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODM5YjQ4MzZjNDMxNjU2ODJjYTM5NjkiLCJlbWFpbCI6Imhibm9ib2ExMUBnbWFpbC5jb20iLCJpYXQiOjE3NTAxNTkzOTF9.tSv4mP4Mga3zPImMWOFG4lw-FYjFwItgySAJJ8NTN_o";

const ESTADOS = [
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
];

function authHeaders(extra = {}) {
  return {
    ...extra,
    Authorization: `Bearer ${TOKEN}`,
  };
}

async function fetchAttendances() {
  const res = await fetch(`${BASE_URL}/attendances?limit=10000`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  return data.attendances || [];
}

async function updateAttendance(id, payload) {
  const res = await fetch(`${BASE_URL}/attendances/${id}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  return res.json();
}

async function getCidadesPorEstado(sigla) {
  const res = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla}/municipios`
  );
  return res.json();
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomEndereco(cidade, estado) {
  const ruas = [
    "Rua das Flores",
    "Avenida Brasil",
    "Rua XV de Novembro",
    "Rua das Palmeiras",
    "Avenida Paulista",
    "Rua Sete de Setembro",
    "Rua dos Andradas",
    "Rua Dom Pedro II",
    "Rua São João",
    "Avenida Atlântica",
    "Rua Goiás",
    "Rua Minas Gerais",
    "Rua Santa Catarina",
    "Rua Paraná",
    "Rua Rio Grande do Sul",
  ];
  const bairros = [
    "Centro",
    "Jardim América",
    "Vila Nova",
    "Bela Vista",
    "Copacabana",
    "Savassi",
    "Setor Bueno",
    "Trindade",
    "Batel",
    "Moinhos de Vento",
  ];
  return (
    `${getRandomItem(ruas)}, ${Math.floor(Math.random() * 9999) + 1} - ` +
    `${getRandomItem(bairros)}, ${cidade} - ${estado}`
  );
}

async function main() {
  // Busca cidades de cada estado
  const cidadesPorEstado = {};
  for (const estado of ESTADOS) {
    cidadesPorEstado[estado.sigla] = await getCidadesPorEstado(estado.sigla);
  }

  // Busca todos os atendimentos
  const attendances = await fetchAttendances();

  for (const att of attendances) {
    // Escolhe estado e cidade aleatórios
    const estado = getRandomItem(ESTADOS);
    const cidades = cidadesPorEstado[estado.sigla];
    const cidadeObj = getRandomItem(cidades);
    const cidade = cidadeObj.nome;

    // Gera endereço aleatório
    const endereco = randomEndereco(cidade, estado.sigla);

    // Monta payload de atualização
    const payload = {
      origin_state: estado.sigla,
      origin_city: cidade,
      destination_state: estado.sigla,
      destination_city: cidade,
      event_state: estado.sigla,
      event_city: cidade,
      event_address: endereco,
    };

    // Atualiza o atendimento
    const result = await updateAttendance(att._id, { ...att, ...payload });
    if (result._id || result.data?.attendance?._id) {
      console.log(
        `Atendimento ${att._id} atualizado para ${cidade} - ${estado.sigla}`
      );
    } else {
      console.log(`Erro ao atualizar ${att._id}:`, result);
    }
  }
}

main().catch((err) => {
  console.error("Erro geral:", err);
});
