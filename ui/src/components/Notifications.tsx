import * as React from 'react';
import { Txt, Alert } from 'rendition';

export const Notifications = ({
	hasAvailableNetworks,
	attemptedConnect,
	error,
}: {
	hasAvailableNetworks: boolean;
	attemptedConnect: boolean;
	error: string;
}) => {
	return (
		<>
			{attemptedConnect && (
				<Alert m={2} info>
					<Txt.span>Conectando el hub... </Txt.span>
					<Txt.span>
						Espera a que se conecte a la red Wi-Fi y obtenga Internet. Si no lo
						consigue, el hotspot volverá a aparecer en unos minutos; entonces
						podrás recargar esta página e intentarlo otra vez.
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
