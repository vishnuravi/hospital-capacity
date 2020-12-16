import { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import StateSelect from './StateSelect';
import LineChart from './LineChart';

export default function CapacityTable() {

    const [data, setData] = useState([]);
    const [state, setState] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const getData = async () => {
        setIsLoading(true);
        try {
            const results = await axios.get(`${process.env.REACT_APP_API_URL}/hospitals/state/${state.value}`);
            const data = results.data;

            // extract only the latest data
            const latestData = data.filter((data, index, self) =>
                index === self.findIndex((row) => (row.hospital_pk === data.hospital_pk))
            );

            console.log(latestData);

            // calculate metrics and format data
            const formattedData = latestData.map((row) => {
                return (
                    {
                        hospital_pk: row.hospital_pk,
                        hospital_name: toTitleCase(row.hospital_name),
                        city: toTitleCase(row.city),
                        percent_beds_full: percentBedsFull(row),
                        percent_icu_full: percentICUFull(row),
                        percent_covid: percentCOVID(row),
                        collection_week: new Date(row.collection_week).toLocaleDateString()
                    }
                )
            })

            setData(formattedData);
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

    const isRatioDataMissing = (a, b) => isRedacted(a) || isRedacted(b) || !a || !b;

    const NO_DATA = "-"

    const percentBedsFull = (row) => {
        if (isRatioDataMissing(row.all_adult_hospital_inpatient_beds, row.all_adult_hospital_inpatient_bed_occupied)) {
            return NO_DATA;
        } else {
            return ((row.all_adult_hospital_inpatient_bed_occupied / row.all_adult_hospital_inpatient_beds) * 100).toFixed() + '%';
        }
    }

    const percentICUFull = (row) => {
        if (isRatioDataMissing(row.staffed_adult_icu_bed_occupancy, row.total_staffed_adult_icu_beds)) {
            return NO_DATA;
        } else {
            return ((row.staffed_adult_icu_bed_occupancy / row.total_staffed_adult_icu_beds) * 100).toFixed() + '%';
        }
    }

    const percentCOVID = (row) => {
        if (isRatioDataMissing(row.total_adult_patients_hospitalized_confirmed_and_suspected_covid, row.all_adult_hospital_inpatient_bed_occupied)) {
            return NO_DATA;
        } else {
            return ((row.total_adult_patients_hospitalized_confirmed_and_suspected_covid / row.all_adult_hospital_inpatient_bed_occupied) * 100).toFixed() + '%';
        }
    }

    const toTitleCase = (str) => {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    useEffect(() => {
        getData();
    }, [state])


    // data settings for capacity table
    const columns = [
    {
        dataField: 'hospital_pk',
        text: 'Hospital ID',
        sort: true,
        hidden: true
    },
    {
        dataField: 'hospital_name',
        text: 'Hospital Name',
        sort: true
    }, 
    {
        dataField: 'city',
        text: 'City',
        sort: true
    }, 
    {
        dataField: 'percent_beds_full',
        text: '% of adult inpatient beds occupied'
    }, 
    {
        dataField: 'percent_icu_full',
        text: '% of adult ICU beds occupied',
    },
    {
        dataField: 'percent_covid',
        text: '% of admitted patients with suspected or confirmed COVID',
    },
    {
        dataField: 'collection_week',
        text: 'Week',
    }];

    // component to show when a row is expanded
    const expandRow = {
        renderer: row => (
            <LineChart data={data} hospital_pk={row.hospital_pk} />
        )
      };

    return (
        <>
            <StateSelect setState={setState} state={state} isLoading={isLoading} />
            <br />
            { !isLoading && state &&
                <div id="table-container">
                    <Badge variant="light" className="mb-1">💡 click on any row to visualize trend</Badge>
                    <BootstrapTable
                        wrapperClasses="table-responsive"
                        hover
                        keyField='hospital_pk'
                        data={data}
                        columns={columns}
                        expandRow={expandRow}
                    />
                </div>
            }
        </>
    )
}
