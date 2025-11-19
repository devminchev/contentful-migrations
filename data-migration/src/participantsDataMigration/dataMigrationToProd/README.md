# Instructions for Running the Export and Import Migrations relating to Participants

## Exporting Data from Contentful

### Step 1:
Before running the script, ensure the CONTENT_TYPES are the contents you want to export.

You can entered in multiple models inside the array using the format of:

{ name: < Content Name >, model: < Content Model Name >, query: [] }

### Step 2:
To run the script use the following command with the variables targeting the space and environment you wish to export data from along with your Access Token for that Environment:

`yarn migrate participantsDataMigration/dataMigrationToProd/extract --space='< Space ID >' --accessToken='< Your Access Token >' --env='< Environment To Export Data From >'`

Upon a successful run, a JSON file for each model will be generated within the Extract folder. This can now be used when importing to Contentful.


## Importing Data to Contentful

### Step 1:
Ensure there is a JSON file inside the Extract folder that matches the Model you wish to import into Contentful

### Step 2:
Fill in the const MODEL variable at the top of participantsDataMigration/dataMigrationToProd/load/index.js

The Model relates to the model you want to import and should match the name of one of the JSON files inside Extract.

### Step 3:
Run the script, passing in the Space and Environment you want to import the data into, along with your Access Token for that Environment:

`yarn migrate participantsDataMigration/dataMigrationToProd/load --space='< Space ID >' --accessToken='< Your Access Token >' --env='< Environment To Import Data To >'`

