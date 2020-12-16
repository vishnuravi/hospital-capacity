export function toTitleCase(str) {
    return str.toLowerCase().replace(/(?:^|[\s-/])\w/g, function (match) {
        return match.toUpperCase();
    });
}

export function weekToString(startDay){
    const startDate = new Date(startDay);
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 7);
    return startDate.toLocaleDateString() + ' to ' + endDate.toLocaleDateString();
}