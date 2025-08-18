require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const SettingList = require("../models/settingListModel");

const MONGODB_URI = process.env.MONGODB_URI;

const transportedLoadValues = [
  "Açucar Bruto de Cana VHP",
  "Adubo",
  "Alcool Etilico",
  "Algodão - Pluma",
  "Algodão - Caroço",
  "Arroz Branco",
  "Arroz - Casca",
  "Aveia",
  "Azevem",
  "Biodiesel B100",
  "Calcario",
  "Soja - Casca Peletizada",
  "Cravo da India",
  "Estrutura Metálica",
  "Etanol Anidro",
  "Farelo de soja hipro 48%",
  "Farinha de Trigo",
  "Ferro",
  "Fertilizante",
  "Gasolina aditivada",
  "Gordura Vegetal",
  "Milho - Gritz",
  "Leite / Derivados",
  "Margarina",
  "Milho - Pipoca",
  "Milho – Semente",
  "Milho – Grãos",
  "Móveis",
  "Oleo Diesel Comum",
  "Oleo Diesel S10",
  "Oleo Degomado",
  "Ovo",
  "Pimenta em Grãos",
  "Ração Animal",
  "Soja - Semente",
  "Soja - Grãos",
  "Soja - Óleo",
  "Soja - Farelo",
  "Sorgo – Granel",
  "Trigo - Sementes",
  "Trigo - Grãos",
  "Varredura",
  "Outros",
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  let doc = await SettingList.findOne();
  if (!doc) doc = await SettingList.create({});
  doc.transported_load = transportedLoadValues;
  await doc.save();
  console.log("Valores adicionados em transported_load!");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
