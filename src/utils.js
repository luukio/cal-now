var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function frameParent(node) {
    if (node.parent.type === "FRAME") {
        return node.parent;
    }
    else {
        const parent = node.parent;
        return frameParent(parent);
    }
}
export function loadStyles(styles) {
    const existingFillStyles = figma.getLocalPaintStyles();
    for (const key in styles) {
        const style = styles[key];
        const fillStyle = existingFillStyles.find(({ name }) => name === style.name);
        if (fillStyle)
            style.id = fillStyle.id;
        else
            newStyle(style);
    }
}
function newStyle(style) {
    const newStyle = figma.createPaintStyle();
    newStyle.name = style.name;
    newStyle.paints = style.colour;
    //save id for later use
    style.id = newStyle.id;
}
export function positionElementToNodes(element, nodes) {
    let x = nodes[0].x;
    let y = nodes[0].y;
    for (const child of nodes) {
        if (child.x < x)
            x = child.x;
        if (child.y < y)
            y = child.y;
    }
    element.x = x;
    element.y = y;
}
export function resizeElementToNodes(element, nodes, padding) {
    //Resize element to fit all the other elements, with padding
    let width;
    let height;
    for (const child of nodes) {
        width = width
            ? Math.max(width, child.x + child.width)
            : child.x + child.width;
        height = height
            ? Math.max(height, child.y + child.height)
            : child.y + child.height;
        child.x = child.x + padding;
        child.y = child.y + padding;
    }
    element.resizeWithoutConstraints(width + padding * 2, height + padding * 2);
}
export function frameNodesAndShow(nodes, name, padding) {
    const frame = figma.createFrame();
    frame.name = name;
    frame.exportSettings = [{ format: "PDF" }];
    positionElementToNodes(frame, nodes);
    for (const component of nodes) {
        component.x = component.x - frame.x;
        component.y = component.y - frame.y;
        frame.appendChild(component);
    }
    resizeElementToNodes(frame, nodes, padding);
    figma.viewport.scrollAndZoomIntoView([frame]);
}
export function hexToRGB(h) {
    let r, g, b;
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
export function clone(val) {
    const type = typeof val;
    if (val === null) {
        return null;
    }
    else if (type === 'undefined' || type === 'number' || type === 'string' || type === 'boolean') {
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
export function loadFontsOfComponents(components) {
    return __awaiter(this, void 0, void 0, function* () {
        const fontsList = [];
        //Only find text nodes
        for (const component of components) {
            const textNodes = component.findAll(n => n.type === "TEXT");
            //Check all fonts used, make list
            for (const textNode of textNodes) {
                if (textNode.hasMissingFont)
                    return "One of the fonts is missing, please add or replace them first";
                //Check fonts on each character of the text
                let len = textNode.characters.length;
                for (let i = 0; i < len; i++) {
                    const fontName = textNode.getRangeFontName(i, i + 1);
                    const fontIsInList = fontsList.findIndex(i => i.family === fontName.family && i.style === fontName.style) >= 0;
                    if (!fontIsInList)
                        fontsList.push(fontName);
                }
            }
        }
        //Require relevant fonts
        for (const fonts of fontsList) {
            yield figma.loadFontAsync(fonts);
        }
    });
}
