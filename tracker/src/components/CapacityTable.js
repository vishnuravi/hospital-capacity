import { useState, useEffect } from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import Spinner from 'react-bootstrap/Spinner';
import StateSelect from './StateSelect';
import CountySelect from './CountySelect';
import LineChart from './LineChart';
import {
    percentBedsFull,
    percentICUFull,
    percentCOVID,
    percentCOVID_ICU
} from '../metrics';
import { toTitleCase, weekToString } from '../helpers/formatters';

export default function CapacityTable() {

    const [data, setData] = useState();
    const [tableData, setTableData] = useState([]);
    const [state, setState] = useState();
    const [county, setCounty] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const getData = async () => {
        setIsLoading(true);
        try {
            const results = await axios.get(`${process.env.REACT_APP_API_URL}/hospitals/state/${state.value}`);
            const data = results.data;

            // extract only acute care facilities
            const acuteCareData = data.filter((row) => row.hospital_subtype === "Short Term" || row.hospital_subtype === "Critical Access Hospital");

            // extract only the latest week's data
            const latestData = acuteCareData.filter((data, index, self) =>
                index === self.findIndex((row) => (row.hospital_pk === data.hospital_pk))
            );

            // calculate metrics and format data for display in table
            const formattedData = latestData.map((row) => {

                const percent_beds_full = percentBedsFull(row);
                const percent_icu_full = percentICUFull(row);
                const percent_covid = percentCOVID(row);
                const percent_icu_covid = percentCOVID_ICU(row);
                const empty = '-';

                return (
                    {
                        hospital_pk: row.hospital_pk,
                        hospital_name: toTitleCase(row.hospital_name),
                        city: toTitleCase(row.city),
                        fips_code: row.fips_code,
                        percent_beds_full: percent_beds_full ? percent_beds_full + '%' : empty,
                        percent_icu_full: percent_icu_full ? percent_icu_full + '%' : empty,
                        percent_covid: percent_covid ? percent_covid + '%' : empty,
                        percent_icu_covid: percent_icu_covid ? percent_icu_covid + '%' : empty,
                        collection_week: weekToString(row.collection_week)
                    }
                )
            });

            // load the data into the state and display it in the table
            setData(formattedData);
            setTableData(formattedData);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    // fetch new data and clear city selection when user selects a new state
    useEffect(() => {
        setCounty();
        if (state) {
            getData();
        }
    }, [state])


    //filter out data when user selects a new county
    useEffect(() => {
        if (state) {
            if (county) {
                setTableData(data.filter((row) => row.fips_code.includes(county.value)));
            } else {
                setTableData(data);
            }
        }
    }, [county])

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
            dataField: 'percent_icu_covid',
            text: '% of ICU patients with suspected or confirmed COVID',
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
            { isLoading ?
                <div className="text-center mt-4">
                    <Spinner animation="border" size="lg" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
                :
                state &&
                <>
                    <CountySelect setCounty={setCounty} county={county} state={state} data={tableData} isLoading={isLoading} />
                    <div id="table-container">
                        {tableData.length ?
                            <>
                                <p className="lead text-center mt-3 mb-3">
                                    📈 Click on any row to graph data from July 2020 to present.</p>
                                <BootstrapTable
                                    wrapperClasses="table-responsive"
                                    hover
                                    keyField='hospital_pk'
                                    data={tableData}
                                    columns={columns}
                                    defaultSorted={defaultSorted}
                                    expandRow={expandRow}
                                />
                            </>
                            : <h5 className="text-center mt-4 lead">No data found for the selected region.</h5>
                        }
                    </div>
                </>
            }
        </>
    )
}
