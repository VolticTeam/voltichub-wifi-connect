import React from 'react';
import logo from '../img/voltic.png';
import { Navbar, Provider, Container } from 'rendition';
import { NetworkInfoForm } from './NetworkInfoForm';
import { Notifications } from './Notifications';
import volticTheme from '../theme';

export interface NetworkInfo {
	ssid?: string;
	identity?: string;
	passphrase?: string;
	hidden?: boolean;
}

export interface Network {
	ssid: string;
	security: string;
}

const App = () => {
	const [attemptedConnect, setAttemptedConnect] = React.useState(false);
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [isFetchingNetworks, setIsFetchingNetworks] = React.useState(true);
	const [error, setError] = React.useState('');
	const [availableNetworks, setAvailableNetworks] = React.useState<Network[]>(
		[],
	);

	React.useEffect(() => {
		fetch('/networks')
			.then((data) => {
				if (data.status !== 200) {
					throw new Error(data.statusText);
				}

				return data.json();
			})
			.then(setAvailableNetworks)
			.catch((e: Error) => {
				setError(`No se pudieron cargar las redes Wi-Fi. ${e.message || e}`);
			})
			.finally(() => {
				setIsFetchingNetworks(false);
			});
	}, []);

	const onConnect = (data: NetworkInfo) => {
		setAttemptedConnect(false);
		setIsSubmitting(true);
		setError('');

		fetch('/connect', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((resp) => {
				if (resp.status === 400 && data.hidden) {
					throw new Error('Revisa el SSID y la contraseña de la red oculta.');
				}
				if (resp.status !== 200) {
					throw new Error(resp.statusText);
				}
				setAttemptedConnect(true);
			})
			.catch((e: Error) => {
				setError(`No se pudo confirmar el envío. ${e.message || e}`);
			})
			.finally(() => {
				setIsSubmitting(false);
			});
	};

	return (
		<Provider theme={volticTheme}>
			<Navbar
				style={{
					backgroundColor: '#fff',
					color: '#00364b',
					borderBottom: '1px solid #e2edf2',
				}}
				brand={
					<div className="portal-brand">
						<img
							src={logo}
							style={{ height: 40, width: 40, borderRadius: 10 }}
							alt="Voltic"
						/>
						<span>VolticHub Wi-Fi Connect</span>
					</div>
				}
			/>

			<main className="portal-main">
				<Container>
					<Notifications
						attemptedConnect={attemptedConnect}
						isSubmitting={isSubmitting}
						hasAvailableNetworks={
							isFetchingNetworks || availableNetworks.length > 0
						}
						error={error}
					/>
					<NetworkInfoForm
						availableNetworks={availableNetworks}
						isSubmitting={isSubmitting}
						onSubmit={onConnect}
					/>
				</Container>
			</main>
		</Provider>
	);
};

export default App;
