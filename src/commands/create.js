var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import styles from '../assets/styles';
import components from '../assets/components';
import { frameNodesAndShow, resizeElementToNodes, loadStyles } from '../utils';
//Make components
export function create() {
    return __awaiter(this, void 0, void 0, function* () {
        const componentsExist = figma.currentPage.findAll(n => (n.name.includes('cal#')));
        if (componentsExist.length > 0)
            return "'cal#' components exist, delete them first or start building.";
        //load styles
        loadStyles(styles);
        //each component in list
        for (const key in components) {
            const component = components[key];
            //setup new component
            const newComponent = figma.createComponent();
            newComponent.name = component.name;
            newComponent.x = component.x;
            newComponent.y = component.y;
            //each layer in component
            for (const key in component.layers) {
                let node;
                const layer = component.layers[key];
                if (layer.set.type === 'RECTANGLE')
                    node = figma.createRectangle();
                if (layer.set.type === 'TEXT')
                    node = figma.createText();
                //each property in layer
                for (const key in layer) {
                    if (key == 'fontName')
                        yield figma.loadFontAsync(layer[key]);
                    if (key != 'set')
                        node[key] = layer[key];
                }
                //if layer has a fill style, add it
                if (layer.set.fillStyle)
                    node.fillStyleId = styles[layer.set.fillStyle].id;
                //resize layer to set size
                node.resizeWithoutConstraints(layer.set.width, layer.set.height);
                newComponent.appendChild(node);
            }
            //resize component to layers
            resizeElementToNodes(newComponent, newComponent.children, 0);
        }
        //Make a new named frame with 100 padding around components
        const calendarComponents = figma.currentPage.findAll(n => (n.name.includes('cal#')));
        frameNodesAndShow(calendarComponents, "Calendar Components", 60);
        //enable UI button
        figma.ui.postMessage('created');
        return "Components Created. ⚡️";
    });
}
