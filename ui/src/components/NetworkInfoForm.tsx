import type { JSONSchema7 as JSONSchema } from 'json-schema';
import * as React from 'react';
import type { RenditionUiSchema } from 'rendition';
import { Flex, Form, Heading } from 'rendition';
import { ConnectionSteps } from './ConnectionSteps';
import type { Network, NetworkInfo } from './App';

const getSchema = (
	availableNetworks: Network[],
	manual: boolean,
): JSONSchema => ({
	type: 'object',
	properties: {
		ssid: {
			title: 'Red Wi-Fi',
			type: 'string',
			...(manual
				? { minLength: 1, maxLength: 32 }
				: {
						default: availableNetworks[0]?.ssid,
						oneOf: availableNetworks.map((network) => ({
							const: network.ssid,
							title: network.ssid,
						})),
					}),
		},
		identity: {
			title: 'Usuario',
			type: 'string',
			default: '',
		},
		passphrase: {
			title: 'Contraseña',
			type: 'string',
			default: '',
			...(manual ? { minLength: 8, maxLength: 64 } : {}),
		},
	},
	required: manual ? ['ssid', 'passphrase'] : ['ssid'],
});

const getUiSchema = (
	isEnterprise: boolean,
	manual: boolean,
): RenditionUiSchema => ({
	ssid: {
		'ui:placeholder': manual
			? 'Escribe el SSID de la red oculta'
			: 'Selecciona una red Wi-Fi',
		'ui:options': {
			emphasized: true,
		},
	},
	identity: {
		'ui:options': {
			emphasized: true,
		},
		'ui:widget': !isEnterprise ? 'hidden' : undefined,
	},
	passphrase: {
		'ui:widget': 'password',
		'ui:options': {
			emphasized: true,
		},
	},
});

const isEnterpriseNetwork = (
	networks: Network[],
	selectedNetworkSsid?: string,
) => {
	return networks.some(
		(network) =>
			network.ssid === selectedNetworkSsid && network.security === 'enterprise',
	);
};

interface NetworkInfoFormProps {
	availableNetworks: Network[];
	isSubmitting: boolean;
	onSubmit: (data: NetworkInfo) => void;
}

export const NetworkInfoForm = ({
	availableNetworks,
	isSubmitting,
	onSubmit,
}: NetworkInfoFormProps) => {
	const [data, setData] = React.useState<NetworkInfo>({});
	const [manual, setManual] = React.useState(false);
	const [validationError, setValidationError] = React.useState('');

	const isSelectedNetworkEnterprise = isEnterpriseNetwork(
		availableNetworks,
		data.ssid,
	);

	return (
		<Flex
			className="portal-card"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
		>
			<Heading.h3 align="center" mb={3}>
				Conecta tu VolticHub a la red Wi-Fi
			</Heading.h3>
			<ConnectionSteps />
			<label>
				<input
					type="checkbox"
					checked={manual}
					onChange={(event) => {
						setManual(event.target.checked);
						setData({ ...data, ssid: '' });
						setValidationError('');
					}}
				/>{' '}
				Introducir SSID manualmente
			</label>
			{validationError && <p role="alert">{validationError}</p>}

			<Form
				width={['100%', '80%', '60%', '40%']}
				onFormChange={({ formData }) => {
					setData(formData);
				}}
				onFormSubmit={({ formData }) => {
					const ssidBytes = new Blob([formData.ssid || '']).size;
					if (manual && (ssidBytes < 1 || ssidBytes > 32)) {
						setValidationError('El SSID debe tener entre 1 y 32 bytes.');
						return;
					}
					setValidationError('');
					onSubmit({ ...formData, hidden: manual });
				}}
				value={data}
				schema={getSchema(availableNetworks, manual)}
				uiSchema={getUiSchema(isSelectedNetworkEnterprise, manual)}
				submitButtonProps={{
					width: '60%',
					mx: '20%',
					mt: 3,
					disabled: (!manual && availableNetworks.length <= 0) || isSubmitting,
				}}
				submitButtonText={'Conectar'}
			/>
		</Flex>
	);
};
