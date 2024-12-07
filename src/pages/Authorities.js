import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getCountryByName } from "../services/CountryService";

const roles = [
  "Chefe de Estado",
  "Ministro de Finança",
  "Presidente de Banco Central",
];

const validateForm = (formData, authorities, tlds) => {
  const newErrors = {};
  if (!formData.name || formData.name.split(" ").length < 2) {
    newErrors.name = "O nome deve ser completo (nome e sobrenome).";
  }

  if (!formData.country) {
    newErrors.country = "Selecione um país.";
  }

  if (!formData.role) {
    newErrors.role = "Selecione um cargo.";
  } else if (
    authorities.some(
      (authority) =>
        authority.country === formData.country &&
        authority.role === formData.role
    )
  ) {
    newErrors.role = "Já existe uma autoridade cadastrada para este cargo.";
  }

  if (!formData.email) {
    newErrors.email = "Informe um email.";
  } else {
    const selectedTld = tlds[formData.country];
    const emailDomain = formData.email.split("@")[1];
    if (!emailDomain || !emailDomain.endsWith(selectedTld)) {
      newErrors.email = `O email deve ter o domínio do país (${selectedTld}).`;
    }
  }

  return newErrors;
};

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 40px auto;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-family: "Arial", sans-serif;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #555;
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const ErrorMessage = styled.p`
  font-size: 0.9rem;
  color: red;
  margin-top: 5px;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: center;
  &:hover {
    background-color: #0056b3;
  }
`;

const Authorities = ({
  g20Countries,
  tlds,
  authorities,
  setAuthorities,
  onSelectCountry,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    role: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const setSelectCountry = async (countryName) => {
    const country = await getCountryByName(countryName);
    onSelectCountry(country);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData, authorities, tlds);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setAuthorities((prevAuthorities) => [...prevAuthorities, { ...formData }]);
    setSelectCountry(formData.country);

    navigate(`/countries`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Container>
      <Title>Cadastrar Autoridade</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Nome completo:</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: João da Silva"
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>País representado:</Label>
          <Select
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">Selecione um país</option>
            {g20Countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </Select>
          {errors.country && <ErrorMessage>{errors.country}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Cargo/Função:</Label>
          <Select name="role" value={formData.role} onChange={handleChange}>
            <option value="">Selecione um cargo</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
          {errors.role && <ErrorMessage>{errors.role}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Email:</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ex: autoridade@dominio.sa"
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormGroup>

        <Button type="submit">Cadastrar</Button>
      </Form>
    </Container>
  );
};

Authorities.propTypes = {
  g20Countries: PropTypes.arrayOf(PropTypes.string).isRequired,
  tlds: PropTypes.objectOf(PropTypes.string).isRequired,
  authorities: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      country: PropTypes.string,
      role: PropTypes.string,
      email: PropTypes.string,
    })
  ).isRequired,
  setAuthorities: PropTypes.func.isRequired,
};

export default Authorities;
