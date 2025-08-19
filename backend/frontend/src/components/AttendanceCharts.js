import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Card, Row, Col } from "react-bootstrap";
import { MapContainer, TileLayer } from "react-leaflet";
import HeatmapLayer from "./heatmapLayer";
import "leaflet/dist/leaflet.css";
import Chart from "chart.js/auto";
import {
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { io } from "socket.io-client";

// Registre os elementos necessários para Bar e Pie
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  ChartDataLabels
);

const AttendanceDashboard = () => {
  const [attendances, setAttendances] = useState([]);
  const [filter, setFilter] = useState(null); // { type, value }

  useEffect(() => {
    // fetch initial data
    fetch("/api/attendances?limit=10000", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAttendances(data.attendances || []))
      .catch((err) => console.error("fetch attendances error:", err));

    // connect socket.io
    const socketUrl = window.location.origin; // same origin; adjust if backend is on different host
    const socket = io(socketUrl, {
      transports: ["websocket"],
      // if you need auth token on connect:
      // auth: { token: localStorage.getItem("token") }
    });

    const onCreated = (data) => {
      if (!data || !data._id) return;
      setAttendances((prev) => {
        const exists = prev.find((p) => String(p._id) === String(data._id));
        if (exists)
          return prev.map((p) =>
            String(p._id) === String(data._id) ? data : p
          );
        return [data, ...prev];
      });
    };

    const onUpdated = (data) => {
      if (!data || !data._id) return;
      setAttendances((prev) =>
        prev.map((p) => (String(p._id) === String(data._id) ? data : p))
      );
    };

    const onDeleted = (data) => {
      if (!data || !data._id) return;
      setAttendances((prev) =>
        prev.filter((p) => String(p._id) !== String(data._id))
      );
    };

    socket.on("attendanceCreated", onCreated);
    socket.on("attendanceUpdated", onUpdated);
    socket.on("attendanceDeleted", onDeleted);

    socket.on("connect_error", (err) => {
      console.warn("Socket connect_error:", err);
    });

    return () => {
      socket.off("attendanceCreated", onCreated);
      socket.off("attendanceUpdated", onUpdated);
      socket.off("attendanceDeleted", onDeleted);
      socket.disconnect();
    };
  }, []);

  // Helpers
  const filteredAttendances = filter
    ? attendances.filter((a) => a[filter.type] === filter.value)
    : attendances;

  const countBy = (field) =>
    filteredAttendances.reduce((acc, curr) => {
      const key = curr[field] || "Não informado";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const sumBy = (field) =>
    filteredAttendances.reduce((acc, curr) => {
      let val = curr[field];
      if (val && typeof val === "object" && val.$numberDecimal)
        val = Number(val.$numberDecimal);
      if (typeof val === "string") val = Number(val.replace(",", "."));
      if (!isNaN(val)) acc += Number(val);
      return acc;
    }, 0);

  // Totais
  const total = filteredAttendances.length;
  const totalLoss = sumBy("loss_estimation");
  const totalLoad = sumBy("load_value");
  const totalInsurance = sumBy("insurance_value");

  // Gráficos
  const statusCount = countBy("event_status");
  const statusLabels = Object.keys(statusCount);
  const statusData = Object.values(statusCount);

  const originStateCount = countBy("origin_state");
  const originStateLabels = Object.keys(originStateCount);
  const originStateData = Object.values(originStateCount);

  const cityCount = countBy("event_city");
  const sortedCities = Object.entries(cityCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const cityLabels = sortedCities.map(([city]) => city);
  const cityData = sortedCities.map(([, count]) => count);

  const shippingCompanyCount = countBy("shipping_company");
  const sortedCompanies = Object.entries(shippingCompanyCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const companyLabels = sortedCompanies.map(([c]) => c);
  const companyData = sortedCompanies.map(([, count]) => count);

  const eventNatureCount = countBy("event_nature");
  const sortedNatures = Object.entries(eventNatureCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const natureLabels = sortedNatures.map(([n]) => n);
  const natureData = sortedNatures.map(([, count]) => count);

  // Heatmap
  const heatPoints = filteredAttendances
    .filter(
      (a) =>
        a.latitude &&
        a.longitude &&
        !isNaN(Number(a.latitude)) &&
        !isNaN(Number(a.longitude))
    )
    .map((a) => [Number(a.latitude), Number(a.longitude), 1]);

  const mapCenter = [-14.235004, -51.92528];
  const mapZoom = 4;

  // Handlers para filtro cruzado em qualquer gráfico
  const onBarClick = (labels, type) => (evt, elems) => {
    if (elems.length > 0) {
      const idx = elems[0].index;
      const value = labels[idx];
      // Se já está filtrado por esse campo e valor, remove o filtro
      if (filter && filter.type === type && filter.value === value) {
        setFilter(null);
      } else {
        setFilter({ type, value });
      }
    }
  };
  const onPieClick = (labels, type) => (evt, elems) => {
    if (elems.length > 0) {
      const idx = elems[0].index;
      const value = labels[idx];
      if (filter && filter.type === type && filter.value === value) {
        setFilter(null);
      } else {
        setFilter({ type, value });
      }
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        anchor: "center",
        align: "center",
        font: { weight: "bold" },
      },
    },
  };

  return (
    <div>
      <h2 className="mb-4">Dashboard de Atendimentos</h2>
      <Row className="mb-4">
        <Col md={3} sm={6} xs={12}>
          <Card bg="primary" text="white" className="mb-2">
            <Card.Body>
              <Card.Title>Total de Atendimentos</Card.Title>
              <Card.Text style={{ fontSize: 28 }}>{total}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} xs={12}>
          <Card bg="success" text="white" className="mb-2">
            <Card.Body>
              <Card.Title>Valor Total da Carga</Card.Title>
              <Card.Text style={{ fontSize: 22 }}>
                {totalLoad.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} xs={12}>
          <Card bg="warning" text="dark" className="mb-2">
            <Card.Body>
              <Card.Title>Valor Total Segurado</Card.Title>
              <Card.Text style={{ fontSize: 22 }}>
                {totalInsurance.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} xs={12}>
          <Card bg="danger" text="white" className="mb-2">
            <Card.Body>
              <Card.Title>Estimativa Total de Prejuízo</Card.Title>
              <Card.Text style={{ fontSize: 22 }}>
                {totalLoss.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} xs={12}>
          <h5 className="mt-3">Atendimentos por Status</h5>
          <div style={{ width: "100%", height: 250 }}>
            <Bar
              data={{
                labels: statusLabels,
                datasets: [
                  {
                    label: "Quantidade",
                    data: statusData,
                    backgroundColor: "#007bff",
                  },
                ],
              }}
              options={{
                ...chartOptions,
                onClick: onBarClick(statusLabels, "event_status"),
              }}
            />
          </div>
        </Col>
        <Col md={6} xs={12}>
          <h5 className="mt-3">Atendimentos por Estado de Origem</h5>
          <div style={{ width: "100%", height: 250 }}>
            <Pie
              data={{
                labels: originStateLabels,
                datasets: [
                  {
                    label: "Origem",
                    data: originStateData,
                    backgroundColor: [
                      "#007bff",
                      "#28a745",
                      "#ffc107",
                      "#dc3545",
                      "#6f42c1",
                      "#17a2b8",
                      "#fd7e14",
                      "#20c997",
                      "#6610f2",
                      "#e83e8c",
                    ],
                  },
                ],
              }}
              options={{
                ...chartOptions,
                onClick: onPieClick(originStateLabels, "origin_state"),
              }}
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6} xs={12}>
          <h5 className="mt-4">Top 10 Cidades com Mais Atendimentos</h5>
          <div style={{ width: "100%", height: 250 }}>
            <Bar
              data={{
                labels: cityLabels,
                datasets: [
                  {
                    label: "Atendimentos",
                    data: cityData,
                    backgroundColor: "#20c997",
                  },
                ],
              }}
              options={{
                ...chartOptions,
                onClick: onBarClick(cityLabels, "event_city"),
              }}
            />
          </div>
        </Col>
        <Col md={6} xs={12}>
          <h5 className="mt-4">Top 10 Transportadoras</h5>
          <div style={{ width: "100%", height: 250 }}>
            <Bar
              data={{
                labels: companyLabels,
                datasets: [
                  {
                    label: "Atendimentos",
                    data: companyData,
                    backgroundColor: "#6610f2",
                  },
                ],
              }}
              options={{
                ...chartOptions,
                onClick: onBarClick(companyLabels, "shipping_company"),
              }}
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6} xs={12}>
          <h5 className="mt-4">Top 10 Naturezas do Evento</h5>
          <div style={{ width: "100%", height: 250 }}>
            <Bar
              data={{
                labels: natureLabels,
                datasets: [
                  {
                    label: "Atendimentos",
                    data: natureData,
                    backgroundColor: "#fd7e14",
                  },
                ],
              }}
              options={{
                ...chartOptions,
                onClick: onBarClick(natureLabels, "event_nature"),
              }}
            />
          </div>
        </Col>
        <Col md={6} xs={12}>
          <h5 className="mt-4">Mapa de Calor dos Atendimentos</h5>
          <div style={{ width: "100%", height: 300 }}>
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <HeatmapLayer points={heatPoints} radius={15} blur={25} max={1} />
            </MapContainer>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AttendanceDashboard;
