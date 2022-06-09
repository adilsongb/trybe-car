const express = require('express')
const rescue = require('express-rescue');
const TravelModel = require('./models/Travel');
const { error } = require('./middlewares/error');

const app = express();

app.use(express.json());

const PORT = 3001;

app.post('/travel', rescue(async (req, res) => {
  const { passengerId, driverId, startingPoint } = req.body;

  await TravelModel
    .createTravel(passengerId, driverId, startingPoint);

  res.status(200).json({ message: 'trip requested successfully' });
}));

app.use(error);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
