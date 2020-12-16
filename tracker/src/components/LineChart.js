import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import axios from 'axios';

const LineChart = ({ hospital_pk }) => {

    const [xData, setXData] = useState();
    const [y1Data, setY1Data] = useState();
    const [y2Data, setY2Data] = useState();
    const [y3Data, setY3Data] = useState();

    const getData = async () => {

        // get all records for the particular hospital
        const results = await axios.get(`${process.env.REACT_APP_API_URL}/hospitals/id/${hospital_pk}`);
        const dataArray = results.data.reverse();


        // remove redacted (negative) data points.
        dataArray.map((row) => {
            return Object.keys(row).forEach((key) => {
                if(row[key] < 0){
                    console.log(key + " " + row[key]);
                    row[key] = null;
                }
            })
        })

        // set the data for the axes
        setXData(dataArray.map(row => new Date(row.collection_week).toLocaleDateString()));
        setY1Data(dataArray.map(row => ((row.staffed_adult_icu_bed_occupancy / row.total_staffed_adult_icu_beds) * 100).toFixed(2)));
        setY2Data(dataArray.map(row => ((row.all_adult_hospital_inpatient_bed_occupied / row.all_adult_hospital_inpatient_beds) * 100).toFixed(2)));
        setY3Data(dataArray.map(row => ((row.total_adult_patients_hospitalized_confirmed_and_suspected_covid / row.all_adult_hospital_inpatient_bed_occupied) * 100).toFixed(2)));
    }

        useEffect(() => {
            getData();
        }, []);

        const chartData = {
            labels: xData,
            datasets: [
                {
                    label: '% ICU Beds Filled',
                    data: y1Data,
                    fill: false,
                    backgroundColor: 'rgb(255, 255, 0)',
                    borderColor: 'rgba(255, 128, 0, 0.2)',
                },
                {
                    label: '% Inpatient Beds Filled',
                    data: y2Data,
                    fill: false,
                    backgroundColor: 'rgb(0,0,204)',
                    borderColor: 'rgba(0, 102, 204, 0.2)',
                },
                {
                    label: '% of admitted patients with suspected/confirmed COVID',
                    data: y3Data,
                    fill: false,
                    backgroundColor: 'rgb(255, 0, 0)',
                    borderColor: 'rgba(255, 102, 102, 0.2)'
                },
            ],
        }

        const options = {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            suggestedMax: 100,
                            callback: function(value, index, values) {
                                return value + '%';
                            }
                        },
                    },
                ],
            },
        }

        return (
            <>
                <Line data={chartData} options={options} />
            </>
        )
    }

    export default LineChart;