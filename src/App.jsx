// App.jsx
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes'; // move the main logic here
import './App.css';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
