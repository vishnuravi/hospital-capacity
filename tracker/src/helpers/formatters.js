export function toTitleCase(str) {
    return str.toLowerCase().replace(/(?:^|[\s-/])\w/g, function (match) {
        return match.toUpperCase();
    });
}

export function weekToString(startDay){
    const startDate = new Date(startDay);
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 7);
    return endDate.toLocaleDateString();
}

export function percentToColor(percent){
    const p = 100-percent;
    var red = p<50 ? 255 : Math.round(256 - (p-50)*5.12);
    var green = p>50 ? 255 : Math.round((p)*5.12);
    return "rgb(" + red + "," + green + ",0)";
}