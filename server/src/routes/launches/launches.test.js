const request = require('supertest');
const app = require('../../app');
const { loadLaunchData } = require('../../models/launches.model');
const { loadPlanetsData } = require('../../models/planets.model');

const { mongoConnect, mongoDisconnect } = require('../../services/mongo');


describe('Launches API', ()=>{
    
    beforeAll(async () =>{
        await mongoConnect();
        await loadPlanetsData();
        await loadLaunchData();
    });

    afterAll(async ()=>{
        await mongoDisconnect();
    })

    describe('TEST GET /launches', ()=>{
        test('It should respond with 200 success', async ()=>{
            const response = await request(app).get('/v1/launches').expect('Content-Type', /json/).expect(200);
        })
    });
    
    describe('TEST POST /launches', ()=>{
        const completeLaunchData = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-1652 b',
            launchDate: 'January 4, 2028',
        }       
    
        const launchDataWithoutDate ={
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-1652 b',
        }
    
        const launchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-1652 b',
            launchDate: 'zoo',
        }
    
        test('It should respond with 201 created', async()=>{
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(requestDate).toBe(responseDate);
    
            expect(response.body).toMatchObject(launchDataWithoutDate);
    
        });
    
        test('It should catch missing required properties', async () =>{
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({error: 'Missing Some property'});
        });
    
        test('It should catch invalid dates', async ()=>{
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({error: 'Invalid launchDate'});
        });
    });
});

