const sinon = require('sinon');
const { expect } = require('chai');

const TravelModel = require('../../models/Travel');
const TravelService = require('../../services/travelService');
const travelsInProgress = require('../mocks/travelsInProgress');
const travelsNoProgress = require('../mocks/travelsNoProgress'); 

describe('Solicita uma nova viagem', () => {
  describe('Quando há uma viagem em andamento', () => {
    before(() => {
      sinon.stub(TravelModel, 'getAllTravelsForPessenger')
        .resolves(travelsInProgress);
    });

    after(() => {
      TravelModel.getAllTravelsForPessenger.restore();
    });

    it('É retornada a string "TRAVEL_IN_PROGRESS"', async () => {
      const response = await TravelService
        .createTravel('1', 'Rua teotonio vilela', ['Rua gonsalve dias', 'Rua do emirante']);

      expect(response).to.equal('TRAVEL_IN_PROGRESS');
    });
  });

  describe('Quando não há uma viagem em andamento', () => {
    before(() => {
      sinon.stub(TravelModel, 'getAllTravelsForPessenger')
        .resolves(travelsNoProgress);

      sinon.stub(TravelModel, 'createTravel')
        .resolves(3);

      sinon.stub(TravelModel, 'createStopTravel')
        .resolves();
    });

    after(() => {
      TravelModel.getAllTravelsForPessenger.restore();
      TravelModel.createTravel.restore();
      TravelModel.createStopTravel.restore();
    });

    it('É retornado true', async () => {
      const response = await TravelService
        .createTravel('1', 'Rua teotonio vilela', ['Rua gonsalve dias', 'Rua do emirante']);

      expect(response).to.equal(true);
    });
  });
});
