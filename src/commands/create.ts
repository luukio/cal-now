import * as moment from 'moment'
import layers from '../assets/layers'
import styles from '../assets/styles'
import components from '../assets/components'
import { weekStructure, headerStructure } from '../assets/calendar'
import { frameParent, frameNodesAndShow, loadFontsOfComponents, loadStyles } from '../utils'

//Populate Dates
export async function create(message): Promise<string | undefined> {

    const components = figma.currentPage.findAll(n => (n.name.includes('cal#')))
    if (!components) return "Make or go to page with calendar components first. 🙄"
    for (const component of components) {
        if (component.type !== 'COMPONENT') return "One of your calendar elements is not a component"
    }

    //Load all used fonts
    const missingFonts = await loadFontsOfComponents(components)
    if (missingFonts) return "One of the fonts is missing, please add or replace them first"

    //The building blocks
    const dayComponent = figma.currentPage.findOne(n => n.name === 'cal#Day') as ComponentNode
    const weekendComponent = figma.currentPage.findOne(n => n.name === 'cal#Weekend') as ComponentNode
    const daynameComponent = figma.currentPage.findOne(n => n.name === 'cal#Dayname') as ComponentNode
    const daynameWeekendComponent = figma.currentPage.findOne(n => n.name === 'cal#DaynameWeekend') as ComponentNode

    if (!dayComponent || !weekendComponent || !daynameComponent || !daynameWeekendComponent) return "Can't find one of the calendar elements, please rebuild components again!"

    loadStyles(styles)

    //Date Variables
    const currentDateStart = moment(message.date).day(1).add(-1, 'week')
    let monthSwitch = false

    //find furthest frame
    let anchorX = 0
    let anchorY = 0
    const allFrames = figma.currentPage.findAll(n => n.type == 'FRAME')
    if (allFrames) {
        for (const frame of allFrames) {
            anchorX = (anchorX >= frame.x + frame.width) 
                        ? anchorX 
                        : frame.x + frame.width
            anchorY = anchorY <= frame.y 
                        ? anchorY 
                        : frame.y
        }
    }
    
    //give it a bit of space
    anchorX = anchorX + 200

    //Make Calendar
    let currentX = anchorX
    let currentY = anchorY
    for (let i = 0; i <= parseInt(message.weeks) + 1; i++) {
        for (let j = 0; j < 7; j++) {

            const curDate = currentDateStart.clone().add((i * 7) + j, 'days')
            const curMonthName = curDate.format('MMMM')

            let node: InstanceNode

            if (i == 0) {
                if (j >= 0 && j <= 4) node = daynameComponent.createInstance()
                else node = daynameWeekendComponent.createInstance()
            } else {
                if (j >= 0 && j <= 4) node = dayComponent.createInstance()
                else node = weekendComponent.createInstance()
            }

            node.x = currentX
            node.y = currentY
            currentX += node.width

            let instanceName = node.name.replace(/cal#/g, "calItem#")
            node.name = instanceName

            let dayNameNode, dayTextNode, weekTextNode, monthTextNode, backgroundNode

            if (i == 0) {
                dayNameNode = node.findOne(n => n.name === '#dayname' && n.type == 'TEXT') as TextNode
                if (dayNameNode) {
                    if (j >= 0 && j <= 4) dayNameNode.characters = curDate.format('dddd')
                    else dayNameNode.characters = curDate.format('ddd')
                }
            } else {
                dayTextNode = node.findOne(n => n.name === '#day' && n.type == 'TEXT') as TextNode
                weekTextNode = node.findOne(n => n.name === '#week' && n.type == 'TEXT') as TextNode
                monthTextNode = node.findOne(n => n.name === '#month' && n.type == 'TEXT') as TextNode
                backgroundNode = node.findOne(n => n.name === "#background" && n.type === 'RECTANGLE') as RectangleNode

                if (dayTextNode) dayTextNode.characters = curDate.format('DD')
                if (weekTextNode) {
                    if (j == 0) weekTextNode.characters = String(i - 1)
                    else weekTextNode.characters = ""
                }
                if (monthTextNode) {
                    if (curDate.date() === 1) monthTextNode.characters = curMonthName //Only add month at start of every month
                    else if ((curDate.date() === 2 || curDate.date() === 3) && curDate.day() === 1) monthTextNode.characters = curMonthName //If it was in weekend, still add on Monday
                    else monthTextNode.characters = ""

                    if (i === 1 && j === 0) monthTextNode.characters = curMonthName //Always add month on first box anyway
                }

                //Alternate month for colours
                if (curDate.date() === 1) monthSwitch = !monthSwitch
                if (backgroundNode) {
                    if (monthSwitch) {
                        if (j >= 0 && j <= 4) backgroundNode.fillStyleId = styles.backgroundAltStyle.id
                        else backgroundNode.fillStyleId = styles.backgroundAltWeekendStyle.id
                    }
                }
            }
        }

        currentX = anchorX //reset x
        if (i == 0) currentY += daynameComponent.height
        else currentY += dayComponent.height
    }

    const calendarItems = figma.currentPage.findAll(n => n.name.includes('calItem#') && n.parent.type == 'PAGE') as InstanceNode[]
    frameNodesAndShow(calendarItems, "Your Calendar", 80)

    return "Calendar created. ⚡️"
}