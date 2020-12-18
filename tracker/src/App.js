import Header from './components/Header';
import CapacityTable from './components/CapacityTable';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Container>
        <Header />
        <CapacityTable />
      </Container>
    </div>
  );
}

export default App;
