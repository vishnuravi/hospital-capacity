import CapacityTable from './components/CapacityTable';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Container>
        <h2 className="text-center mt-2 mb-4">Hospital Capacity Tracker</h2>
        <p className="text-center">📊 Data from <a href="https://healthdata.gov/dataset/covid-19-reported-patient-impact-and-hospital-capacity-facility" target="_blank">healthdata.gov</a>. Created by <a href="https://vishnu.io" target="_blank">Vishnu Ravi</a> 👨‍⚕️.</p>
        <CapacityTable />
      </Container>
    </div>
  );
}

export default App;
