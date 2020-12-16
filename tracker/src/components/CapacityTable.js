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
import { toTitleCase, weekToString } from '../helpers/formatters';

export default function CapacityTable() {

    const [tableData, setTableData] = useState([]);
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

            // calculate metrics and format data
            const formattedData = latestData.map((row) => {
                const percent_beds_full = percentBedsFull(row);
                const percent_icu_full = percentICUFull(row);
                const percent_covid = percentCOVID(row);
                const empty = '-'

                return (
                    {
                        hospital_pk: row.hospital_pk,
                        hospital_name: toTitleCase(row.hospital_name),
                        city: toTitleCase(row.city),
                        percent_beds_full: percent_beds_full ? percent_beds_full + '%' : empty,
                        percent_icu_full: percent_icu_full ? percent_icu_full + '%' : empty,
                        percent_covid: percent_covid ? percent_covid + '%' : empty,
                        collection_week: weekToString(row.collection_week)
                    }
                )
            })

            setTableData(formattedData);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [state])

    // sorting function for table
    const sortFunc = (a, b, order, dataField, rowA, rowB) => {
        if (order === 'asc') {
            return a - b;
        }
        return b - a; // desc
    };

    // data settings for capacity table
    const defaultSorted = [{
        dataField: 'hospital_name',
        order: 'asc'
    }];

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
            text: '% of adult inpatient beds occupied',
            sort: false,
            sortFunc: sortFunc
        },
        {
            dataField: 'percent_icu_full',
            text: '% of adult ICU beds occupied',
            sort: false,
            sortFunc: sortFunc
        },
        {
            dataField: 'percent_covid',
            text: '% of admitted patients with suspected or confirmed COVID',
            sort: false,
            sortFunc: sortFunc
        },
        {
            dataField: 'collection_week',
            text: 'Latest Collection Week',
        }];

    // component to show when a row is expanded
    const expandRow = {
        renderer: row => (
            <LineChart hospital_pk={row.hospital_pk} />
        )
    };

    return (
        <>
            <StateSelect setState={setState} state={state} isLoading={isLoading} />
            <br />
            { !isLoading && state &&
                <div id="table-container">
                    <h5><Badge variant="light" className="mb-1">💡 click on any row to graph trend</Badge></h5>
                    <BootstrapTable
                        wrapperClasses="table-responsive"
                        hover
                        keyField='hospital_pk'
                        data={tableData}
                        columns={columns}
                        defaultSorted={defaultSorted}
                        expandRow={expandRow}
                    />
                </div>
            }
        </>
    )
}
