import React from 'react'

export default function Header() {
    return (
        <>
            <h1 className="text-center my-4">Hospital Capacity Tracker</h1>
            <p className="text-center">An <a href="https://github.com/vishnuravi/hospital-capacity" target="_blank" rel="noreferrer">open source project</a> by <a href="https://vishnu.io" target="_blank" rel="noreferrer">Vishnu Ravi</a> with data from <a href="https://healthdata.gov/dataset/covid-19-reported-patient-impact-and-hospital-capacity-facility" target="_blank">HealthData.gov</a>.</p>
            <p className="text-center">Data is aggregated weekly and new data is published by HHS every Monday <a href="https://healthdata.gov/dataset/covid-19-reported-patient-impact-and-hospital-capacity-facility" target="_blank">(more info)</a>.</p>
        </>
    )
}



