import { Route, Routes } from "react-router-dom";
import Clients from "./routes/clients";
import Commands from "./routes/commands";


const ClientComponent: React.FC = () => {
 
  return (
    
    <Routes>
    <Route path="/" element={ <Clients/> } />
    <Route path="/clients" element={ <Clients/> } />
    <Route path="Commands" element={ <Commands/> } />
  </Routes>
  );
};

export default ClientComponent;
