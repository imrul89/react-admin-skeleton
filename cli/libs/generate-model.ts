import fs from 'fs';
import handlebars from 'handlebars';
import _ from 'lodash';
import path from 'path';
import pluralize from 'pluralize';
import { fileURLToPath } from 'url';
import { Module } from '../models';
import { getModelFileName, getModelName } from '../utils/helpers.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateModel = (module: Module): boolean => {
  const moduleName = module.moduleName;
  
  const modelDir = path.join(__dirname, '../../src/models');
  const modelFile = path.join(modelDir, `${getModelFileName(moduleName)}-model.ts`);
  
  if (fs.existsSync(modelFile)) {
    console.error(`❌ The ${getModelName(moduleName)} model already exist.`);
    return false;
  }
  
  const templatePath = path.join(__dirname, '../templates/model.hbs');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);
  
  const templateContent = template({
    modelName: getModelName(moduleName),
    modelNamePlural: pluralize(getModelName(moduleName)),
    modelDataName: _.lowerFirst(pluralize(getModelName(moduleName))),
    fields: module.options.fields
  });

  // Create file
  fs.writeFileSync(modelFile, templateContent, { encoding: 'utf8' });
  
  console.log(`✅ The ${getModelName(moduleName)} model has been created successfully.`);
  
  return true;
};
