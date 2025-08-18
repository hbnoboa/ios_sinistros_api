const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path"); // Adicione esta linha

require("dotenv").config();

const imageRoute = require("./routes/imageRoute");
const authRoute = require("./routes/authRoute");
const attendanceRoute = require("./routes/attendanceRoute");
const regulatorRoute = require("./routes/regulatorRoute");
const interactionRoute = require("./routes/interactionRoute");
const victimRoute = require("./routes/victimRoute");
const branchRoute = require("./routes/branchRoute");
const shippingCompanyRoute = require("./routes/shippingCompanyRoute");
const driverRoute = require("./routes/driverRoute");
const insuredRoute = require("./routes/insuredRoute");
const policyRoute = require("./routes/policyRoute");
const contactRoute = require("./routes/contactRoute");
const settingListRoute = require("./routes/settingListRoute");
const auditLogRoute = require("./routes/auditLogRoute");
const faceRoute = require("./routes/faceRoute");
const auth = require("./middleware/auth");
const auditLog = require("./middleware/auditLog");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors());

// --- INÍCIO: Servir o frontend em produção ---
if (process.env.NODE_ENV === "production") {
  // Serve os arquivos estáticos da build do React
  app.use(express.static(path.join(__dirname, "frontend/build")));

  // Para qualquer outra rota, serve o index.html do React
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend/build", "index.html"));
  });
}
// --- FIM: Servir o frontend em produção ---

app.set("io", io);

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.use("/api/auth", authRoute);
app.use("/api/image", imageRoute);
app.use("/api/face", faceRoute);

app.use("/api/audit-logs", auth, auditLogRoute);

app.use("/api/attendances", auth, auditLog, attendanceRoute);
app.use(
  "/api/attendances/:attendanceId/regulators",
  auth,
  auditLog,
  regulatorRoute
);
app.use(
  "/api/attendances/:attendanceId/interactions",
  auth,
  auditLog,
  interactionRoute
);
app.use("/api/attendances/:attendanceId/victims", auth, auditLog, victimRoute);

app.use("/api/shipping_companies", auth, auditLog, shippingCompanyRoute);
app.use(
  "/api/shipping_companies/:shippingCompanyId/drivers",
  auth,
  auditLog,
  driverRoute
);

app.use("/api/insureds", auth, auditLog, insuredRoute);
app.use("/api/insureds/:insuredId/branches", auth, auditLog, branchRoute);
app.use("/api/insureds/:insuredId/contacts", auth, auditLog, contactRoute);
app.use("/api/insureds/:insuredId/policies", auth, auditLog, policyRoute);

app.use("/api/settingLists", auth, auditLog, settingListRoute);
