#!/usr/bin/env node

const dispatch = require("./dispatch");
const { initSetup } = require("./actions");

// Setup
initSetup();

// Init app
dispatch();