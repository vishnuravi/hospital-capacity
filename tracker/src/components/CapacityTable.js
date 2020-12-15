import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

export default function CapacityTable() {

    const [data, setData] = useState([]);
    const [state, setState] = useState("NY");
    const [isLoading, setIsLoading] = useState(false);

    const getData = async () => {
        setIsLoading(true);
        try {
            const results = await axios.get(`${process.env.REACT_APP_API_URL}/hospitals/state/${state}`);
            const data = results.data;

            // extract only the latest data
            const latestData = data.filter((data, index, self) =>
                index === self.findIndex((row) => (row.hospital_pk === data.hospital_pk))
            );

            setData(latestData);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const isRedacted = (value) => {
        // redacted values in dataset are tagged as -999999
        return value === -999999;
    }

    const percentICUFull = (row) => {
        if (isRedacted(row.staffed_adult_icu_bed_occupancy) || isRedacted(row.total_staffed_adult_icu_beds) || !row.staffed_adult_icu_bed_occupancy || !row.total_staffed_adult_icu_beds) {
            return "Data not available";
        } else {
            return ((row.staffed_adult_icu_bed_occupancy / row.total_staffed_adult_icu_beds) * 100).toFixed() + '%';
        }
    }

    const percentCOVID = (row) => {
        if (isRedacted(row.total_adult_patients_hospitalized_confirmed_and_suspected) || isRedacted(row.all_adult_hospital_inpatient_bed_occupied) || !row.total_adult_patients_hospitalized_confirmed_and_suspected || !row.all_adult_hospital_inpatient_bed_occupied) {
            return "Data not available";
        } else {
            return ((row.total_adult_patients_hospitalized_confirmed_and_suspected / row.all_adult_hospital_inpatient_bed_occupied) * 100).toFixed() + '%';
        }
    }

    useEffect(() => {
        getData();
    }, [state])

    return (
        <>
            { isLoading ?
                "Loading..."
                :
                <Table bordered hover>
                    <thead>
                        <tr>
                            <td>Hospital Name</td>
                            <td>City</td>
                            <td>% of adult ICU occupied</td>
                            <td>% admitted patients with suspected or confirmed COVID</td>
                            <td>Reported Date</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => {
                            return (
                                <tr>
                                    <td>{row.hospital_name}</td>
                                    <td>{row.city}</td>
                                    <td>{percentICUFull(row)}</td>
                                    <td>{percentCOVID(row)}</td>
                                    <td>{new Date(row.collection_week).toLocaleDateString()}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            }
        </>
    )
}
