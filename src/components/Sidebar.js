import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import {
  getCachedCountries,
  fetchAndCacheCountries,
} from "../services/CountryService";

const SidebarContainer = styled.aside`
  width: 250px;
  border-right: 1px solid #ccc;
  padding: 20px;
  background-color: #f4f4f4;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Footer = styled.div`
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #ccc;
`;

const SidebarTitle = styled.h3`
  margin-bottom: 20px;
  font-size: 1.5em;
  color: #333;
`;

const CountryItem = styled.div`
  padding: 10px;
  margin: 5px 0;
  background-color: ${({ isSelected }) => (isSelected ? "#d3e3fc" : "#fff")};
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #e0e8f6;
  }
`;

const RegionFilterContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
`;

const AddAgendaLink = styled(Link)`
  display: block;
  margin-top: 20px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  text-align: center;
  border-radius: 5px;
  text-decoration: none;
  &:hover {
    background-color: #0056b3;
  }
`;

const Sidebar = ({ onSelectCountry, g20Countries }) => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadCountries = async () => {
      const cachedCountries = getCachedCountries();
      if (cachedCountries) {
        setCountries(cachedCountries);
        setFilteredCountries(cachedCountries);
        setLoading(false);
      } else {
        const fetchedCountries = await fetchAndCacheCountries(g20Countries);
        setCountries(fetchedCountries);
        setFilteredCountries(fetchedCountries);
        setLoading(false);
      }
    };

    loadCountries();
  }, [g20Countries]);

  const regions = Array.from(
    new Set(countries.map((country) => country.region))
  );

  const handleRegionChange = (region) => {
    const isSelected = selectedRegions.includes(region);
    const updatedRegions = isSelected
      ? selectedRegions.filter((r) => r !== region)
      : [...selectedRegions, region];

    setSelectedRegions(updatedRegions);
    filterCountries(searchQuery, updatedRegions);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterCountries(query, selectedRegions);
  };

  const filterCountries = (query, regions) => {
    const filtered = countries.filter((country) => {
      const matchesName = country.name.common.toLowerCase().includes(query);
      const matchesRegion =
        regions.length === 0 || regions.includes(country.region);

      return matchesName && matchesRegion;
    });

    setFilteredCountries(filtered);
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    onSelectCountry(country);
    navigate("/countries");
  };

  return (
    <SidebarContainer>
      <div>
        <SidebarTitle>Países do G20</SidebarTitle>

        <SearchInput
          type="text"
          placeholder="Pesquisar país..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <RegionFilterContainer>
          <h4>Filtrar por Região</h4>
          {regions.map((region) => (
            <div key={region}>
              <input
                type="checkbox"
                id={region}
                value={region}
                checked={selectedRegions.includes(region)}
                onChange={() => handleRegionChange(region)}
              />
              <label htmlFor={region}>{region}</label>
            </div>
          ))}
        </RegionFilterContainer>
      </div>

      <ContentWrapper>
        {loading ? (
          <p>Carregando...</p>
        ) : filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <CountryItem
              key={country.name.common}
              isSelected={selectedCountry === country}
              onClick={() => handleCountryClick(country)}
            >
              {country.name.common}
            </CountryItem>
          ))
        ) : (
          <p>Nenhum país encontrado.</p>
        )}
      </ContentWrapper>

      <Footer>
        <AddAgendaLink to="/agendas">Compromisso</AddAgendaLink>
        <AddAgendaLink to="/agenda-form">Cadastrar Compromisso</AddAgendaLink>
      </Footer>
    </SidebarContainer>
  );
};

export default Sidebar;
