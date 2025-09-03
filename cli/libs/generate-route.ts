import { execSync } from 'child_process';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import pluralize from 'pluralize';
import { fileURLToPath } from 'url';
import { Module } from '../models';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateRoute = (module: Module): boolean => {
  const moduleName = module.moduleName;
  const routeDir = path.join(__dirname, '../../src/routes');
  
  const routeFilePath = `${routeDir}/routes.tsx`;
  const routesContent = fs.readFileSync(routeFilePath, 'utf8');
  
  // Find the closing bracket of the routes array (before the last ]);)
  const lastRouteBracketIndex = routesContent.lastIndexOf('];\n};');
  
  if (lastRouteBracketIndex === -1) {
    throw new Error('Could not find routes array closing bracket');
  }
  
  const kebabCasePlural = _.kebabCase(pluralize(moduleName)); // e.g., 'user-accounts'
  const pascalCaseSingular = _.upperFirst(_.camelCase(moduleName)); // e.g., 'UserAccount'
  const pascalCasePlural = _.upperFirst(_.camelCase(pluralize(moduleName))); // e.g., 'UserAccounts'
  const titleCaseSingular = _.startCase(moduleName); // e.g., 'User Account'
  const titleCasePlural = _.startCase(pluralize(moduleName)); // e.g., 'User Accounts'
  
  const newRouteString = `  {
      path: '${kebabCasePlural}',
      breadcrumb: '${titleCasePlural}',
      component: '',
      exact: true,
      children: [
        {
          path: '',
          breadcrumb: '${titleCasePlural}',
          component: ${pascalCasePlural},
          exact: true
        },
        {
          path: 'create',
          breadcrumb: 'Create ${titleCaseSingular}',
          component: ${pascalCaseSingular}Create,
          exact: true
        },
        {
          path: ':id',
          breadcrumb: 'Edit ${titleCaseSingular}',
          component: ${pascalCaseSingular}Edit,
          exact: true
        }
      ]
    },`;
  
  const beforeClosing = routesContent.substring(0, lastRouteBracketIndex);
  const afterClosing = routesContent.substring(lastRouteBracketIndex);
  
  let updatedContent = beforeClosing + newRouteString + '\n  ' + afterClosing;
  
  const importStatements = `import ${pascalCasePlural} from '@pages/${kebabCasePlural}';` + '\n' +
    `import ${pascalCaseSingular}Create from '@pages/${kebabCasePlural}/create';` + '\n' +
    `import ${pascalCaseSingular}Edit from '@pages/${kebabCasePlural}/edit';`;
  
  updatedContent = importStatements + '\n' + updatedContent;
  
  // Write the updated content back to the file
  fs.writeFileSync(routeFilePath, updatedContent, 'utf8');
  
  console.log(`✅ Route '${titleCasePlural}' added successfully!`);
  
  execSync(`npx eslint ${routeFilePath} --fix`, { stdio: 'inherit' });
  
  return true;
};
