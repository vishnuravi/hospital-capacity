import pandas as pd
import urllib.request
import mysql.connector
import yaml
import os

with open("config.yml", "r") as ymlfile:
    config = yaml.load(ymlfile, Loader=yaml.FullLoader)


# Download dataset from healthcare.gov
print('Starting csv file download...')

url_to_csv = config["dataset"]["url"]
urllib.request.urlretrieve(url_to_csv, 'latest-data.csv')

# Extract columns we need
print('Extracting columns from csv...')

columns_to_keep = config["dataset"]["columns"]

df = pd.read_csv('latest-data.csv', dtype=str)
df = df[columns_to_keep]
df.to_csv("processed-data.csv", index=False, index_label=False)
os.remove('latest-data.csv')

print('Inserting new data into database...')

cnx = mysql.connector.connect(user=config["mysql"]["user"], passwd=config["mysql"]["passwd"], host=config["mysql"]["host"], database=config["mysql"]["db"], allow_local_infile=True)
cursor = cnx.cursor()
load_data_query = "LOAD DATA LOCAL INFILE 'processed-data.csv' INTO TABLE CapacityData FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;"
cursor.execute("DELETE FROM CapacityData;")
cursor.execute(load_data_query)
cnx.commit()
cursor.close()
cnx.close()
