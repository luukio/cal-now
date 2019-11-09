var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function findFrameParent(node) {
    if (node.parent.type === "FRAME") {
        const parentID = node.parent.id;
        return parentID;
    }
    else {
        const parent = node.parent;
        return findFrameParent(parent);
    }
}
export function resizeElementToNodes(element, nodes) {
    //Resize frame group to show all the children
    let width;
    let height;
    for (const child of nodes) {
        width = width
            ? Math.max(width, child.x + child.width)
            : child.x + child.width;
        height = height
            ? Math.max(height, child.y + child.height)
            : child.y + child.height;
    }
    element.resizeWithoutConstraints(width, height);
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
        const textNodeList = [];
        const fontsList = [];
        //Only find text nodes
        for (const component of components) {
            const textNodes = component.findAll(n => n.type === "TEXT");
            for (const textNode of textNodes) {
                textNodeList.push(textNode);
            }
        }
        //Make list of all fonts used
        for (const node of textNodeList) {
            if (node.hasMissingFont)
                return "One of the fonts is missing, please add or replace them first";
            let len = node.characters.length;
            for (let i = 0; i < len; i++) {
                const fontName = node.getRangeFontName(i, i + 1);
                const containsFont = fontsList.findIndex(i => i.family === fontName.family && i.style === fontName.style) >= 0;
                if (!containsFont)
                    fontsList.push(fontName);
            }
        }
        //Require relevant fonts
        for (const fonts of fontsList) {
            yield figma.loadFontAsync(fonts);
        }
    });
}
