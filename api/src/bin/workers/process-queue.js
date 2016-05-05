#! /usr/bin/env node
var config       = require('../../../config');
var hapiEmailKue = require('hapi-email-kue');
var ioc          = require('../cli-app');

hapiEmailKue.process(config('/email'));
