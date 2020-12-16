import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import axios from 'axios';

const LineChart = ({ hospital_pk }) => {

    const [xData, setXData] = useState();
    const [yData, setYData] = useState();

    const getData = async () => {

        // get all records for the particular hospital
        const results = await axios.get(`${process.env.REACT_APP_API_URL}/hospitals/id/${hospital_pk}`);
        const dataArray = results.data.reverse();

        // TODO: remove redacted data points.

        // set the data for the axes
        setXData(dataArray.map(point => new Date(point.collection_week).toLocaleDateString()));
        setYData(dataArray.map(point => ((point.staffed_adult_icu_bed_occupancy / point.total_staffed_adult_icu_beds) * 100).toFixed(2)));
    }

        useEffect(() => {
            getData();
        }, []);

        const chartData = {
            labels: xData,
            datasets: [
                {
                    label: '% ICU Filled',
                    data: yData,
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.2)',
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