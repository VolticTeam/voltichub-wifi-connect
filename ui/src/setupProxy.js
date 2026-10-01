module.exports = (app) => {
	app.get('/networks', (_req, res) => {
		res.json([{ ssid: 'Wi-Fi de prueba', security: 'wpa2' }]);
	});
};
