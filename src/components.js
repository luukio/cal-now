const back = {
    set: {
        type: 'FRAME',
        width: 1680,
        height: 840,
    },
    name: 'Calendar Components',
    backgrounds: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
    x: -100,
    y: -300,
};
const background = {
    set: {
        type: 'RECTANGLE',
        width: 540,
        height: 440,
    },
    name: '#background',
    opacity: 0.25,
    fills: [{ type: 'SOLID', color: hexToRGB("#CCC") }],
    strokes: [{ type: 'SOLID', color: hexToRGB("#FFF") }],
    strokeWeight: 4,
    strokeAlign: 'INSIDE',
    x: 0,
    y: 0,
};
const backgroundWeekend = clone(background);
backgroundWeekend.set.width = background.set.width / 2;
backgroundWeekend.fills = [{ type: 'SOLID', color: hexToRGB("#E3E3E3") }];
const backgroundHeader = clone(background);
backgroundHeader.set.height = 125;
backgroundHeader.strokes = [];
const backgroundWeekendHeader = clone(backgroundHeader);
backgroundWeekendHeader.set.width = background.set.width / 2;
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
};
const dayWeekend = clone(day);
dayWeekend.x = 143;
dayWeekend.opacity = 0.1;
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
};
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
};
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
};
const daynameWeekend = clone(dayname);
daynameWeekend.set.width = background.set.width / 2;
daynameWeekend.characters = 'Sat';
//Components Groups
var monDayGroup = {
    name: 'cal#Monday',
    x: 0, y: 0,
    layers: { background: background, day: day, week: week, month: month }
};
var weekDayGroup = {
    name: 'cal#Day',
    x: 600, y: 0,
    layers: { background: background, day: day, month: month }
};
var weekendGroup = {
    name: 'cal#Weekend',
    x: 1200, y: 0,
    layers: { background: backgroundWeekend, day: dayWeekend }
};
var dayNameGroup = {
    name: 'cal#Dayname',
    x: 0, y: -200,
    layers: { background: backgroundHeader, dayname: dayname }
};
var dayNameWeekendGroup = {
    name: 'cal#DaynameWeekend',
    x: 1200, y: -200,
    layers: { background: backgroundWeekendHeader, dayname: daynameWeekend }
};
export default {
    monDayGroup, dayNameGroup, weekDayGroup, weekendGroup, dayNameWeekendGroup
};
function hexToRGB(h) {
    let r = 0, g = 0, b = 0;
    if (h.length == 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        b = "0x" + h[3] + h[3];
    }
    else if (h.length == 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
    }
    r = +(r / 255).toFixed(2);
    g = +(g / 255).toFixed(2);
    b = +(b / 255).toFixed(2);
    return { r: r, g: g, b: b };
}
function clone(val) {
    const type = typeof val;
    if (val === null) {
        return null;
    }
    else if (type === 'undefined' || type === 'number' ||
        type === 'string' || type === 'boolean') {
        return val;
    }
    else if (type === 'object') {
        if (val instanceof Array) {
            return val.map(x => clone(x));
        }
        else if (val instanceof Uint8Array) {
            return new Uint8Array(val);
        }
        else {
            let o = {};
            for (const key in val) {
                o[key] = clone(val[key]);
            }
            return o;
        }
    }
    throw 'unknown';
}
