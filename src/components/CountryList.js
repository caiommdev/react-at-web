import styled from "styled-components";

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
padding: 10px;
cursor: pointer;
background-color: ${(props) =>
  props.isHighlighted ? "#d3d3d3" : "transparent"};
&:hover {
  background-color: #e0e0e0;
}
  }
`;

const CountryList = ({ countries, onCountryClick, highlightedCountry }) => {
  return (
    <List>
      {countries.map((country) => (
        <ListItem
          key={country.name.common}
          onClick={() => onCountryClick(country)}
          isHighlighted={highlightedCountry === country.name.common}
        >
          {country.name.common}
        </ListItem>
      ))}
    </List>
  );
};

export default CountryList;
