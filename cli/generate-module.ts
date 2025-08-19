#!/usr/bin/env ts-node

import fs from 'fs';
import handlebars from 'handlebars';
import _ from 'lodash';
import path from 'path';
import { fileURLToPath } from 'url';
//import { generateHook } from './libs/generate-hook.ts';
//import { generateModel } from './libs/generate-model.ts';
//import { generateService } from './libs/generate-service.ts';
import { generateFeatures } from './libs/generate-features.ts';
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
//
// if (fs.existsSync(moduleDir)) {
//   console.error(`❌ The ${moduleName} module already exist.`);
//   process.exit(1);
// }
//
// const isModelGenerated = generateModel(settingData);
//
// if (!isModelGenerated) {
//   process.exit(1);
// }
//
// const isServiceGenerated = generateService(settingData);
//
// if (!isServiceGenerated) {
//   process.exit(1);
// }
//
// const isHookGenerated = generateHook(settingData);
//
// if (!isHookGenerated) {
//   process.exit(1);
// }

const isFeatureGenerated = generateFeatures(settingData);

if (!isFeatureGenerated) {
  process.exit(1);
}

process.exit(1);

// Paths
const moduleFile = path.join(moduleDir, `index.tsx`);



const templatePath = path.join(__dirname, './templates/pages/list.hbs');
const templateSource = fs.readFileSync(templatePath, 'utf8');
const template = handlebars.compile(templateSource);

const templateContent = template({
  moduleName: _.toLower(moduleName),
  moduleNameCap: _.upperFirst(_.camelCase(moduleName)),
  moduleNamePlural: `${_.toLower(moduleName)}s`,
  moduleNamePluralCap: `${_.upperFirst(_.camelCase(moduleName))}s`
});

// Create folder and file
if (!fs.existsSync(moduleDir)) {
  fs.mkdirSync(moduleDir, { recursive: true });
}

fs.writeFileSync(moduleFile, templateContent, { encoding: 'utf8' });

console.log(`✅ The ${moduleName} module has been created successfully.`);