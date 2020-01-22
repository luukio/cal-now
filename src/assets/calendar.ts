import l from "./layers"
import c from "./components"

export const headerStructure = [
    {
        name: c.dayHeaderComponent.name,
        changeLayers: [l.dayname.name, l.background.name]
    },
    {
        name: c.dayHeaderComponent.name,
        changeLayers: [l.dayname.name, l.background.name]
    },
    {
        name: c.dayHeaderComponent.name,
        changeLayers: [l.dayname.name, l.background.name]
    },
    {
        name: c.dayHeaderComponent.name,
        changeLayers: [l.dayname.name, l.background.name]
    },
    {
        name: c.dayHeaderComponent.name,
        changeLayers: [l.dayname.name, l.background.name]
    },
    {
        name: c.dayHeaderWeekendComponent.name,
        changeLayers: [l.dayname.name, l.background.name],
        weekend: true
    },
    {
        name: c.dayHeaderWeekendComponent.name,
        changeLayers: [l.dayname.name, l.background.name],
        weekend: true
    }
]

export const weekStructure = [
    {
        name: c.dayComponent.name,
        changeLayers: [l.day.name, l.week.name, l.month.name, l.background.name]
    },
    {
        name: c.dayComponent.name,
        changeLayers: [l.day.name, l.month.name, l.background.name]
    },
    {
        name: c.dayComponent.name,
        changeLayers: [l.day.name, l.month.name, l.background.name]
    },
    {
        name: c.dayComponent.name,
        changeLayers: [l.day.name, l.month.name, l.background.name]
    },
    {
        name: c.dayComponent.name,
        changeLayers: [l.day.name, l.month.name, l.background.name]
    },
    {
        name: c.weekendComponent.name,
        changeLayers: [l.day.name, l.month.name, l.background.name],
        weekend: true
    },
    {
        name: c.weekendComponent.name,
        changeLayers: [l.day.name, l.month.name, l.background.name],
        weekend: true
    }
]