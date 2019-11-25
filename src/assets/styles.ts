import { hexToRGB } from '../utils'

const backgroundStyle = {
    colour: [ { type: 'SOLID', color: hexToRGB("#EBEBEB") } ],
    name: "Background",
    id: ""
} 

const backgroundWeekendStyle = {
    colour: [ { type: 'SOLID', color: hexToRGB("#F5F5F5") } ],
    name: "Background Weekend",
    id: ""
}

const backgroundAltStyle = {
    colour: [ { type: 'SOLID', color: hexToRGB("#D7D7D7") } ],
    name: "Background ALT",
    id: ""
}

const backgroundAltWeekendStyle = {
    colour: [ { type: 'SOLID', color: hexToRGB("#EAEAEA") } ],
    name: "Background ALT Weekend",
    id: ""
}

export default {
    backgroundStyle, backgroundWeekendStyle, backgroundAltStyle, backgroundAltWeekendStyle
}