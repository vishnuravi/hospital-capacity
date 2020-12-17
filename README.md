# Hospital Capacity Tracker

This project visualizes US COVID-19 facility-level capacity data released [from healthdata.gov](https://healthdata.gov/dataset/covid-19-reported-patient-impact-and-hospital-capacity-facility). The dataset was initially released the week of Dec 7, 2020 and is scheduled to be updated every Monday.

Live version can be seen at [hospitalbed.space](https://hospitalbed.space).

<img src="https://user-images.githubusercontent.com/1212163/102426332-2241ec00-3fdd-11eb-96db-994ff8ef187f.JPG" width="500" />

# Project Structure

- `/api` - RESTful API (Node.js/Express)
- `/tracker` - Tracker web app (React)
- `/data` - Scripts to download and process the dataset
