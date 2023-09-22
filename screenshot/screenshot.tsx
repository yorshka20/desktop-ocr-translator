import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';

import README from '@renderer/pages/README';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Router>
    <App />
  </Router>
);

function App() {
  return (
    <div>
      screen shot page
      <README />
    </div>
  );
}
