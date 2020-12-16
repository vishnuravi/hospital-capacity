import Select from 'react-select';
import { useState, useEffect } from 'react';

const CitySelect = ({ city, setCity, data, isLoading }) => {

    const [cityList, setCityList] = useState();

    const handleStateChange = (selectedCity) => {
        setCity(selectedCity);
    };

    useEffect(() => {
        // get city names
        const cities = data.map(row => row.city);
        // remove duplicates
        const uniqueCities = [...new Set(cities)];
        const newCityList = uniqueCities.map((city) => {
            return ({
                value: city.toLowerCase(),
                label: city
            })
        })
        setCityList(newCityList);
    }, [])

    return (
        <>
            <Select
                value={city}
                onChange={selectedState => handleStateChange(selectedState)}
                options={cityList}
                isLoading={isLoading}
                isClearable={true}
                placeholder="Filter by city"
                className="mx-auto col-lg-4"
            />
        </>
    )
}

export default CitySelect;
