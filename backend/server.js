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
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors());

app.set("io", io);

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoute);
app.use("/api/image", imageRoute);
app.use("/api/face", faceRoute);

app.use("/api/audit-logs", auth, auditLogRoute);

app.use("/api/attendances", auth, auditLog, attendanceRoute);
app.use(
  "/api/attendances/:attendanceId/regulators",
  auth,
  auditLog,
  (req, res, next) => {
    req.attendanceId = req.params.attendanceId;
    next();
  },
  regulatorRoute
);
app.use(
  "/api/attendances/:attendanceId/interactions",
  auth,
  auditLog,
  (req, res, next) => {
    req.attendanceId = req.params.attendanceId;
    next();
  },
  interactionRoute
);
app.use(
  "/api/attendances/:attendanceId/victims",
  auth,
  auditLog,
  (req, res, next) => {
    req.attendanceId = req.params.attendanceId;
    next();
  },
  victimRoute
);

app.use("/api/shipping_companies", auth, auditLog, shippingCompanyRoute);
app.use(
  "/api/shipping_companies/:shippingCompanyId/drivers",
  auth,
  auditLog,
  (req, res, next) => {
    req.shippingCompanyId = req.params.shippingCompanyId;
    next();
  },
  driverRoute
);

app.use("/api/insureds", auth, auditLog, insuredRoute);

app.use(
  "/api/insureds/:insuredId/branches",
  auth,
  auditLog,
  (req, res, next) => {
    req.insuredId = req.params.insuredId;
    next();
  },
  branchRoute
);
app.use(
  "/api/insureds/:insuredId/contacts",
  auth,
  auditLog,
  (req, res, next) => {
    req.insuredId = req.params.insuredId;
    next();
  },
  contactRoute
);
app.use(
  "/api/insureds/:insuredId/policies",
  auth,
  auditLog,
  (req, res, next) => {
    req.insuredId = req.params.insuredId;
    next();
  },
  policyRoute
);

app.use("/api/settingLists", auth, auditLog, settingListRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
  });
}

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});
