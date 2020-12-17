import Select from 'react-select';
import { useState, useEffect } from 'react';
import counties from '../data/county_fips';

const CountySelect = ({ county, state, setCounty, isLoading }) => {

    const [countyList, setCountyList] = useState();

    const handleStateChange = (selectedCounty) => {
        setCounty(selectedCounty);
    };

    useEffect(() => {
        // get all counties for the current state from the dataset
        const countiesByState = counties.filter((county) => county.state_abbr === state.value)
        const newCountyList = countiesByState.map((county) => {
            return ({
                value: county.fips,
                label: county.county_name
            })
        })
        setCountyList(newCountyList);
    }, [])

    return (
        <>
            <Select
                value={county}
                onChange={selectedCounty => handleStateChange(selectedCounty)}
                options={countyList}
                isLoading={isLoading}
                isClearable={true}
                placeholder="Select a county..."
                className="mx-auto col-lg-4"
            />
        </>
    )
}

export default CountySelect;
