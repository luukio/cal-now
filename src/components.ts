import { clone, hexToRGB } from './utils'

////  INDIVIDUAL LAYERS ////

// Week Number Text
const week = {
    set: {
        type: 'TEXT',
        width: 60,
        height: 72,
    },
    name: '#week',
    fontName: {
        family: 'Work Sans',
        style: 'SemiBold',
    },
    textAlignVertical: 'BOTTOM',
    characters: '0',
    fontSize: 58,
    opacity: 0.15,
    letterSpacing: {
        value: -5,
        unit: 'PIXELS',
    },
    x: 22,
    y: 254,
    constraints: {
        horizontal: 'MIN',
        vertical: 'MAX'
    },
}

// Background
const background = {
    set: {
        type: 'RECTANGLE',
        width: 400,
        height: 340,
    },
    name: '#background',
    opacity: 1,
    fills: [ { type: 'SOLID', color: hexToRGB("#EBEBEB") } ],
    strokes: [ { type: 'SOLID', color: hexToRGB("#FFF") } ],
    strokeWeight: 4,
    strokeAlign: 'INSIDE',
    x: 0,
    y: 0,
    constraints: {
        horizontal: 'STRETCH',
        vertical: 'STRETCH'
    },
}

// Background for Weekend
const backgroundWeekend = clone(background)
backgroundWeekend.set.width = background.set.width / 2
backgroundWeekend.fills = [ { type: 'SOLID', color: hexToRGB("#F5F5F5") } ]

// Day Number Text
const day = {
    set: {
        type: 'TEXT',
        width: 94,
        height: 90,
    },
    name: '#day',
    fontName: {
        family: 'Work Sans',
        style: 'SemiBold',
    },
    textAlignHorizontal: 'RIGHT',
    characters: '01',
    fontSize: 72,
    letterSpacing: {
        value: -5,
        unit: 'PIXELS',
    },
    textCase: 'ORIGINAL',
    x: 283,
    y: 12,
    constraints: {
        horizontal: 'MAX',
        vertical: 'MIN'
    },
}

// Day Number Text Weekend
const dayWeekend = clone(day)
dayWeekend.x = 83
dayWeekend.opacity = 0.1

// Month Text
const month = {
    set: {
        type: 'TEXT',
        width: 240,
        height: 46,
    },
    name: '#month',
    fontName: {
        family: 'Work Sans',
        style: 'Bold',
    },
    characters: 'Month',
    fontSize: 36,
    opacity: 0.5,
    textCase: 'UPPER',
    x: 30,
    y: 26,
    constraints: {
        horizontal: 'MIN',
        vertical: 'MIN'
    },
}

// Background for Header
const backgroundHeader = clone(background)
backgroundHeader.set.height = 80
backgroundHeader.strokes = []
backgroundHeader.opacity = 1
backgroundHeader.fills = [ { type: 'SOLID', color: hexToRGB("#000") } ]

// Background for Weekend Header
const backgroundWeekendHeader = clone(backgroundHeader)
backgroundWeekendHeader.set.width = background.set.width / 2

// Day Name Text for Header
const dayname = {
    set: {
        type: 'TEXT',
        width: background.set.width,
        height: 50,
    },
    name: '#dayname',
    fontName: {
        family: 'Work Sans',
        style: 'Bold',
    },
    textAlignVertical: 'CENTER',
    textAlignHorizontal: 'CENTER',
    characters: 'Monday',
    fontSize: 40,
    textCase: 'UPPER',
    fills: [ { type: 'SOLID', color: hexToRGB("#FFF") } ],
    x: 0,
    y: 15,
    constraints: {
        horizontal: 'STRETCH',
        vertical: 'SCALE'
    },
}

// Day Name Text for Weekend Header
const daynameWeekend = clone(dayname)
daynameWeekend.set.width = background.set.width / 2
daynameWeekend.characters = 'Sat'


////  COMPONENTS ////

var dayHeaderComponent = {
    name: 'cal#Dayname',
    x: 0, y: 0,
    layers: { background: backgroundHeader, dayname: dayname}
}

var dayHeaderWeekendComponent = {
    name: 'cal#DaynameWeekend',
    x: 440, y: 0,
    layers: { background: backgroundWeekendHeader, dayname: daynameWeekend}
}

var dayComponent = {
    name: 'cal#Day',
    x: 0, y: 120,
    layers: { background: background, day: day, week: week, month: month }
}

var weekendComponent = {
    name: 'cal#Weekend',
    x: 440, y: 120,
    layers: { background: backgroundWeekend, day: dayWeekend}
}

export default {
    dayComponent, weekendComponent, dayHeaderComponent, dayHeaderWeekendComponent
}