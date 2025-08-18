const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    insured_company: {
      type: String,
      required: false,
    },
    insured_name: {
      type: String,
      required: false,
    },
    branch_name: {
      type: String,
      required: false,
    },
    fast_track: {
      type: Boolean,
      default: false,
    },
    event_status: {
      type: String,
    },
    comunicator_name: {
      type: String,
      required: false,
    },
    communicator_contact: {
      type: String,
      required: false,
    },
    attendance_date: {
      type: Date,
      default: Date.now,
    },
    operation_type: {
      type: String,
      required: false,
    },
    manifest_number: {
      type: String,
      required: false,
    },
    transport_knowledge_number: {
      type: String,
      required: false,
    },
    invoice_number: {
      type: String,
      required: false,
    },
    regulatory: {
      type: String,
      required: false,
    },
    event_nature: {
      type: String,
      required: false,
    },
    event_nature_type: {
      type: String,
      required: false,
    },
    transported_load: {
      type: String,
      required: false,
    },
    load_value: {
      type: mongoose.Schema.Types.Decimal128,
      required: false,
    },
    insurance_value: {
      type: mongoose.Schema.Types.Decimal128,
      required: false,
    },
    loss_estimation: {
      type: mongoose.Schema.Types.Decimal128,
      required: false,
    },
    saved_value: {
      type: mongoose.Schema.Types.Decimal128,
      required: false,
    },
    shipping_company: {
      type: String,
      required: false,
    },
    shipping_company_cnpj: {
      type: String,
      required: false,
    },
    driver_name: {
      type: String,
      required: false,
    },
    plates: {
      type: [String],
      required: false,
    },
    origin_state: {
      type: String,
      required: false,
    },
    origin_city: {
      type: String,
      required: false,
    },
    destination_state: {
      type: String,
      required: false,
    },
    destination_city: {
      type: String,
      required: false,
    },
    event_state: {
      type: String,
      required: false,
    },
    event_city: {
      type: String,
      required: false,
    },
    event_address: {
      type: String,
      required: false,
    },
    n_km: {
      type: String,
      required: false,
    },
    latitude: {
      type: String,
      required: false,
    },
    longitude: {
      type: String,
      required: false,
    },
    date_time_accident: {
      type: Date,
      required: false,
    },
    register: {
      type: String,
      required: false,
    },
    insurance_claim: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    averbacao_filename: { type: [String], required: false },
    aviso_sinistro_filename: { type: [String], required: false },
    antt_filename: { type: [String], required: false },
    conhecimento_transporte_filename: { type: [String], required: false },
    nota_fiscal_filename: { type: [String], required: false },
    manifesto_filename: { type: [String], required: false },
    documento_motorista_filename: { type: [String], required: false },
    documento_veiculo_filename: { type: [String], required: false },
    ficha_cadastro_interno_filename: { type: [String], required: false },
    contrato_transporte_filename: { type: [String], required: false },
    boletim_ocorrencia_filename: { type: [String], required: false },
    boletim_saque_filename: { type: [String], required: false },
    comprovante_entrega_filename: { type: [String], required: false },
    ticket_pesagem_filename: { type: [String], required: false },
    comprovante_venda_salvados_filename: { type: [String], required: false },
    declaracao_nao_recebimento_filename: { type: [String], required: false },
    declaracao_motorista_filename: { type: [String], required: false },
    discos_cronotacografo_filename: { type: [String], required: false },
    consulta_gr_filename: { type: [String], required: false },
    ordem_carregamento_filename: { type: [String], required: false },
    relatorio_rastreamento_filename: { type: [String], required: false },
    nota_debito_filename: { type: [String], required: false },
    comprovante_pagamento_nd_filename: { type: [String], required: false },
    comprovante_pagamento_seguradora_filename: {
      type: [String],
      required: false,
    },
    interactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Interaction" },
    ],
    victims: [{ type: mongoose.Schema.Types.ObjectId, ref: "Victim" }],
    regulator: [{ type: mongoose.Schema.Types.ObjectId, ref: "Regulator" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
