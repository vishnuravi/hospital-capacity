import Select from 'react-select';
import stateList from '../data/states.json';

const StateSelect = ({ state, setState, isLoading }) => {

    const handleStateChange = (selectedState) => {
        setState(selectedState);
    }

    return (
        <>
            <Select
                value={state}
                onChange={selectedState => handleStateChange(selectedState)}
                options={stateList.states} 
                isLoading={isLoading}
                placeholder="Choose a state"
                className="mx-auto col-lg-4 mb-1"
            />
        </>
    )
};

export default StateSelect;
