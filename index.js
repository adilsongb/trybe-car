const express = require('express')
const rescue = require('express-rescue');
const TravelService = require('./services/travelService');
const { error } = require('./middlewares/error');

const app = express();

app.use(express.json());

const PORT = 3001;

app.post('/passenger/travel', rescue(async (req, res) => {
  const { passengerId, startingPoint, stopsTravel } = req.body;

  await TravelService.createTravel(passengerId, startingPoint, stopsTravel);

  res.status(200).json({ message: 'trip requested successfully' });
}));

app.use(error);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
