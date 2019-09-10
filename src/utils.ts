export function findFrameParent(node) {
    if (node.parent.type === "FRAME") {
        const parentID = node.parent.id
        return parentID
    } else {
        const parent = node.parent
        return findFrameParent(parent)
    }
}

export function resizeParentToNodes(parent, nodes) {
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
    parent.resizeWithoutConstraints(width, height)
}

export async function loadFontsOfComponents(components): Promise<string | undefined> {
    const textElements = []
    const fontsList = []

    //Only find text nodes
    for (const component of components) {
        const textNodes = (component as ComponentNode).findAll(n => n.type === "TEXT")
        for (const textNode of textNodes) {
        textElements.push(textNode)
        }
    }

    //Make list of all fonts used
    for (const element of textElements) {
        if (element.hasMissingFont) return "One of the fonts is missing, please add or replace them first"

        let len = element.characters.length
        for (let i = 0; i < len; i++) {
        const fontName = element.getRangeFontName(i, i+1)
        const containsFont = fontsList.findIndex(i => i.family === fontName.family && i.style === fontName.style) >= 0;
        if (!containsFont) fontsList.push(fontName)
        }    
    }

    //Require relevant fonts
    for (const fonts of fontsList) {
        await figma.loadFontAsync(fonts)
    }
}