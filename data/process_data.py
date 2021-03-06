import pandas as pd
import urllib.request
import mysql.connector
import yaml
import os
import json

with open("config.yml", "r") as ymlfile:
    config = yaml.load(ymlfile, Loader=yaml.FullLoader)

# get database credentials
DB_USERNAME = os.getenv('DB_USERNAME', config["mysql"]["username"])
DB_PASSWORD = os.getenv('DB_PASSWORD', config["mysql"]["password"])
DB_HOST = os.getenv("DB_HOST", config["mysql"]["host"])
DB_NAME = os.getenv("DB_NAME", config["mysql"]["db"])

# Download dataset from healthcare.gov
print('Starting csv file download...')
url = config["dataset"]["url"]
urllib.request.urlretrieve(url, 'latest-data.csv')

# Extract columns we need
print('Extracting columns from csv...')
columns_to_keep = config["dataset"]["columns"]
df = pd.read_csv('latest-data.csv', dtype=str)
df = df[columns_to_keep]
df['collection_week'] = pd.to_datetime(df['collection_week'], infer_datetime_format=True) 
df.to_csv("processed-data.csv", index=False, index_label=False)
os.remove('latest-data.csv')

# Update database
print('Updating data in database...')
cnx = mysql.connector.connect(user=DB_USERNAME, passwd=DB_PASSWORD,
                              host=DB_HOST, database=DB_NAME, allow_local_infile=True)
cursor = cnx.cursor()
load_data_query = "LOAD DATA LOCAL INFILE 'processed-data.csv' INTO TABLE CapacityData FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;"
cursor.execute("DELETE FROM CapacityData;")
cursor.execute(load_data_query)
cnx.commit()
cursor.close()
cnx.close()
