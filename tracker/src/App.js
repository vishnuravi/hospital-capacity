import Header from './components/Header';
import Footer from './components/Footer';
import CapacityTable from './components/CapacityTable';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Container>
        <Header />
        <CapacityTable />
        <Footer />
      </Container>
    </div>
  );
}

export default App;
