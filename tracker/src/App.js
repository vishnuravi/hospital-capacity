import CapacityTable from './components/CapacityTable';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Container>
        <h1 className="display-4 text-center mb-4">US Hospital Capacity Tracker</h1>
        <CapacityTable />
      </Container>
    </div>
  );
}

export default App;
