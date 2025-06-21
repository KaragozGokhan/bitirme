import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import { theme } from './theme/theme';
import { AppRoutes } from './routes/routes';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './infrastructure/contexts/CartContext';
import { MyBooksProvider } from './infrastructure/contexts/MyBooksContext';
import { AudioPlayerProvider } from './infrastructure/contexts/AudioPlayerContext';
import { ReviewProvider } from './infrastructure/contexts/ReviewContext';

const App: React.FC = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<CartProvider>
					<MyBooksProvider>
						<AudioPlayerProvider>
							<ReviewProvider>
								<AppRoutes />
							</ReviewProvider>
						</AudioPlayerProvider>
					</MyBooksProvider>
				</CartProvider>
				<ToastContainer />
			</Router>
		</ThemeProvider>
	);
};

export default App;
