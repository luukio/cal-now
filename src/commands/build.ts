import layers from '../assets/layers'
import styles from '../assets/styles'
import components from '../assets/components'
import { frameNodesAndShow, resizeElementToNodes, loadStyles, hexToRGB } from '../utils'

//Make components
export async function build(): Promise<string | undefined> {

    const componentsExist = figma.currentPage.findAll(n => (n.name.includes('cal#')))
    if (componentsExist.length > 0) return "'cal#' components exist, delete them first or start building."

    //load styles
    loadStyles(styles)

    //each component in list
    for (const key in components) {
        const component = components[key]

        //setup new component
        const newComponent = figma.createComponent()
        newComponent.name = component.name
        newComponent.x = component.x
        newComponent.y = component.y

        //each layer in component
        for (const key in component.layers) {
            let node: RectangleNode | TextNode
            const layer = component.layers[key]

            if (layer.set.type === 'RECTANGLE') node = figma.createRectangle()
            if (layer.set.type === 'TEXT') node = figma.createText()

            //each property in layer
            for (const key in layer) {
                if (key == 'fontName') await figma.loadFontAsync(layer[key])
                if (key != 'set') node[key] = layer[key]
            }

            //if layer has a fill style, add it
            if (layer.set.fillStyle) node.fillStyleId = styles[layer.set.fillStyle].id

            //resize layer to set size
            node.resizeWithoutConstraints(layer.set.width, layer.set.height)
            newComponent.appendChild(node)
        }

        //resize component to layers
        resizeElementToNodes(newComponent, newComponent.children, 0)

    }

    //Make a new named frame with 100 padding around components
    const calendarComponents = figma.currentPage.findAll(n => (n.name.includes('cal#')))
    frameNodesAndShow(calendarComponents, "Calendar Components", 60, "#BBB")

    //enable UI button
    figma.ui.postMessage('built')
    return "Components Built. ⚡️"
}