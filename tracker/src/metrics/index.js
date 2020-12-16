const NO_DATA = "-";

export const isRedacted = (value) => {
    // redacted values in dataset are tagged as -999999
    return value === -999999;
}

export const isRatioDataMissing = (a, b) => isRedacted(a) || isRedacted(b) || !a || !b;

export const percentBedsFull = (row) => {
    if (isRatioDataMissing(row.all_adult_hospital_inpatient_beds, row.all_adult_hospital_inpatient_bed_occupied)) {
        return NO_DATA;
    } else {
        return ((row.all_adult_hospital_inpatient_bed_occupied / row.all_adult_hospital_inpatient_beds) * 100).toFixed() + '%';
    }
}

export const percentICUFull = (row) => {
    if (isRatioDataMissing(row.staffed_adult_icu_bed_occupancy, row.total_staffed_adult_icu_beds)) {
        return NO_DATA;
    } else {
        return ((row.staffed_adult_icu_bed_occupancy / row.total_staffed_adult_icu_beds) * 100).toFixed() + '%';
    }
}

export const percentCOVID = (row) => {
    if (isRatioDataMissing(row.total_adult_patients_hospitalized_confirmed_and_suspected_covid, row.all_adult_hospital_inpatient_bed_occupied)) {
        return NO_DATA;
    } else {
        return ((row.total_adult_patients_hospitalized_confirmed_and_suspected_covid / row.all_adult_hospital_inpatient_bed_occupied) * 100).toFixed() + '%';
    }
}
