import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import { theme } from './theme/theme';
import { AppRoutes } from './routes/routes';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<AppRoutes />
				<ToastContainer />
			</Router>
		</ThemeProvider>
	);
};

export default App;
