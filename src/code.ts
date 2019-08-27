import * as moment from 'moment'

/* TO DO 
x None
*/

figma.showUI(__html__, {
  height: 380
})

figma.ui.onmessage = msg => {
  //check if message is correct, otherwise cancel
  if (msg.type === 'create') {
    create(msg.data).then((message: string | undefined) => {
      figma.notify(message)
    })
  } else if (msg.type === 'cancel') {
    figma.closePlugin()
  } else {
    figma.closePlugin("Message not recognised 🥳")
  }
};

//Populate Dates
async function create(message): Promise<string | undefined> {

  //load selection if any
  let selection = figma.currentPage.selection[0] as NodeWithChildren
  if (!selection) return "Select the group named 'week-item' or 'week-item-sunday'."

  //if something is selected, but its not our group 'week-item', lets look for it ourselves
  if (selection.name != "week-item" || selection.type != 'GROUP') {
    const parentFrameId = findFrameParent(selection)  
    const parentFrame = figma.getNodeById(parentFrameId) as FrameNode
    selection = parentFrame.findOne(n => (n.name === "week-item" || n.name === "week-item-sunday") && n.type === "GROUP") as NodeWithChildren
    if (!selection) return "Can't find your group 'week-item' or 'week-item-sunday' 🙄"
  }

  //find all used fonts
  const fontsList = []
  const textElements = selection.findAll(n => n.type === "TEXT")
  for (const element of textElements) {
    const fontElement = element as TextNode
    if (fontElement.hasMissingFont) return "One of the fonts is missing, please add or replace them first"

    const fontName = fontElement.fontName as FontName

    //if text has mixed styles, notify user
    const invalidFont = !fontName.family
    if (invalidFont) return "Please make sure no text elements have mixed font styles"

    const containsFont = fontsList.findIndex(i => i.family === fontName.family && i.style === fontName.style) >= 0;
    if (!containsFont) fontsList.push(fontName)
  }
  
  //Require relevant fonts
  for (const fonts of fontsList) {
    await figma.loadFontAsync(fonts)
  }

  const nodes = []
  //Date Variables
  let startOfWeek: number
  if (selection.name === "week-item") startOfWeek = 1
  if (selection.name === "week-item-sunday") startOfWeek = 0
  const currentDateStart = moment(message.date).day(startOfWeek)
  let monthSwitch = false

  //Make the amount of specified weeks and populate
  for (let i = 0; i <= message.weeks; i++) {
    //Make a new clone
    const node = selection as FrameNode
    const nodeClone = node.clone()

    //Change its Y Position
    nodeClone.y += nodeClone.height * i

    //Change its Week Numbers
    const weekNo = nodeClone.findOne(n => n.name === "week" && n.type === "TEXT") as TextNode
    if(weekNo) weekNo.characters = String(i)

    //Get its Days, Months & Backgrounds Elements
    const days = nodeClone.findAll(n => n.name === "day" && n.type === "TEXT")
    const months = nodeClone.findAll(n => n.name === "month" && n.type === "TEXT")
    const backgrounds = nodeClone.findAll(n => n.name === "background" && n.type === "RECTANGLE")

    //Change its Days, Months & Backgrounds Elements
    for (let j = 0; j < 7; j++) {
      const curDate = currentDateStart.clone().add( (i*7) + j, 'days')
      const curDayName = curDate.format('DD')
      const curMonthName = curDate.format('MMMM')

      const singleDay = days[j] as TextNode
      const singleMonth = months[j] as TextNode
      const singleBackground = backgrounds[j] as RectangleNode

      //Change its days
      if (singleDay) singleDay.characters = curDayName

      //Change its months
      if (singleMonth) {
        //Only add month at start of every month
        if (curDate.date() === 1) {
          //Don't add if its a sunday
          if (curDate.day() === 0 && curDate.day() === 6) singleMonth.characters = ""
          else singleMonth.characters  = curMonthName
        } else if ((curDate.date() === 2 || curDate.date() === 3) && curDate.day() === 1) singleMonth.characters  = curMonthName //If it was Sunday, still add on Monday
        else singleMonth.characters  = ""
        //First box still always has month, check for sunday/monday
        const startBox = 1 - startOfWeek
        if (i === 0 && j === startBox) singleMonth.characters  = curMonthName
      }

      //Alternate month for colours
      if (curDate.date() === 1) monthSwitch = !monthSwitch
      //Change its backgrounds
      if (singleBackground) {
        if (monthSwitch) singleBackground.opacity = 0.5
        else singleBackground.opacity = 0.25
      }

    }
    nodes.push(nodeClone)
  }

  //Get original parent frame before removing
  const selectionFrameId = findFrameParent(selection)
  const selectionFrame = figma.getNodeById(selectionFrameId) as FrameNode
  selection.remove()

  //Make new frame group and append to original parent frame
  const calendar = figma.createFrame()
  calendar.name = "calendar"
  selectionFrame.appendChild(calendar)

  //Place frame in original postition
  let x: number
  let y: number
  for (const child of nodes) {
    x = x ? Math.min(x, child.x) : child.x
    y = y ? Math.min(y, child.y) : child.y
  }
  calendar.x = x
  calendar.y = y

  //Add all weeks into the frame group
  for (const child of nodes) {
    child.x = child.x - x
    child.y = child.y - y
    calendar.appendChild(child)
  }

  //Resize frame group to show all the weeks
  let width: number
  let height: number
  for (const child of nodes) {
    width = width
    ? Math.max(width, child.x + child.width)
    : child.x + child.width

    height = height
    ? Math.max(height, child.y + child.height)
    : child.y + child.height
  }
  calendar.resizeWithoutConstraints(width, height)
  
  //Add to selection and zoom into view
  figma.currentPage.selection = [calendar]
  figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection)
  return "Done. ⚡️"
}

type NodeWithChildren = FrameNode | ComponentNode | InstanceNode | BooleanOperationNode

function findFrameParent(node) {
  if (node.parent.type === "FRAME") {
    const parentID = node.parent.id
    return parentID
  } else {
    const parent = node.parent
    return findFrameParent(parent)
  }
}