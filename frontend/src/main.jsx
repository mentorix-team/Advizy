import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import store from './Redux/store.js';
import ReactGA from 'react-ga4';
import App from './App.jsx';
import './index.css';

ReactGA.initialize('G-M94GY5XWSF'); // Replace with your real Measurement ID
ReactGA.send('pageview'); // Sends first page view

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </Provider>
);
