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

export const generateFeatures = (module: Module): boolean => {
  const moduleName = module.moduleName;
  
  const config = {
    routeName: _.kebabCase(pluralize(moduleName)),
    directoryName: _.kebabCase(pluralize(moduleName)),
    tableName: `${_.upperFirst(_.camelCase(moduleName))}`,
    title: _.startCase(pluralize(moduleName)),
    tableFileName: `${_.kebabCase(pluralize(moduleName))}-table`,
    modelName: getModelName(moduleName),
    modelFileName: `${getModelFileName(moduleName)}-model`,
    hooksName: `use${_.upperFirst(_.camelCase(pluralize(moduleName)))}`,
    hooksFileName: `use-${_.kebabCase(pluralize(moduleName))}`,
    dataSource: `{data?.${_.lowerFirst(pluralize(getModelName(moduleName)))}}`,
    fields: module.options.fields.map(field => ({
      ...field,
      title: _.startCase(field.name),
      fieldObject: `{record.${field.name}}`
    })),
    actionData: '{{ items: getActions(record) }}'
  };
  
  
  const tableDir = path.join(__dirname, '../../src/features', config.directoryName);
  const tableFile = path.join(tableDir, `${config.tableFileName}.tsx`);
  
  if (fs.existsSync(tableFile)) {
    console.error(`❌ The ${moduleName} table already exists.`);
    return false;
  }
  
  const templatePath = path.join(__dirname, '../templates/features/table.hbs');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);
  
  const templateContent = template(config);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(tableDir)) {
    fs.mkdirSync(tableDir, { recursive: true });
  }
  
  // Write the generated table file
  fs.writeFileSync(tableFile, templateContent, { encoding: 'utf8' });
  
  console.log(`✅ The ${moduleName} table has been created successfully.`);
  
  const tableColumnFile = path.join(tableDir, `${config.tableFileName}-columns.tsx`);
  const tableColumnPath = path.join(__dirname, '../templates/features/table-column.hbs');
  const tableColumnSource = fs.readFileSync(tableColumnPath, 'utf8');
  const tableColumn = handlebars.compile(tableColumnSource);
  const tableColumnContent = tableColumn(config);
  
  fs.writeFileSync(tableColumnFile, tableColumnContent, { encoding: 'utf8' });
  
  console.log(`✅ The ${moduleName} table column has been created successfully.`);
  
  return true;
};