import type { JSONSchema7 as JSONSchema } from 'json-schema';
import * as React from 'react';
import type { RenditionUiSchema } from 'rendition';
import { Flex, Form, Heading } from 'rendition';
import { ConnectionSteps } from './ConnectionSteps';
import type { Network, NetworkInfo } from './App';

const getSchema = (availableNetworks: Network[]): JSONSchema => ({
	type: 'object',
	properties: {
		ssid: {
			title: 'Red Wi-Fi',
			type: 'string',
			default: availableNetworks[0]?.ssid,
			oneOf: availableNetworks.map((network) => ({
				const: network.ssid,
				title: network.ssid,
			})),
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
		},
	},
	required: ['ssid'],
});

const getUiSchema = (isEnterprise: boolean): RenditionUiSchema => ({
	ssid: {
		'ui:placeholder': 'Selecciona una red Wi-Fi',
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

			<Form
				width={['100%', '80%', '60%', '40%']}
				onFormChange={({ formData }) => {
					setData(formData);
				}}
				onFormSubmit={({ formData }) => {
					onSubmit(formData);
				}}
				value={data}
				schema={getSchema(availableNetworks)}
				uiSchema={getUiSchema(isSelectedNetworkEnterprise)}
				submitButtonProps={{
					width: '60%',
					mx: '20%',
					mt: 3,
					disabled: availableNetworks.length <= 0 || isSubmitting,
				}}
				submitButtonText={'Conectar'}
			/>
		</Flex>
	);
};
