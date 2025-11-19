# Instructions for Running the Participants Data Migration


## Setup
If this is your first time running the script you may need to install the following:
python
pip3 
pandas: `pip3 install pandas`
openpyxl: `pip3 install openpyxl`



## Step 1:
Fill in the Participants.xlsx document that is in [Bally's Sharepoint](https://gamesys.sharepoint.com/sites/SportsProductStudio/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FSportsProductStudio%2FShared%20Documents%2F11%2E%20WHAM%2FServices) with the data you wish to transfer

## Step 2:
Copy over the Participants.xlsx document into the 'participantsDataMigration' folder in this repo (this may mean overwriting the previous one)

***A few things to note:***

Firstly, you will need to download the document in order to drag it across into the participantsDataMigration folder.

Then ensure all blank lines are removed. This will cause the script to error!

And finally, you will need to ensure the new file is renamed to 'Participants.xlsx'

## Step 3:
Run the python script using `python3 excel-to-json.py`. This will create a participants.json file inside the 'participantsDataMigration' folder
WARNING! Running the script will override the existing participants.json

## Step 4:
Finally run the data migration, so Contentful populates with the data from the participants.json file. See Data-Migration README for command.

WARNING! Running after the initial migration could cause overrides in any participant data that was not updated in the spreadsheet.