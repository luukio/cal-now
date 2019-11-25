import layers from "./layers";
var dayHeaderComponent = {
    name: 'cal#Dayname',
    x: 0, y: 0,
    layers: { background: layers.backgroundHeader, dayname: layers.dayname }
};
var dayHeaderWeekendComponent = {
    name: 'cal#DaynameWeekend',
    x: 440, y: 0,
    layers: { background: layers.backgroundWeekendHeader, dayname: layers.daynameWeekend }
};
var dayComponent = {
    name: 'cal#Day',
    x: 0, y: 120,
    layers: { background: layers.background, day: layers.day, week: layers.week, month: layers.month }
};
var weekendComponent = {
    name: 'cal#Weekend',
    x: 440, y: 120,
    layers: { background: layers.backgroundWeekend, day: layers.dayWeekend }
};
export default {
    dayComponent, weekendComponent, dayHeaderComponent, dayHeaderWeekendComponent
};
