var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as moment from 'moment';
import components from './components';
import { frameParent, frameNodesAndShow, resizeElementToNodes, loadFontsOfComponents } from './utils';
figma.showUI(__html__, {
    height: 200,
    width: 380
});
figma.ui.onmessage = msg => {
    //check if message is correct, otherwise cancel
    if (msg.type === 'create') {
        create().then((message) => {
            figma.notify(message, { timeout: 2000 });
        });
    }
    else if (msg.type === 'generate') {
        generate(msg.data).then((message) => {
            figma.notify(message);
        });
    }
    else if (msg.type === 'openinfo') {
        figma.ui.resize(380, 320);
    }
    else if (msg.type === 'closeinfo') {
        setTimeout(function () { figma.ui.resize(380, 200); }, 500);
    }
    else {
        figma.closePlugin("Message not recognised 🥳");
    }
};
//Make components
function create() {
    return __awaiter(this, void 0, void 0, function* () {
        const componentsExist = figma.currentPage.findAll(n => (n.name.includes('cal#')));
        if (componentsExist.length > 0)
            return "'cal#' components exist, delete them first or start building.";
        for (const key in components) {
            const component = components[key];
            const newComponent = figma.createComponent();
            newComponent.name = component.name;
            newComponent.x = component.x;
            newComponent.y = component.y;
            for (const key in component.layers) {
                let node;
                const layer = component.layers[key];
                if (layer.set.type === 'RECTANGLE')
                    node = figma.createRectangle();
                if (layer.set.type === 'TEXT')
                    node = figma.createText();
                for (const key in layer) {
                    if (key == 'fontName')
                        yield figma.loadFontAsync(layer[key]);
                    if (key != 'set')
                        node[key] = layer[key];
                }
                node.resizeWithoutConstraints(layer.set.width, layer.set.height);
                newComponent.appendChild(node);
            }
            resizeElementToNodes(newComponent, newComponent.children, 0);
        }
        //Make a new named frame with 100 padding around components
        const calendarComponents = figma.currentPage.findAll(n => (n.name.includes('cal#')));
        frameNodesAndShow(calendarComponents, "Calendar Components", 60);
        figma.ui.postMessage('created');
        return "Components Created. ⚡️";
    });
}
//Populate Dates
function generate(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const components = figma.currentPage.findAll(n => (n.name.includes('cal#')));
        if (!components)
            return "Make or go to page with calendar components first. 🙄";
        for (const component of components) {
            if (component.type !== 'COMPONENT')
                return "One of your calendar elements is not a component";
        }
        //Load all used fonts
        const missingFonts = yield loadFontsOfComponents(components);
        if (missingFonts)
            return missingFonts;
        //The building blocks
        const dayComponent = figma.currentPage.findOne(n => n.name === 'cal#Day');
        const weekendComponent = figma.currentPage.findOne(n => n.name === 'cal#Weekend');
        const daynameComponent = figma.currentPage.findOne(n => n.name === 'cal#Dayname');
        const daynameWeekendComponent = figma.currentPage.findOne(n => n.name === 'cal#DaynameWeekend');
        if (!dayComponent || !weekendComponent || !daynameComponent || !daynameWeekendComponent)
            return "Can't find one of the calendar elements, please rebuild!";
        const calendarExists = figma.currentPage.findOne(n => (n.name.includes('calItem#')));
        if (calendarExists)
            frameParent(calendarExists).remove();
        //Date Variables
        const currentDateStart = moment(message.date).day(1);
        let monthSwitch = false;
        const ComponentFrame = figma.currentPage.findOne(n => n.name === 'Calendar Components');
        const anchorX = ComponentFrame.x + ComponentFrame.width + 400;
        const anchorY = ComponentFrame.y;
        //Make Calendar
        let currentX = anchorX;
        let currentY = anchorY;
        for (let i = 0; i <= parseInt(message.weeks) + 1; i++) {
            for (let j = 0; j < 7; j++) {
                const curDate = currentDateStart.clone().add((i * 7) + j, 'days');
                const curMonthName = curDate.format('MMMM');
                let node;
                if (i == 0) {
                    if (j >= 0 && j <= 4)
                        node = daynameComponent.createInstance();
                    else
                        node = daynameWeekendComponent.createInstance();
                }
                else {
                    if (j >= 0 && j <= 4)
                        node = dayComponent.createInstance();
                    else
                        node = weekendComponent.createInstance();
                }
                node.x = currentX;
                node.y = currentY;
                currentX += node.width;
                let instanceName = node.name.replace(/cal#/g, "calItem#");
                node.name = instanceName;
                let dayNameNode, dayTextNode, weekTextNode, monthTextNode, backgroundNode;
                if (i == 0) {
                    dayNameNode = node.findOne(n => n.name === '#dayname' && n.type == 'TEXT');
                    if (dayNameNode) {
                        if (j >= 0 && j <= 4)
                            dayNameNode.characters = curDate.format('dddd');
                        else
                            dayNameNode.characters = curDate.format('ddd');
                    }
                }
                else {
                    dayTextNode = node.findOne(n => n.name === '#day' && n.type == 'TEXT');
                    weekTextNode = node.findOne(n => n.name === '#week' && n.type == 'TEXT');
                    monthTextNode = node.findOne(n => n.name === '#month' && n.type == 'TEXT');
                    backgroundNode = node.findOne(n => n.name === "#background" && n.type === 'RECTANGLE');
                    if (dayTextNode)
                        dayTextNode.characters = curDate.format('DD');
                    if (weekTextNode) {
                        if (j == 0)
                            weekTextNode.characters = String(i - 1);
                        else
                            weekTextNode.characters = "";
                    }
                    if (monthTextNode) {
                        if (curDate.date() === 1)
                            monthTextNode.characters = curMonthName; //Only add month at start of every month
                        else if ((curDate.date() === 2 || curDate.date() === 3) && curDate.day() === 1)
                            monthTextNode.characters = curMonthName; //If it was in weekend, still add on Monday
                        else
                            monthTextNode.characters = "";
                        if (i === 1 && j === 0)
                            monthTextNode.characters = curMonthName; //Always add month on first box anyway
                    }
                    //Alternate month for colours
                    if (curDate.date() === 1)
                        monthSwitch = !monthSwitch;
                    if (backgroundNode) {
                        if (monthSwitch)
                            backgroundNode.opacity = 1;
                        else
                            backgroundNode.opacity = 0.6;
                    }
                }
            }
            currentX = anchorX; //reset x
            if (i == 0)
                currentY += daynameComponent.height;
            else
                currentY += dayComponent.height;
        }
        const calendarItems = figma.currentPage.findAll(n => (n.name.includes('calItem#')));
        frameNodesAndShow(calendarItems, "Your Calendar", 80);
        return "Calendar built. ⚡️";
    });
}
//If components are already created, enable button
const componentsExist = figma.currentPage.findAll(n => (n.name.includes('cal#')));
if (componentsExist.length > 0)
    figma.ui.postMessage('created');
