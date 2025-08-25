// src/pages/Home.tsx
import React, { useState } from 'react';
import { Container } from '@mui/material';
import Breadcrumbs from '../../components/Breadcrumb/Breadcrumb'
import SearchandAddButton from '../../components/SearchandAddButton/SearchandAddButton';
import AirportTableData from '../../components/AirportTableData/AirportTableData';

const Home: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const handleSaveAirport = (data: any) => {
        console.log("New airport data:", data);
    };
    return (
        <Container sx={{ mt: 2 }}>
            <Breadcrumbs />
            <SearchandAddButton onSearch={setSearchTerm} onSave={handleSaveAirport} />
             <AirportTableData searchTerm={searchTerm} />
        </Container>
    );
};

export default Home;
