import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { NetworkInfoForm } from './NetworkInfoForm';
import { Provider } from 'rendition';
import volticTheme from '../theme';

it('submits a manual SSID when no networks are visible', async () => {
	const root = document.createElement('div');
	document.body.appendChild(root);
	const onSubmit = jest.fn();

	await act(async () => {
		ReactDOM.render(
			<Provider theme={volticTheme}>
				<NetworkInfoForm availableNetworks={[]} isSubmitting={false} onSubmit={onSubmit} />
			</Provider>,
			root,
		);
	});

	const manual = [...root.querySelectorAll('label')].find((label) =>
		label.textContent.includes('Introducir SSID manualmente'),
	);
	expect(manual).toBeTruthy();
	act(() => manual.querySelector('input').click());
	const ssid = root.querySelector('#root_ssid');
	expect(ssid).toBeTruthy();
	act(() => {
		Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(ssid, 'Hotel oculto');
		ssid.dispatchEvent(new Event('input', { bubbles: true }));
	});
	const passphrase = root.querySelector('#root_passphrase');
	act(() => {
		Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(passphrase, 'testpass123');
		passphrase.dispatchEvent(new Event('input', { bubbles: true }));
	});
	act(() => root.querySelector('button[type="submit"]').click());
	expect(onSubmit).toHaveBeenCalledWith(
		expect.objectContaining({ ssid: 'Hotel oculto', identity: '', passphrase: 'testpass123', hidden: true }),
	);
	ReactDOM.unmountComponentAtNode(root);
	root.remove();
});

it('keeps the scanned-network submission unchanged', async () => {
	const root = document.createElement('div');
	document.body.appendChild(root);
	const onSubmit = jest.fn();
	await act(async () => {
		ReactDOM.render(
			<Provider theme={volticTheme}>
				<NetworkInfoForm
					availableNetworks={[{ ssid: 'Hotel visible', security: 'wpa' }]}
					isSubmitting={false}
					onSubmit={onSubmit}
				/>
			</Provider>,
			root,
		);
	});
	act(() => root.querySelector('button[type="submit"]').click());
	expect(onSubmit).toHaveBeenCalledWith(
		expect.objectContaining({ ssid: 'Hotel visible', hidden: false }),
	);
	ReactDOM.unmountComponentAtNode(root);
	root.remove();
});

it('rejects a manual SSID longer than 32 UTF-8 bytes', async () => {
	const root = document.createElement('div');
	document.body.appendChild(root);
	const onSubmit = jest.fn();
	await act(async () => {
		ReactDOM.render(
			<Provider theme={volticTheme}>
				<NetworkInfoForm availableNetworks={[]} isSubmitting={false} onSubmit={onSubmit} />
			</Provider>,
			root,
		);
	});
	act(() => root.querySelector('input[type="checkbox"]').click());
	const ssid = root.querySelector('#root_ssid');
	act(() => {
		Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(ssid, 'é'.repeat(17));
		ssid.dispatchEvent(new Event('input', { bubbles: true }));
	});
	const passphrase = root.querySelector('#root_passphrase');
	act(() => {
		Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(passphrase, 'testpass123');
		passphrase.dispatchEvent(new Event('input', { bubbles: true }));
	});
	act(() => root.querySelector('button[type="submit"]').click());
	expect(onSubmit).not.toHaveBeenCalled();
	expect(root.textContent).toContain('El SSID debe tener entre 1 y 32 bytes');
	ReactDOM.unmountComponentAtNode(root);
	root.remove();
});
