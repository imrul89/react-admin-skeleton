#!/usr/bin/env ts-node

import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateFeatures } from './libs/generate-features.ts';
import { generateHook } from './libs/generate-hook.ts';
import { generateModel } from './libs/generate-model.ts';
import { generateRoute } from './libs/generate-route.ts';
import { generateService } from './libs/generate-service.ts';
import { Module } from './models/index.ts';
import settings from './settings.json' assert { type: 'json' };
import { getDirectoryName } from './utils/helpers.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get module name from CLI args
 const moduleName = process.argv[2];
 const settingData = settings as Module;
 
if (!moduleName) {
  console.error('❌ Please provide a module name.');
  process.exit(1);
}

if (_.toLower(settings.moduleName) !== _.toLower(moduleName)) {
  console.error(`❌ Module name doesn't match with settings module name.`);
  process.exit(1);
}

const moduleDir = path.join(__dirname, '../src/pages', getDirectoryName(moduleName));

if (fs.existsSync(moduleDir)) {
  console.error(`❌ The ${moduleName} module already exist.`);
  //process.exit(1);
}

const isModelGenerated = generateModel(settingData);

if (!isModelGenerated) {
  //process.exit(1);
}

const isServiceGenerated = generateService(settingData);

if (!isServiceGenerated) {
  //process.exit(1);
}

const isHookGenerated = generateHook(settingData);

if (!isHookGenerated) {
  //process.exit(1);
}

const isFeatureGenerated = generateFeatures(settingData);

if (!isFeatureGenerated) {
  //process.exit(1);
}

const isRouteGenerated = generateRoute(settingData);

if (!isRouteGenerated) {
  //process.exit(1);
}
