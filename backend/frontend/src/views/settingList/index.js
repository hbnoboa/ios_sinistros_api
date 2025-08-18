import React, { useEffect, useState } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";

const fields = [
  { key: "event_status", label: "Status do Evento" },
  { key: "operation_type", label: "Tipo de Operação" },
  { key: "regulatory", label: "Reguladora" },
  { key: "event_nature", label: "Natureza do Evento" },
  { key: "event_nature_type", label: "Tipo de Natureza do Evento" },
  { key: "transported_load", label: "Carga Transportada" },
];

const apiUrl = "/api/settingLists";

const SettingListIndex = () => {
  const [lists, setLists] = useState({});
  const [newValues, setNewValues] = useState({});
  const [editing, setEditing] = useState({});
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setLists(data || {}));
  }, []);

  const handleAdd = async (key) => {
    const value = (newValues[key] || "").trim();
    if (!value) return;
    await fetch(`${apiUrl}/${key}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ value }),
    });
    // Atualiza a lista após adicionar
    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setLists(data || {}));
    setNewValues((prev) => ({ ...prev, [key]: "" }));
  };

  const handleRemove = async (key, value) => {
    await fetch(`${apiUrl}/${key}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ value }),
    });
    // Atualiza a lista após remover
    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setLists(data || {}));
  };

  // Função para iniciar edição
  const startEdit = (field, idx, value) => {
    setEditing({ field, idx });
    setEditValue(value);
  };

  // Função para salvar edição
  const saveEdit = async (field, oldValue) => {
    if (!editValue.trim() || editValue === oldValue) {
      setEditing({});
      return;
    }
    await fetch(`${apiUrl}/${field}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ oldValue, newValue: editValue }),
    });
    // Atualiza a lista
    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setLists(data || {}));
    setEditing({});
    setEditValue("");
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Listas de Seleção</h2>
      <Table bordered>
        <thead>
          <tr>
            <th>Campo</th>
            <th>Valores</th>
            <th>Adicionar Valor</th>
          </tr>
        </thead>
        <tbody>
          {fields.map(({ key, label }) => (
            <tr key={key}>
              <td>{label}</td>
              <td>
                {(lists[key] || []).map((item, idx) =>
                  editing.field === key && editing.idx === idx ? (
                    <span
                      key={idx}
                      style={{ display: "inline-block", marginRight: 8 }}
                    >
                      <Form.Control
                        size="sm"
                        type="text"
                        value={editValue}
                        autoFocus
                        style={{ width: 120, display: "inline-block" }}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                      <Button
                        size="sm"
                        variant="primary"
                        style={{
                          marginLeft: 4,
                          fontSize: 12,
                          padding: "0 8px",
                        }}
                        onClick={() => saveEdit(key, item)}
                      >
                        Salvar
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        style={{
                          marginLeft: 2,
                          fontSize: 12,
                          padding: "0 8px",
                        }}
                        onClick={() => setEditing({})}
                      >
                        Cancelar
                      </Button>
                    </span>
                  ) : (
                    <span
                      key={idx}
                      style={{ display: "inline-block", marginRight: 8 }}
                    >
                      {item}{" "}
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => startEdit(key, idx, item)}
                        style={{
                          padding: "0 6px",
                          fontSize: 12,
                          marginRight: 2,
                        }}
                      >
                        ✎
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleRemove(key, item)}
                        style={{ padding: "0 6px", fontSize: 12 }}
                      >
                        x
                      </Button>
                    </span>
                  )
                )}
              </td>
              <td>
                <InputGroup>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Novo valor"
                    value={newValues[key] || ""}
                    style={{ minWidth: 180, maxWidth: 180 }}
                    onChange={(e) =>
                      setNewValues((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                  />
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleAdd(key)}
                  >
                    Adicionar
                  </Button>
                </InputGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SettingListIndex;
