export function toTitleCase(str) {
    // changes a string to title case including words separated by a dash
    return str.toLowerCase().replace(/(?:^|[\s-/])\w/g, function (match) {
        return match.toUpperCase();
    });
}

export function formatCollectionWeek(startDay){
    // returns a string with the end date of the collection week
    const date = new Date(startDay);
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString();
}

export function percentToColor(percent){
    // returns a RGB color from green to red based on a percentage
    const p = 100-percent;
    var red = p<50 ? 255 : Math.round(256 - (p-50)*5.12);
    var green = p>50 ? 255 : Math.round((p)*5.12);
    return "rgb(" + red + "," + green + ",0)";
}