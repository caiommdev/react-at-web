import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
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

const AgendaItem = styled.li`
  font-size: 16px;
  margin-bottom: 10px;
  color: #555;
`;

const Agendas = ({ agendas }) => {
  const sortedAgendas = [...agendas].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA - dateB;
  });

  return (
    <Container>
      <Title>Lista de Apresentações</Title>
      {sortedAgendas.length > 0 ? (
        <ul>
          {sortedAgendas.map((agenda, index) => (
            <AgendaItem key={index}>
              {agenda.date} {agenda.time} - {agenda.authority} ({agenda.country}
              ) ({agenda.role})
            </AgendaItem>
          ))}
        </ul>
      ) : (
        <p>Nenhuma apresentação cadastrada.</p>
      )}
    </Container>
  );
};

Agendas.propTypes = {
  agendas: PropTypes.arrayOf(
    PropTypes.shape({
      authority: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Agendas;
