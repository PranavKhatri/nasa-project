const axios = require('axios');

const launchesDatabase = require('./launches.mongo');

const planets = require('./planets.mongo');

const launches = new Map();


const DEFAULT_FLIGHT_NUMBER = 100;

async function getAllLaunches(skip, limit){
    return await launchesDatabase
        .find({}, {'_id':0 , '__v':0})
        .sort({flightNumber: 1})
        .skip(skip)
        .limit(limit);
}

async function saveLaunch(launch){

    return await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
        source: launch.source,
    }, launch, {
        upsert: true,
    })


}

// const launch = {
//     flightNumber: 100, //flight_number from spacex
//     mission: 'Kelper Exploration X', //name
//     rocket: 'Explorer IS1', //rocket.name
//     launchDate: new Date('Decemeber 27, 2030'), //date_local
//     target: 'Kepler-442 b', //not applicable
//     customers: ['ZTM', 'NASA'], // payload.customers for each payload
//     upcoming: true, //upcoming
//     success: true, //success
//     source: 'NASA',
// };

// saveLaunch(launch);


 async function scheduleNewLaunch(launch){

    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if(!planet){
        throw new Error('No matching planet found!');
    }
    

    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch,{
        success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA'],
        flightNumber: newFlightNumber,
        source: 'NASA',
    });

    await saveLaunch(newLaunch);

}

// we have updated the addNew launch function to scheduleNew Launch

function addNewLaunch(launch){
    latestFlightNumber++;
    launches.set(latestFlightNumber, Object.assign(launch,{
        flightNumber: latestFlightNumber,
        customer: ['ZTM', 'NASA'],
        upcoming: true,
        success: true,
        source: 'NASA',
    }));
}

async function existsLaunchWithId(launchId){
    return await findLaunch({
        flightNumber: launchId,
    });
}


async function getLatestFlightNumber(){

    const mysort = {flightNumber : -1};
    const latestLaunch = await launchesDatabase.findOne().sort(mysort);

    
    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

async function abortedLaunchById(launchId){
    const aborted =  await launchesDatabase.updateOne({
        flightNumber: launchId,
    },{
        upcoming: false,
        success: false,
    });

    return aborted.modifiedCount === 1 && aborted.acknowledged === true;
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;
}

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function findLaunch(filter){
    return await launchesDatabase.findOne(filter);
}

async function populateLaunches(){

    console.log('Downloading Launch Data from SpaceX');

    const response = await axios.post(SPACEX_API_URL, {
            query: {},
            options: {
                pagination: false,
                populate: [
                    {
                        path: 'rocket',
                        select:{
                            'name': 1
                        }
                    },
                    {
                        path: 'payloads',
                        select:{
                            'customers': 1
                        }
                    }
                ]
            }
        }
    );


    const launchDocs = response.data.docs;

    for(const launchDoc of launchDocs){

        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate : launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers: customers,
            source: 'SpaceX',
        }

        // console.log(launch);

        if(response.status !== 200){
            console.log('Problem Downloading Launch Data');
            throw new Error('launch data download failed!');
        }

        await saveLaunch(launch);
    }
}

async function loadLaunchData(){

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });

    if(firstLaunch){
        console.log('Database already updated!');
    }
    else{
        await populateLaunches();
    }


}

module.exports = {
    loadLaunchData,
    launches,
    getAllLaunches,
    addNewLaunch,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortedLaunchById,
};