import Select from 'react-select';
import { useState, useEffect } from 'react';

const HospitalSelect = ({ data, hospital, state, setHospital, isLoading }) => {

    const [hospitalList, setHospitalList] = useState();

    const handleStateChange = (selectedHospital) => {
        setHospital(selectedHospital);
    };

    useEffect(() => {
        // get all counties for the current state from the dataset
        const newHospitalList = data.map((row) => {
            return ({
                value: row.hospital_pk,
                label: row.hospital_name
            })
        })
        setHospitalList(newHospitalList);
    }, [])

    return (
        <>
            <Select
                value={hospital}
                onChange={selectedHospital => handleStateChange(selectedHospital)}
                options={hospitalList}
                isLoading={isLoading}
                isClearable={true}
                placeholder="Search by hospital name..."
                className="mx-auto col-lg-4"
            />
        </>
    )
}

export default HospitalSelect;
