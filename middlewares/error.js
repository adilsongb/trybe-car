const error = (err, _req, res, _next) => {
	console.error(err);

	res.status(500).json({ message: 'Erro interno do servidor' });
};

module.exports = { error };
