const API_URL = 'http://localhost:8000/v1';


async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.

  const response = await fetch(`${API_URL}/planets`);
  return await response.json(); // the json functions also returns a promise, so we need to await it

}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.

  const response = await fetch(`${API_URL}/launches`);
  const fectchedLaunches = await response.json();
  return fectchedLaunches.sort((a,b) =>{
    return a.flightNumber - b.flightNumber; // ascending
  })
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.

  try{
    return await fetch(`${API_URL}/launches` , {
      method: 'post',
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
  });
  }catch(err){
    return {
      ok: false,
    };
  }

}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.

  try{
    return await fetch(`${API_URL}/launches/${id}`,{
      method: 'delete',

    });
  }catch(err){
    return{
      ok:false,
    };
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};