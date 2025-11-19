import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {	
  
	const dxPlaceholder = migration.editContentType('dxPlaceholder');

  dxPlaceholder.deleteField('type');
  dxPlaceholder.deleteField('segmentation');

}) as MigrationFunction;