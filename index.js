const express = require('express')
const rescue = require('express-rescue');
const TravelModel = require('./models/Travel');
const { error } = require('./middlewares/error');

const app = express();

app.use(express.json());

const PORT = 3001;

app.post('/passenger/travel', rescue(async (req, res) => {
  const { passengerId, startingPoint, stopsTravel } = req.body;

  const newTravelId = await TravelModel
    .createTravel(passengerId, startingPoint);

  await Promise.all(
    stopsTravel
      .map((stopAddress, index) =>
        TravelModel.createStopTravel(newTravelId, stopAddress, (index + 1)))
  );

  res.status(200).json({ message: 'trip requested successfully' });
}));

app.use(error);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
