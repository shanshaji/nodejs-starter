module.exports = (err, req, res, next) => {
	try {
		if (err['status'] === 404) return err = handleNotFoundError(err, res)
		if (err['status'] === '401' || err.code === 401) return err = handleUnauthorizedError(err, res)
		if (err.name === 'ValidationError') return err = handleValidationError(err, res);
		if (err.code && err.code == 11000) return err = handleDuplicateKeyError(err, res);
		return err = handleUnknownError(err,res)
	} catch (err) {
		handleUnknownError(err,res)
	}
}
const handleUnknownError = (err, res) => {
	res.status(500).send('An unknown error occurred.');
}
const handleNotFoundError = (err, res) => {
	res.status(err.status).send({ message: "Not Found What you are looking for"})
}

const handleUnauthorizedError = (err, res) => {
	res.status(err.status).send({ message: err.message })
}

const handleDuplicateKeyError = (err, res) => {
	const field = Object.keys(err.keyValue);
	const code = 409;
	const error = `An account with that ${field} already exists.`;
	res.status(code).send({ messages: error, fields: field });
}

const handleValidationError = (err, res) => {
	let errors = Object.values(err.errors).map(el => el.message);
	let fields = Object.values(err.errors).map(el => el.path);
	let code = 400;
	if (errors.length > 1) {
		const formattedErrors = errors.join(' ');
		res.status(code).send({ messages: formattedErrors, fields: fields });
	} else {
		res.status(code).send({ messages: errors, fields: fields })
	}
}
