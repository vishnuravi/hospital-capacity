import { useState, useEffect } from 'react';
import API from '../services/API';
import BootstrapTable from 'react-bootstrap-table-next';
import Spinner from 'react-bootstrap/Spinner';
import StateSelect from './StateSelect';
import CountySelect from './CountySelect';
import HospitalSelect from './HospitalSelect';
import LineChart from './LineChart';
import {
    percentBedsFull,
    percentICUFull,
    percentCOVID,
    percentCOVID_ICU
} from '../metrics';
import { toTitleCase, weekToString, percentToColor } from '../helpers/formatters';

export default function CapacityTable() {

    const [data, setData] = useState();
    const [tableData, setTableData] = useState([]);
    const [state, setState] = useState();
    const [county, setCounty] = useState();
    const [hospital, setHospital] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const results = await API.get(`/hospitals/?state=${state.value}&latest_week=true`);

            // calculate metrics and format data for display in table
            const formattedData = results.data.map((row) => {

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
                        all_adult_hospital_inpatient_beds: Math.round(row.all_adult_hospital_inpatient_beds),
                        percent_icu_full: percent_icu_full ? percent_icu_full + '%' : empty,
                        total_staffed_adult_icu_beds: Math.round(row.total_staffed_adult_icu_beds),
                        percent_covid: percent_covid ? percent_covid + '%' : empty,
                        total_covid_patients: Math.round(row.total_adult_patients_hospitalized_confirmed_and_suspected_covid),
                        percent_icu_covid: percent_icu_covid ? percent_icu_covid + '%' : empty,
                        total_icu_covid_patients: Math.round(row.staffed_icu_adult_patients_confirmed_and_suspected_covid),
                        collection_week: weekToString(row.collection_week)
                    }
                )
            });

            // load the data into the state and display it in the table
            setData(formattedData);
            setTableData(formattedData);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError(error);
        }
    };

    // fetch new data and clear county selection when user selects a new state
    useEffect(() => {
        setCounty();
        if (state) {
            getData();
        }
    }, [state])


    //filter by county
    useEffect(() => {
        if (state) {
            if (county) {
                setHospital(null);
                setTableData(data.filter((row) => row.fips_code.includes(county.value)));
            } else {
                if (!hospital) setTableData(data);
            }
        }
    }, [county])

    //filter by hospital
    useEffect(() => {
        if(state){
            if(hospital){
                setCounty(null);
                setTableData(data.filter((row) => row.hospital_pk === hospital.value));
            } else {
                if (!county) setTableData(data);
            }
        }
    }, [hospital])

    // sorting function for table
    const sortFunc = (a, b, order) => {
        if (order === 'asc') {
            return a - b;
        }
        return b - a; // desc
    };

    // column style
    const columnStyle = () => {
        return { cursor: 'pointer' }
    };

    const percentStyle = (cell) => {
        return { backgroundColor: cell !== '-' && percentToColor(cell.slice(0,-1)), cursor: 'pointer' }
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
            sort: true,
            style: columnStyle
        },
        {
            dataField: 'city',
            text: 'City',
            sort: true,
            style: columnStyle
        },
        {
            dataField: 'percent_beds_full',
            text: '% of adult inpatient beds occupied',
            sort: false,
            sortFunc: sortFunc,
            style: percentStyle
        },
        {
            dataField: 'percent_icu_full',
            text: '% of adult ICU beds occupied',
            sort: false,
            sortFunc: sortFunc,
            style: percentStyle
        },
        {
            dataField: 'percent_covid',
            text: '% of admitted patients with suspected or confirmed COVID',
            sort: false,
            sortFunc: sortFunc,
            style: percentStyle
        },
        {
            dataField: 'percent_icu_covid',
            text: '% of ICU patients with suspected or confirmed COVID',
            sort: false,
            sortFunc: sortFunc,
            style: percentStyle
        },
        {
            dataField: 'collection_week',
            text: 'Collection Week Ending On',
            style: columnStyle
        }];

    // component to show when a row is expanded
    const expandRow = {
        renderer: row => <LineChart hospital_pk={row.hospital_pk} />
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
                : error ?
                    <p className="lead text-center mt-4">Error retrieving data.</p>
                    :
                    state &&
                    <>
                        <CountySelect setCounty={setCounty} county={county} state={state} data={tableData} isLoading={isLoading} />
                        <HospitalSelect setHospital={setHospital} hospital={hospital} state={state} data={tableData} isLoading={isLoading} />
                        <div id="table-container">
                            {tableData.length ?
                                <>
                                    <div className="text-center">
                                        <p className="lead pt-2 pb-2 mt-3 mb-3">
                                            📈 click on any row below to graph data from July 2020 to present
                                        </p>
                                    </div>
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
