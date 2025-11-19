import json
import pandas

excel_data = pandas.read_excel('./Participants.xlsx', sheet_name='Participants')

excel_data.to_json('participants.json', orient='records')

with open('./participants.json', 'r') as json_file:
  a = {}
  data = json.load(json_file)
  a = data

with open('./participants.json', 'w') as jsonFile:
  json.dump(a, jsonFile)

print('Excel to Json Migration Successful! =]')
