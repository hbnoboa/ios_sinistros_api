import React, { useEffect, useState } from "react";
import { Table, Button, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSocket } from "../../contexts/SocketContext";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import { generateAttendancePDF } from "../../components/attendancePDF";
import "jspdf-autotable";

const AttendanceIndex = () => {
  const [attendances, setAttendances] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(10); // Itens por página
  const authFetch = useAuthFetch();
  const socket = useSocket();

  // Fetch attendances with pagination
  useEffect(() => {
    authFetch(`/api/attendances?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setAttendances(data.attendances || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      });
  }, [authFetch, page, limit]);

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    const handleCreated = () => setPage(1); // Volta para a primeira página ao criar
    const handleUpdated = (attendance) => {
      setAttendances((prev) =>
        prev.map((a) => (a._id === attendance._id ? attendance : a))
      );
    };
    const handleDeleted = (attendance) => {
      setAttendances((prev) => prev.filter((a) => a._id !== attendance._id));
      setTotal((prev) => prev - 1);
    };

    socket.on("attendanceCreated", handleCreated);
    socket.on("attendanceUpdated", handleUpdated);
    socket.on("attendanceDeleted", handleDeleted);

    return () => {
      socket.off("attendanceCreated", handleCreated);
      socket.off("attendanceUpdated", handleUpdated);
      socket.off("attendanceDeleted", handleDeleted);
    };
  }, [socket]); // <-- added socket here

  // Gera botões de página próximos da página atual
  const renderPagination = () => {
    const items = [];
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(pages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    items.push(
      <Pagination.Prev
        key="prev"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      />
    );

    for (let p = start; p <= end; p++) {
      items.push(
        <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>
          {p}
        </Pagination.Item>
      );
    }

    items.push(
      <Pagination.Next
        key="next"
        disabled={page === pages}
        onClick={() => setPage(page + 1)}
      />
    );

    return items;
  };

  return (
    <div>
      <h2>Atendimentos</h2>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button as={Link} to="/attendances/new">
          Novo Atendimento
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Segurado</th>
            <th>Data Atendimento</th>
            <th>Status</th>
            <th>Carga Transportada</th>
            <th>Natureza do Evento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((attendance) => (
            <tr key={attendance._id}>
              <td>
                <Link to={`/attendances/${attendance._id}`}>
                  {attendance.insured_company}
                </Link>
              </td>
              <td>
                {attendance.attendance_date
                  ? new Date(attendance.attendance_date).toLocaleString("pt-BR")
                  : ""}
              </td>
              <td>{attendance.event_status}</td>
              <td>{attendance.transported_load}</td>
              <td>{attendance.event_nature_type}</td>
              <td>
                <Button
                  as={Link}
                  to={`/attendances/${attendance._id}/edit`}
                  size="sm"
                  variant="warning"
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  as={Link}
                  to={`/attendances/${attendance._id}`}
                  size="sm"
                  variant="info"
                  className="me-2"
                >
                  Visualizar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  className="me-2"
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Deseja realmente excluir este atendimento?"
                      )
                    ) {
                      await authFetch(`/api/attendances/${attendance._id}`, {
                        method: "DELETE",
                      });
                      setAttendances((prev) =>
                        prev.filter((a) => a._id !== attendance._id)
                      );
                      setTotal((prev) => prev - 1);
                    }
                  }}
                >
                  Excluir
                </Button>
                <Button
                  size="sm"
                  variant="info"
                  className="me-2"
                  onClick={async () => {
                    const headers = {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    };

                    // Busca o atendimento
                    const resAttendance = await fetch(
                      `/api/attendances/${attendance._id}`,
                      { headers }
                    );
                    const dataAttendance = await resAttendance.json();
                    const att = dataAttendance.data?.attendance;

                    // Busca reguladores
                    const resReg = await fetch(
                      `/api/attendances/${attendance._id}/regulators`,
                      { headers }
                    );
                    const dataReg = await resReg.json();
                    const regulators = dataReg.regulators || [];

                    // Busca vítimas
                    const resVict = await fetch(
                      `/api/attendances/${attendance._id}/victims`,
                      { headers }
                    );
                    const dataVict = await resVict.json();
                    const victims = dataVict.victims || [];

                    // Busca interações
                    const resInt = await fetch(
                      `/api/attendances/${attendance._id}/interactions`,
                      { headers }
                    );
                    const dataInt = await resInt.json();
                    const interactions = dataInt.interactions || [];

                    if (att) {
                      generateAttendancePDF(
                        att,
                        regulators,
                        victims,
                        interactions
                      );
                    } else {
                      alert(
                        "Não foi possível gerar o PDF: dados do atendimento não encontrados."
                      );
                    }
                  }}
                >
                  PDF
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between align-items-center">
        <Pagination>{renderPagination()}</Pagination>
        <span>
          <strong>{total} itens</strong>
        </span>
      </div>
    </div>
  );
};

export default AttendanceIndex;
