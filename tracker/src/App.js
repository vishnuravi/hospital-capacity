import CapacityTable from './components/CapacityTable';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Container>
        <h1 className="text-center my-4">Hospital Capacity Tracker</h1>
        <p className="text-center">created by <a href="https://vishnu.io" target="_blank">Vishnu Ravi</a> 👨‍⚕️ with data <a href="https://healthdata.gov/dataset/covid-19-reported-patient-impact-and-hospital-capacity-facility" target="_blank">from healthdata.gov</a></p>
        <CapacityTable />
      </Container>
    </div>
  );
}

export default App;
