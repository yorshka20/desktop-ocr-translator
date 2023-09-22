import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Router>
    <App />
  </Router>
);

function App() {
  return <div>screen short</div>;
}
