import fs from 'fs';
import handlebars from 'handlebars';
import _ from 'lodash';
import path from 'path';
import pluralize from 'pluralize';
import { fileURLToPath } from 'url';
import { Module } from '../models';
import {
  getServiceName,
  getModelName,
  getLink,
  getHookFileName,
  getModelFileName,
  getServiceFileName
} from '../utils/helpers.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateHook = (module: Module): boolean => {
  const moduleName = module.moduleName;
  
  const hookDir = path.join(__dirname, '../../src/hooks');
  const hookFile = path.join(hookDir, getHookFileName(moduleName));
  
  if (fs.existsSync(hookFile)) {
    console.error(`❌ The ${moduleName} hook already exist.`);
    return false;
  }
  
  const templatePath = path.join(__dirname, '../templates/hook.hbs');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);
  
  const config = {
    hooksName: {
      getAll: _.upperFirst(_.camelCase(pluralize(moduleName))),
      getOne: _.upperFirst(_.camelCase(moduleName)),
      form: _.upperFirst(_.camelCase(`${moduleName}`)),
    },
    moduleName: _.upperFirst(moduleName),
    moduleNamePlural: _.upperFirst(pluralize(moduleName)),
    modelFileName: `${getModelFileName(moduleName)}-model`,
    modelName: getModelName(moduleName),
    modelNamePlural: pluralize(getModelName(moduleName)),
    serviceName: getServiceName(moduleName),
    serviceFileName: getServiceFileName(moduleName),
    link: getLink(moduleName),
    parameters: _.camelCase(moduleName),
    apiEndPoint: _.camelCase(pluralize(moduleName)),
    methods: {
      getAll: _.camelCase(pluralize(moduleName)),
      getOne: _.camelCase(moduleName),
      save: _.upperFirst(_.camelCase(`${moduleName}`)),
    },
    exportedName: {
      getAll: _.upperFirst(_.camelCase(pluralize(moduleName))),
      getOne: _.upperFirst(_.camelCase(moduleName)),
      save: _.upperFirst(_.camelCase(`${moduleName}`)),
    },
  };
  
  const templateContent = template(config);

  // Create file
  fs.writeFileSync(hookFile, templateContent, { encoding: 'utf8' });
  
  console.log(`✅ The ${(moduleName)} hook has been created successfully.`);
  
  return true;
};
