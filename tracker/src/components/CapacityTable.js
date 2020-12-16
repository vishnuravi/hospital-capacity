import { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import StateSelect from './StateSelect';
import LineChart from './LineChart';
import {
    percentBedsFull,
    percentICUFull,
    percentCOVID
} from '../metrics';
import { toTitleCase } from '../helpers/formatters';

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
