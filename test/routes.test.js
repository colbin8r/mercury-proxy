import request from 'supertest';
import dotenv from 'dotenv';
import app from '../src/app.js';

dotenv.config();

describe('GET /', () => {
  it('should render properly', async () => {
    await request(app).get('/').expect(200);
  });
});

describe('GET /404', () => {
  it('should return 404 for non-existent URLs', async () => {
    await request(app).get('/404').expect(404);
    await request(app).get('/notfound').expect(404);
  });
});

describe('GET /article', () => {
  it('should return 400 for missing URLs', async () => {
    await request(app)
      .get('/article')
      .expect(400);
  });

  it('should return 400 for empty URLs', async () => {
    await request(app)
      .get('/article')
      .query({url: ''})
      .expect(400);
  });

  it('should return 400 for malformed URLs', async () => {
    await request(app)
      .get('/article')
      .query({url: '!invalid'})
      .expect(400);
  });

  it('should return 200 for valid URLs', async () => {
    await request(app)
      .get('/article')
      .query({url: 'https://trackchanges.postlight.com/building-awesome-cms-f034344d8ed'})
      .expect(200);
    await request(app)
      .get('/article')
      .query({url: 'https://www.wired.com/2016/09/ode-rosetta-spacecraft-going-die-comet/'})
      .expect(200);
  });
})
