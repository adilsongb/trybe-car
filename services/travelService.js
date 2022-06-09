const TravelModel = require('../models/Travel');

const createTravel = async (passengerId, startingPoint, stopsTravel) => {
  const travelsByPassenger = await TravelModel.getAllTravelsForPessenger(passengerId); 

  const travelInProgress = travelsByPassenger.some((travel) => {
    if (travel.statusTravel === 'aguardando_motorista') return true;
    if (travel.statusTravel === 'motorista_a_caminho') return true;
    if (travel.statusTravel === 'em_viagem') return true;
    return false;
  })

  if (travelInProgress)
    throw { type: 'TRAVEL_IN_PROGRESS' }

  const newTravelId = await TravelModel
    .createTravel(passengerId, startingPoint);

  await Promise.all(
    stopsTravel
      .map((stopAddress, index) =>
        TravelModel.createStopTravel(newTravelId, stopAddress, (index + 1)))
  );
}

module.exports = {
  createTravel
};
