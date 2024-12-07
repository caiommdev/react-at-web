import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 16px;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 5px 5px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: flex-start;
  &:hover {
    background-color: #0056b3;
  }
`;
const AgendaForm = ({ authorities, agendas, setAgendas }) => {
  const [formData, setFormData] = useState({
    authority: "",
    country: "", // Adicionando o país no estado
    date: "",
    time: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.authority) {
      newErrors.authority = "Selecione uma autoridade.";
    }

    if (!formData.date) {
      newErrors.date = "Selecione uma data.";
    } else if (
      formData.date !== "2025-11-01" &&
      formData.date !== "2025-11-10"
    ) {
      newErrors.date =
        "Selecione uma data válida (18 ou 19 de novembro de 2025).";
    }

    if (!formData.time) {
      newErrors.time = "Selecione um horário.";
    } else {
      const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
      const conflict = agendas.some((agenda) => {
        const agendaDateTime = new Date(`${agenda.date}T${agenda.time}`);
        const diff = Math.abs(selectedDateTime - agendaDateTime) / (1000 * 60);
        return diff < 15;
      });

      if (conflict) {
        newErrors.time = "Conflito de horário. Selecione um horário diferente.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setAgendas((prevAgendas) => [...prevAgendas, { ...formData }]);

    navigate("/agendas");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "authority") {
      const selectedAuthority = authorities.find(
        (authority) => authority.name === value
      );
      if (selectedAuthority) {
        setFormData((prevData) => ({
          ...prevData,
          role: selectedAuthority.role,
          country: selectedAuthority.country, // Salvando o país
        }));
      }
    }
  };

  return (
    <FormContainer>
      <Title>Cadastrar Apresentação</Title>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Autoridade:</Label>
          <Select
            name="authority"
            value={formData.authority}
            onChange={handleChange}
          >
            <option value="">Selecione uma autoridade</option>
            {authorities.map((authority, index) => (
              <option key={index} value={authority.name}>
                {authority.country}/{authority.name}/{authority.role}
              </option>
            ))}
          </Select>
          {errors.authority && <ErrorText>{errors.authority}</ErrorText>}
          <Button onClick={() => navigate("/authorities")}>
            Cadastrar Autoridade
          </Button>
        </FormGroup>

        <FormGroup>
          <Label>Data:</Label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min="2025-11-01"
            max="2025-11-10"
          />
          {errors.date && <ErrorText>{errors.date}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label>Hora:</Label>
          <Input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
          {errors.time && <ErrorText>{errors.time}</ErrorText>}
        </FormGroup>

        <SubmitButton type="submit">Cadastrar</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default AgendaForm;
