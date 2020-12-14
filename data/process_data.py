import pandas as pd
import numpy as np
import urllib.request

columns_to_keep = ['hospital_pk', 'collection_week', 'state', 'ccn', 'hospital_name', 'address', 'city', 'zip', 'hospital_subtype', 'fips_code', 'is_metro_micro', 'total_beds_7_day_avg', 'all_adult_hospital_inpatient_beds_7_day_avg', 'inpatient_beds_used_7_day_avg', 'all_adult_hospital_inpatient_bed_occupied_7_day_avg',
         'total_adult_patients_hospitalized_confirmed_and_suspected_covid_7_day_avg', 'total_adult_patients_hospitalized_confirmed_covid_7_day_avg', 'total_staffed_adult_icu_beds_7_day_avg', 'staffed_adult_icu_bed_occupancy_7_day_avg', 'staffed_icu_adult_patients_confirmed_and_suspected_covid_7_day_avg', 'staffed_icu_adult_patients_confirmed_covid_7_day_avg']

print('Starting csv file download...')

url_to_csv = 'https://healthdata.gov/sites/default/files/reported_hospital_capacity_admissions_facility_level_weekly_average_timeseries_20201214.csv'
urllib.request.urlretrieve(url_to_csv, 'latest-data.csv')

print('Extracting columns from csv...')

df = pd.read_csv('latest-data.csv', dtype=str)
df = df[columns_to_keep]
df.to_csv("processed-data.csv", index=False, index_label=False)
