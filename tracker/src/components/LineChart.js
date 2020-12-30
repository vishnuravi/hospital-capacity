import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import API from '../services/API';
import {
    percentBedsFull,
    percentICUFull,
    percentCOVID,
    percentCOVID_ICU
} from '../metrics';

const LineChart = ({ hospital_pk }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [xData, setXData] = useState();
    const [yData, setYData] = useState({
        y1: [],
        y2: [],
        y3: [],
        y4: []
    });

    const getData = async () => {

        setIsLoading(true);
        setError(null);

        // get all records for the particular hospital
        try {
            const results = await API.get(`/hospitals/${hospital_pk}`);
            const dataArray = results.data;

            // remove redacted (negative) data points.
            dataArray.map((row) => {
                return Object.keys(row).forEach((key) => {
                    if (row[key] < 0) {
                        row[key] = null;
                    }
                })
            })

            // set the data for the axes
            setXData(dataArray.map(row => new Date(row.collection_week).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })));
            setYData({
                y1: dataArray.map(row => percentBedsFull(row)),
                y2: dataArray.map(row => percentICUFull(row)),
                y3: dataArray.map(row => percentCOVID(row)),
                y4: dataArray.map(row => percentCOVID_ICU(row))
            });

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError(error);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const chartData = {
        labels: xData,
        datasets: [
            {
                label: '% Inpatient Beds Filled',
                data: yData.y1,
                fill: false,
                backgroundColor: 'rgb(255, 255, 0)',
                borderColor: 'rgba(255, 128, 0, 0.2)',
            },
            {
                label: '% ICU Beds Filled',
                data: yData.y2,
                fill: false,
                backgroundColor: 'rgb(0,0,204)',
                borderColor: 'rgba(0, 102, 204, 0.2)',
            },
            {
                label: '% of admitted patients with confirmed COVID',
                data: yData.y3,
                fill: false,
                backgroundColor: 'rgb(255, 0, 0)',
                borderColor: 'rgba(255, 102, 102, 0.2)'
            },
            {
                label: '% ICU patients with confirmed COVID',
                data: yData.y4,
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
                        callback: function (value, index, values) {
                            return value + '%';
                        }
                    },
                },
            ],
        },
    }

    return (
        <>
            { isLoading ?
                <div className="text-center mt-4">
                    <Spinner animation="border" size="lg" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
                : error ?
                    <p className="text-center">Error retrieving data.</p>
                    :
                    <>
                        <Line data={chartData} options={options} />
                        <br />
                        <p className="text-center">Data is aggregated by HHS on a weekly basis <a href="https://healthdata.gov/dataset/covid-19-reported-patient-impact-and-hospital-capacity-facility" target="_blank">(more info)</a>.</p>
                    </>
            }
        </>
    )
}

export default LineChart;
