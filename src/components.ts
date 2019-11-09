import { clone, hexToRGB } from './utils'

////  INDIVIDUAL LAYERS ////

// Background
const background = {
    set: {
        type: 'RECTANGLE',
        width: 540,
        height: 440,
    },
    name: '#background',
    opacity: 0.25,
    fills: [ { type: 'SOLID', color: hexToRGB("#CCC") } ],
    strokes: [ { type: 'SOLID', color: hexToRGB("#FFF") } ],
    strokeWeight: 4,
    strokeAlign: 'INSIDE',
    x: 0,
    y: 0,
}

// Background for Weekend
const backgroundWeekend = clone(background)
backgroundWeekend.set.width = background.set.width / 2
backgroundWeekend.fills = [ { type: 'SOLID', color: hexToRGB("#E3E3E3") } ]

// Day Number Text
const day = {
    set: {
        type: 'TEXT',
        width: 125,
        height: 120,
    },
    name: '#day',
    fontName: {
        family: 'Work Sans',
        style: 'SemiBold',
    },
    textAlignVertical: 'CENTER',
    characters: '01',
    fontSize: 86,
    letterSpacing: {
        value: -5,
        unit: 'PIXELS',
    },
    textCase: 'ORIGINAL',
    x: 415,
    y: 0,
}

// Day Number Text Weekend
const dayWeekend = clone(day)
dayWeekend.x = 143
dayWeekend.opacity = 0.1

// Week Text
const week = {
    set: {
        type: 'TEXT',
        width: 120,
        height: 110,
    },
    name: '#week',
    fontName: {
        family: 'Work Sans',
        style: 'SemiBold',
    },
    textAlignVertical: 'CENTER',
    characters: '0',
    fontSize: 68,
    opacity: 0.15,
    letterSpacing: {
        value: -5,
        unit: 'PIXELS',
    },
    x: 24,
    y: 330,
}

// Month Text
const month = {
    set: {
        type: 'TEXT',
        width: 350,
        height: 60,
    },
    name: '#month',
    fontName: {
        family: 'Work Sans',
        style: 'Bold',
    },
    characters: 'Month',
    fontSize: 50,
    opacity: 0.5,
    textCase: 'UPPER',
    x: 30,
    y: 35,
}

// Background for Header
const backgroundHeader = clone(background)
backgroundHeader.set.height = 125
backgroundHeader.strokes = []

// Background for Weekend Header
const backgroundWeekendHeader = clone(backgroundHeader)
backgroundWeekendHeader.set.width = background.set.width / 2

// Day Name Text for Header
const dayname = {
    set: {
        type: 'TEXT',
        width: background.set.width,
        height: 72,
    },
    name: '#dayname',
    fontName: {
        family: 'Work Sans',
        style: 'Bold',
    },
    textAlignVertical: 'CENTER',
    textAlignHorizontal: 'CENTER',
    characters: 'Monday',
    fontSize: 60,
    textCase: 'UPPER',
    x: 0,
    y: 28,
}

// Day Name Text for Weekend Header
const daynameWeekend = clone(dayname)
daynameWeekend.set.width = background.set.width / 2
daynameWeekend.characters = 'Sat'


////  COMPONENTS ////

var weekNoComponent = {
    name: 'cal#Week',
    x: 0, y: 0,
    layers: { week: week }
}

var weekDayComponent = {
    name: 'cal#Day',
    x: 200, y: 0,
    layers: { background: background, day: day, month: month }
}

var weekendComponent = {
    name: 'cal#Weekend',
    x: 800, y: 0,
    layers: { background: backgroundWeekend, day: dayWeekend}
}

var dayNameComponent = {
    name: 'cal#Dayname',
    x: 200, y: -200,
    layers: { background: backgroundHeader, dayname: dayname}
}

var dayNameWeekendComponent = {
    name: 'cal#DaynameWeekend',
    x: 800, y: -200,
    layers: { background: backgroundWeekendHeader, dayname: daynameWeekend}
}

export default {
    weekNoComponent, dayNameComponent, weekDayComponent, weekendComponent, dayNameWeekendComponent
}