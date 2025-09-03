import fs from 'fs';
import handlebars from 'handlebars';
import _ from 'lodash';
import path from 'path';
import pluralize from 'pluralize';
import { fileURLToPath } from 'url';
import { Module } from '../models';
import { getFormInputs, getModelFileName, getModelName } from '../utils/helpers.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateFeatures = (module: Module): boolean => {
  handlebars.registerHelper('eq', function (a, b) {
    return a === b;
  });
  
  const moduleName = module.moduleName;
  
  const config = {
    routeName: _.kebabCase(pluralize(moduleName)),
    directoryName: _.kebabCase(pluralize(moduleName)),
    tableName: `${_.upperFirst(_.camelCase(moduleName))}`,
    title: _.startCase(pluralize(moduleName)),
    tableFileName: `${_.kebabCase(moduleName)}-table`,
    formFileName: `${_.kebabCase(moduleName)}-form`,
    modelName: getModelName(moduleName),
    modelFileName: `${getModelFileName(moduleName)}-model`,
    hooksName: {
      getAll: _.upperFirst(_.camelCase(pluralize(moduleName))),
      getOne: _.upperFirst(_.camelCase(moduleName)),
      form: _.upperFirst(_.camelCase(`${moduleName}`)),
    },
    hooksFileName: `use-${_.kebabCase(pluralize(moduleName))}`,
    hookDataName: _.camelCase(moduleName),
    dataSource: `{data?.${_.lowerFirst(pluralize(getModelName(moduleName)))}}`,
    fields: module.options.fields.map(field => ({
      ...field,
      title: _.startCase(field.name),
      placeholder: _.startCase(field.name),
      fieldObject: `{record.${field.name}}`
    })),
    actionData: '{{ items: getActions(record) }}',
    formTitle: _.kebabCase(moduleName),
    formName: _.upperFirst(_.camelCase(moduleName)),
    formInputs: getFormInputs(module.options.fields),
    indexPageName: _.upperFirst(_.camelCase(pluralize(moduleName))),
    actionTitle: _.startCase(moduleName),
    actionTitleLower: _.lowerCase(moduleName),
    createPageName: _.upperFirst(_.camelCase(moduleName)),
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

  const formFile = path.join(tableDir, `${config.formFileName}.tsx`);
  const formPath = path.join(__dirname, '../templates/features/form.hbs');
  const formSource = fs.readFileSync(formPath, 'utf8');
  const form = handlebars.compile(formSource);
  const formContent = form(config);

  fs.writeFileSync(formFile, formContent, { encoding: 'utf8' });

  console.log(`✅ The ${moduleName} form has been created successfully.`);
  
  // Generate pages
  
  const pageDir = path.join(__dirname, '../../src/pages', config.directoryName);
  const indexPageFile = path.join(pageDir, `index.tsx`);
  const indexPagePath = path.join(__dirname, '../templates/pages/index.hbs');
  const indexPageSource = fs.readFileSync(indexPagePath, 'utf8');
  const indexPageTemplate = handlebars.compile(indexPageSource);
  const indexPageContent = indexPageTemplate(config);
  
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }
  
  fs.writeFileSync(indexPageFile, indexPageContent, { encoding: 'utf8' });
  console.log(`✅ The ${moduleName} list page has been created successfully.`);
  
  const createPageFile = path.join(pageDir, `create.tsx`);
  const createPagePath = path.join(__dirname, '../templates/pages/create.hbs');
  const createPageSource = fs.readFileSync(createPagePath, 'utf8');
  const createPageTemplate = handlebars.compile(createPageSource);
  const createPageContent = createPageTemplate(config);

  fs.writeFileSync(createPageFile, createPageContent, { encoding: 'utf8' });
  console.log(`✅ The ${moduleName} create page has been created successfully.`);

  const editPageFile = path.join(pageDir, `edit.tsx`);
  const editPagePath = path.join(__dirname, '../templates/pages/edit.hbs');
  const editPageSource = fs.readFileSync(editPagePath, 'utf8');
  const editPageTemplate = handlebars.compile(editPageSource);
  const editPageContent = editPageTemplate(config);

  fs.writeFileSync(editPageFile, editPageContent, { encoding: 'utf8' });
  console.log(`✅ The ${moduleName} edit page has been created successfully.`);
  
  return true;
};