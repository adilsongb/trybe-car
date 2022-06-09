const express = require('express')
const TravelModel = require('./models/Travel');

const app = express();

app.use(express.json());

const PORT = 3001;

app.post('/travel', async (req, res) => {
  const { passengerId, driverId, startingPoint } = req.body;

  const requestTime = new Date();
  const statusTravel = 'aguardando_motorista';

  const newTravel = await TravelModel
    .createTravel(passengerId, driverId, startingPoint, requestTime, statusTravel);

  res.status(200).json(newTravel);
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
