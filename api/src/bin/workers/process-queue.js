#! /usr/bin/env node
const config = require('../../../config');
const hapiEmailKue = require('hapi-email-kue');
const ioc = require('../cli-app');

hapiEmailKue.process(config('/email'));
