import * as React from 'react';
import { Txt, Alert } from 'rendition';

export const Notifications = ({
	hasAvailableNetworks,
	attemptedConnect,
	isSubmitting,
	error,
}: {
	hasAvailableNetworks: boolean;
	attemptedConnect: boolean;
	isSubmitting: boolean;
	error: string;
}) => {
	return (
		<>
			{isSubmitting && (
				<Alert m={2} info>
					<Txt.span>Enviando los datos de la red Wi-Fi al hub...</Txt.span>
				</Alert>
			)}
			{attemptedConnect && (
				<Alert m={2} info>
					<Txt.span>Datos recibidos. Comprobando la conexión... </Txt.span>
					<Txt.span>
						La red temporal se desconectará mientras el hub comprueba la
						contraseña y el acceso a Internet. Si el hotspot vuelve a aparecer,
						la conexión no se ha completado: vuelve a abrir esta página y revisa
						la contraseña y la red seleccionada.
					</Txt.span>
				</Alert>
			)}
			{!hasAvailableNetworks && (
				<Alert m={2} warning>
					<Txt.span>No hay redes Wi-Fi disponibles.&nbsp;</Txt.span>
					<Txt.span>
						Comprueba que haya una red al alcance y reinicia el hub.
					</Txt.span>
				</Alert>
			)}
			{!!error && (
				<Alert m={2} danger>
					<Txt.span>{error}</Txt.span>
				</Alert>
			)}
		</>
	);
};
