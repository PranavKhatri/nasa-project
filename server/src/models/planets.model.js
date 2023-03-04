const planets = require('./planets.mongo');

const { parse } = require('csv-parse');

//console.log(parse());
// parse is the function that returns an event emitter that deals with streams of data coming in from that file.
const fs = require('fs'); // node builtin file system module 

const path = require('path');

//const results = [];

const habitablePlanets = [];

function isHabitablePlanet(planet){
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol']>0.36 && planet['koi_insol']<1.11
        && planet['koi_prad']<1.6;
}



// We can have multiple .on handlers for reateTeadStream Event Emitter 

/*
const promise = new Promise((resolve, reject) =>{
    resolve(42); // 42 is passed in .then(()) as result
})
promise.then((result) =>{

})

const result = await promise
*/
 
function loadPlanetsData(){

    return new Promise((resolve, reject) =>{
        fs.createReadStream(path.join(__dirname,'..','..', 'data','kepler_data.csv'))// event emitter
        .pipe(parse({
            comment: '#', // we want to treat line starting with # as comments
            columns: true // this will return each row in our csv file as JS Object with key value pairs rather than as array
        }))
        .on('data', async (data)=>{ // when event "data" occurs, trigger call back function
            if(isHabitablePlanet(data))
                { savePlanet(data);}
        })
        .on('error', (err) =>{
            console.log(err);
            reject(err);
        })
        .on('end', async() =>{
            const countPlanetsFound = (await getAllPlanets()).length;
            console.log(`${countPlanetsFound} planets found`);
            resolve();
        })

    });
}

async function savePlanet(planet){
    try{
        await planets.updateOne({
            keplerName: planet.kepler_name,
        },{
            keplerName: planet.kepler_name,
        },{
            upsert: true,
        });
    }

    catch(err){
    console.error(`Could not save planet $(err)`);
    }

}

async function getAllPlanets(){
    return await planets.find({}, {
        '__v': 0, '_id':0,
    });
}

// find({what_we_want_to_filter}, {how_we_want_to_project})
// find({keplerName: 'Kepler-62 f'}, {'keplerName: 1/0'}), if 1, it shows keplerName field. If 0 it hides it.

module.exports = {
    loadPlanetsData,
    planets: habitablePlanets,
    getAllPlanets
};