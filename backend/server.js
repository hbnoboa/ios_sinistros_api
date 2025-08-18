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

// helper para mapear params para req.<name>
const setParam = (name) => (req, res, next) => {
  if (req.params && req.params[name]) req[name] = req.params[name];
  next();
};

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

// safeUse: registra rotas e loga erro com o path que causou a falha
const safeUse = (path, ...handlers) => {
  try {
    app.use(path, ...handlers);
  } catch (err) {
    console.error("Route registration failed for path:", path);
    console.error(err && err.stack ? err.stack : err);
    // encerra para que Heroku mostre o erro — remova se preferir continuar sem a rota
    process.exit(1);
  }
};

safeUse("/api/auth", authRoute);
safeUse("/api/image", imageRoute);
safeUse("/api/face", faceRoute);

safeUse("/api/audit-logs", auth, auditLogRoute);

safeUse("/api/attendances", auth, auditLog, attendanceRoute);
safeUse(
  "/api/attendances/:attendanceId/regulators",
  auth,
  auditLog,
  setParam("attendanceId"),
  regulatorRoute
);
safeUse(
  "/api/attendances/:attendanceId/interactions",
  auth,
  auditLog,
  setParam("attendanceId"),
  interactionRoute
);
safeUse(
  "/api/attendances/:attendanceId/victims",
  auth,
  auditLog,
  setParam("attendanceId"),
  victimRoute
);

safeUse("/api/shipping_companies", auth, auditLog, shippingCompanyRoute);
safeUse(
  "/api/shipping_companies/:shippingCompanyId/drivers",
  auth,
  auditLog,
  setParam("shippingCompanyId"),
  driverRoute
);

safeUse("/api/insureds", auth, auditLog, insuredRoute);

safeUse(
  "/api/insureds/:insuredId/branches",
  auth,
  auditLog,
  setParam("insuredId"),
  branchRoute
);
safeUse(
  "/api/insureds/:insuredId/contacts",
  auth,
  auditLog,
  setParam("insuredId"),
  contactRoute
);
safeUse(
  "/api/insureds/:insuredId/policies",
  auth,
  auditLog,
  setParam("insuredId"),
  policyRoute
);

safeUse("/api/settingLists", auth, auditLog, settingListRoute);
