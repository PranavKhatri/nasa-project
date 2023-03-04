const express = require('express');

const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches); //get resquest

launchesRouter.post('/', httpAddNewLaunch); //post request

launchesRouter.delete('/:id', httpAbortLaunch); // delete request

module.exports = launchesRouter;