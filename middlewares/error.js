const error = (err, _req, res, _next) => {
	console.log(err.message);
	if (err.type === 'TRAVEL_IN_PROGRESS') {
		return res.status(400).json({ message: 'Há uma viagem em progresso!' });
	}

	res.status(500).json({ message: 'Erro interno do servidor' });
};

module.exports = { error };
