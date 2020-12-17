import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    percentBedsFull,
    percentICUFull,
    percentCOVID,
    percentCOVID_ICU
} from '../metrics';

const LineChart = ({ hospital_pk }) => {

    const [xData, setXData] = useState();
    const [y1Data, setY1Data] = useState();
    const [y2Data, setY2Data] = useState();
    const [y3Data, setY3Data] = useState();
    const [y4Data, setY4Data] = useState();

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
        setXData(dataArray.map(row => new Date(row.collection_week).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})));
        setY1Data(dataArray.map(row => percentBedsFull(row)));
        setY2Data(dataArray.map(row => percentICUFull(row)));
        setY3Data(dataArray.map(row => percentCOVID(row)));
        setY4Data(dataArray.map(row => percentCOVID_ICU(row)));
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
                {
                    label: '% ICU patients with suspected/confirmed COVID',
                    data: y4Data,
                    fill: false,
                    backgroundColor: 'rgb(215, 51, 255)',
                    borderColor: 'rgba(255, 51, 246, 0.2)'
                    
                }
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