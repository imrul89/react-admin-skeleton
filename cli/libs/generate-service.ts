import fs from 'fs';
import handlebars from 'handlebars';
import _ from 'lodash';
import path from 'path';
import pluralize from 'pluralize';
import { fileURLToPath } from 'url';
import { Module } from '../models';
import {
  getServiceName,
  getServiceFileName,
  getModelName,
  getLink,
  getTag,
  getModelFileName
} from '../utils/helpers.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateService = (module: Module): boolean => {
  const moduleName = module.moduleName;
  
  const serviceDir = path.join(__dirname, '../../src/services');
  const serviceFile = path.join(serviceDir, `${getServiceFileName(moduleName)}.ts`);
  
  if (fs.existsSync(serviceFile)) {
    console.error(`❌ The ${getServiceName(moduleName)} service already exist.`);
    return false;
  }
  
  const templatePath = path.join(__dirname, '../templates/service.hbs');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);
  
  const config = {
    serviceName: getServiceName(moduleName),
    modelFileName: `${getModelFileName(moduleName)}-model`,
    modelName: getModelName(moduleName),
    modelNamePlural: pluralize(getModelName(moduleName)),
    link: getLink(moduleName),
    tag: getTag(moduleName),
    tagPlural: getTag(pluralize(moduleName)),
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
  fs.writeFileSync(serviceFile, templateContent, { encoding: 'utf8' });
  
  console.log(`✅ The ${getServiceName(moduleName)} service has been created successfully.`);
  
  
  // start tag generation
  
  const TAG_FILE_PATH = `${serviceDir}/core/base-service.ts`;
  let code = fs.readFileSync(TAG_FILE_PATH, 'utf8');
  const tagTypesRegex = /(tagTypes\s*:\s*\[)([\s\S]*?)(\])/m;
  
  const TAGS_TO_ADD = [getTag(pluralize(moduleName)), getTag(moduleName)];
  
  const match = code.match(tagTypesRegex);
  
  if (match) {
    const [, start, content, end] = match;
    let changed = false;
    let newContent = content;
    
    TAGS_TO_ADD.forEach(tag => {
      const tagString = `'${tag}'`;
      
      if (!content.includes(tagString)) {
        newContent = newContent.replace(/(\s*)$/, `\n    ${tagString},\n`);
        changed = true;
      }
    });
    
    if (changed) {
      const replaced = start + newContent + end;
      code = code.replace(tagTypesRegex, replaced);
      
      // Write back
      fs.writeFileSync(TAG_FILE_PATH, code, 'utf8');
      console.log('✅ Tags added successfully.');
    } else {
      console.log(`⚠️ ${moduleName} tags already exist.`);
    }
  } else {
    console.error('⚠️ Could not find tagTypes in base-service.ts');
    return false;
  }
  
  // end tag generation
  
  // start add api end points
  
  const apiEndPointFilePath = path.join(__dirname, '../../src/utils/constants/api-end-points.ts');
  let apiEndPointFileContent = fs.readFileSync(apiEndPointFilePath, 'utf8');
  
  const newKey = `  ${config.apiEndPoint}: '/v1/${config.tagPlural}',\n`;
  apiEndPointFileContent = apiEndPointFileContent.replace(/};\s*$/, `${newKey}};`);
  
  fs.writeFileSync(apiEndPointFilePath, apiEndPointFileContent, 'utf8');
  
  console.log('✅ New endpoint added successfully!');
  
  return true;
};
