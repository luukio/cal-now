import { hexToRGB } from '../utils'

const backgroundHeaderStyle = {
    colour: [ { type: 'SOLID', color: hexToRGB("#000") } ],
    name: "Cal/Header",
    id: ""
} 

const backgroundStyle = {
    colour: [ { type: 'SOLID', color: hexToRGB("#EBEBEB") } ],
    name: "Cal/Month",
    id: ""
} 

const backgroundWeekendStyle = {
    colour: [ { type: 'SOLID', color: hexToRGB("#F5F5F5") } ],
    name: "Cal/Month Weekend",
    id: "",
}

const backgroundAltStyle = {
    colour: [ { type: 'SOLID', color: hexToRGB("#D7D7D7") } ],
    name: "Cal/Odd Month",
    id: ""
}

const backgroundAltWeekendStyle = {
    colour: [ { type: 'SOLID', color: hexToRGB("#EAEAEA") } ],
    name: "Cal/Odd Month Weekend",
    id: ""
}

export default {
    backgroundHeaderStyle, backgroundStyle, backgroundWeekendStyle, backgroundAltStyle, backgroundAltWeekendStyle
}