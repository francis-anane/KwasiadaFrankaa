import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app'; // Import the Express app instance
import Player from '../src/models/Player';

const { expect } = chai;
chai.use(chaiHttp);

describe('Player CRUD Operations', () => {
  let playerId;

  it('should create a new player', async () => {
    const playerData = {
      playerName: 'TestPlayer',
      email: 'testplayer@example.com',
      password: 'testpassword',
    };

    const response = await chai.request(app)
      .post('/api/players')
      .send(playerData);

    expect(response).to.have.status(201);
    expect(response.body).to.have.property('_id');
    playerId = response.body._id;
  });

  it('should get all players', async () => {
    const response = await chai.request(app)
      .get('/api/players');

    expect(response).to.have.status(200);
    expect(response.body).to.be.an('array');
  });

  it('should get a player by ID', async () => {
    const response = await chai.request(app)
      .get(`/api/players/${playerId}`);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('_id', playerId);
  });

  it('should update a player by ID', async () => {
    const updatedData = {
      playerName: 'UpdatedPlayerName',
    };

    const response = await chai.request(app)
      .put(`/api/players/${playerId}`)
      .send(updatedData);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('playerName', 'UpdatedPlayerName');
  });

  it('should delete a player by ID', async () => {
    const response = await chai.request(app)
      .delete(`/api/players/${playerId}`);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('_id', playerId);
  });
});
