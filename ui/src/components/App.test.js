import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';

jest.mock('rendition', () => {
	const React = require('react');
	return {
		Provider: ({ children }) => children,
		Navbar: () => null,
		Container: ({ children }) => children,
		Alert: ({ children }) => React.createElement('div', null, children),
		Txt: {
			span: ({ children }) => React.createElement('span', null, children),
		},
	};
});

jest.mock('./NetworkInfoForm', () => {
	const React = require('react');
	return {
		NetworkInfoForm: ({ onSubmit }) =>
			React.createElement(
				'button',
				{ onClick: () => onSubmit({ ssid: 'test' }) },
				'Conectar',
			),
	};
});

it('only shows accepted feedback after /connect succeeds', async () => {
	const root = document.createElement('div');
	document.body.appendChild(root);
	let reply = () => {};
	global.fetch = jest.fn((url) =>
		url === '/networks'
			? Promise.resolve({ status: 200, json: () => Promise.resolve([]) })
			: new Promise((resolve) => {
					reply = resolve;
				}),
	);

	await act(async () => {
		ReactDOM.render(<App />, root);
	});

	act(() => {
		root.querySelector('button').click();
	});
	expect(root.textContent).toContain('Enviando los datos');
	expect(root.textContent).not.toContain('Datos recibidos');

	await act(async () => {
		reply({ status: 500, statusText: 'Error' });
	});
	expect(root.textContent).toContain('No se pudo confirmar el envío');
	expect(root.textContent).not.toContain('Datos recibidos');

	act(() => {
		root.querySelector('button').click();
	});
	await act(async () => {
		reply({ status: 200, statusText: 'OK' });
	});
	expect(root.textContent).toContain('Datos recibidos');
	expect(root.textContent).not.toContain('Enviando los datos');
	ReactDOM.unmountComponentAtNode(root);
	root.remove();
});
