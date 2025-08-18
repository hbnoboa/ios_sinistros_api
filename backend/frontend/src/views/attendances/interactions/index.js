import React, { useEffect, useState, useCallback } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import { useSocket } from "../../../contexts/SocketContext";
import { useAuthFetch } from "../../../hooks/useAuthFetch";

const InteractionsIndex = ({ attendanceId }) => {
  const [interactions, setInteractions] = useState([]);
  const [newInteraction, setNewInteraction] = useState("");
  const socket = useSocket();
  const authFetch = useAuthFetch();

  // Função para buscar as interações (useCallback para evitar warning do React)
  const fetchInteractions = useCallback(() => {
    return authFetch(`/api/attendances/${attendanceId}/interactions`)
      .then((res) => res.json())
      .then((data) => setInteractions(data.interactions || []))
      .catch(() => setInteractions([]));
  }, [attendanceId, authFetch]);

  useEffect(() => {
    fetchInteractions();

    if (!socket) return;

    const handleCreated = (data) => {
      if (data.attendance === attendanceId) {
        fetchInteractions();
      }
    };

    socket.on("interactionCreated", handleCreated);

    return () => {
      socket.off("interactionCreated", handleCreated);
    };
  }, [attendanceId, fetchInteractions, socket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newInteraction.trim()) return;
    const res = await authFetch(
      `/api/attendances/${attendanceId}/interactions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: newInteraction }),
      }
    );
    if (res.ok) {
      setNewInteraction("");
      // Não precisa chamar fetchInteractions aqui, pois o socket fará isso para todos
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit} className="mb-3">
        <Form.Group>
          <Form.Label>Nova Interação</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={newInteraction}
            onChange={(e) => setNewInteraction(e.target.value)}
            placeholder="Digite uma nova interação..."
          />
        </Form.Group>
        <Button type="submit" className="mt-2">
          Adicionar
        </Button>
      </Form>
      <ListGroup>
        {interactions.map((interaction, idx) => (
          <ListGroup.Item key={interaction?._id || idx}>
            <div style={{ fontSize: 13, color: "#555" }}>
              {interaction?.description || ""}
              <div style={{ fontSize: 11, color: "#888" }}>
                {interaction?.createdAt
                  ? new Date(interaction.createdAt).toLocaleString("pt-BR")
                  : ""}
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default InteractionsIndex;
