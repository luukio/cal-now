import { build } from './commands/build'
import { create } from './commands/create'

figma.showUI(__html__, {
  height: 360, //90
  width: 240
})

figma.ui.onmessage = msg => {
  //check if message is correct, otherwise cancel
  if (msg.type === 'build') {
    build().then((message: string | undefined) => {
      figma.notify(message, {timeout: 2000})
      // figma.ui.resize(240, 360)
      figma.ui.postMessage('built')
    })
  } else if (msg.type === 'create') {
    create(msg.data).then((message: string | undefined) => {
      figma.notify(message)
    })
  } else if (msg.type === 'openinfo') {
    figma.ui.resize(240, 490)
  } else if (msg.type === 'closeinfo') {
    setTimeout(function() { figma.ui.resize(240, 360) }, 400)
  } else {
    figma.closePlugin("Message not recognised 🥳")
  }
}

//If components are already created, enable button
const componentsExist = figma.currentPage.findAll(n => (n.name.includes('cal#')))
if (componentsExist.length > 0) {
  // figma.ui.resize(240, 360)
  figma.ui.postMessage('built')
}