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
import { resizeParentToNodes, loadFontsOfComponents } from './utils';
figma.showUI(__html__, {
    height: 340,
    width: 380
});
figma.ui.onmessage = msg => {
    //check if message is correct, otherwise cancel
    if (msg.type === 'generate') {
        generate(msg.data).then((message) => {
            figma.notify(message);
        });
    }
    else if (msg.type === 'create') {
        create().then((message) => {
            figma.notify(message);
        });
    }
    else if (msg.type === 'cancel') {
        figma.closePlugin();
    }
    else {
        figma.closePlugin("Message not recognised 🥳");
    }
};
//Populate Dates
function create() {
    return __awaiter(this, void 0, void 0, function* () {
        const componentsExist = figma.currentPage.findAll(n => (n.name.includes('cal#')));
        if (componentsExist.length > 0)
            return "'cal#' components exist, you can start building.";
        //Create Background
        const backgroundFrame = figma.createFrame();
        backgroundFrame.name = 'Calendar Components';
        backgroundFrame.backgrounds = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        backgroundFrame.x = -100;
        backgroundFrame.y = -300;
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
            resizeParentToNodes(newComponent, newComponent.children);
            backgroundFrame.resizeWithoutConstraints(1680, 840);
        }
        const selection = figma.currentPage.findAll(n => (n.name.includes('cal#')));
        return "Created. ⚡️";
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
        //load all used fonts
        const missingFonts = yield loadFontsOfComponents(components);
        if (missingFonts)
            return missingFonts;
        //The building blocks
        const mondayComponent = figma.currentPage.findOne(n => n.name === 'cal#Monday');
        const dayComponent = figma.currentPage.findOne(n => n.name === 'cal#Day');
        const weekendComponent = figma.currentPage.findOne(n => n.name === 'cal#Weekend');
        const daynameComponent = figma.currentPage.findOne(n => n.name === 'cal#Dayname');
        const daynameWeekendComponent = figma.currentPage.findOne(n => n.name === 'cal#DaynameWeekend');
        const weekStructure = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sat', 'Sun'];
        const calStructure = ['Monday', 'Day', 'Day', 'Day', 'Day', 'Weekend', 'Weekend'];
        //Date Variables
        const currentDateStart = moment(message.date).day(1);
        let monthSwitch = false;
        const anchorX = 2000;
        const anchorY = -200;
        //Make Header
        let xAxis = anchorX;
        for (let i = 0; i < weekStructure.length; i++) {
            let node;
            if (i >= 0 && i <= 4)
                node = daynameComponent.createInstance();
            else
                node = daynameWeekendComponent.createInstance();
            node.x = xAxis;
            node.y = anchorY;
            //Change text
            const text = node.findOne(n => n.name === '#dayname' && n.type == 'TEXT');
            if (text)
                text.characters = weekStructure[i];
            xAxis += node.width;
        }
        //Make Calendar
        let yAxis = anchorY + daynameComponent.height;
        xAxis = anchorX; //reset x
        for (let i = 0; i <= message.weeks; i++) {
            for (let j = 0; j < calStructure.length; j++) {
                let node;
                const day = calStructure[j];
                if (day == 'Monday')
                    node = mondayComponent.createInstance();
                else if (day == 'Day')
                    node = dayComponent.createInstance();
                else if (day == 'Weekend')
                    node = weekendComponent.createInstance();
                node.x = xAxis;
                node.y = yAxis;
                const dayText = node.findOne(n => n.name === '#day' && n.type == 'TEXT');
                const weekText = node.findOne(n => n.name === '#week' && n.type == 'TEXT');
                const monthText = node.findOne(n => n.name === '#month' && n.type == 'TEXT');
                const background = node.findOne(n => n.name === "#background" && n.type === "RECTANGLE");
                const curDate = currentDateStart.clone().add((i * 7) + j, 'days');
                const curDayName = curDate.format('DD');
                const curMonthName = curDate.format('MMMM');
                if (dayText)
                    dayText.characters = curDayName;
                if (weekText)
                    weekText.characters = String(i);
                if (monthText)
                    monthText.characters = curMonthName;
                if (monthText) {
                    if (curDate.date() === 1)
                        monthText.characters = curMonthName; //Only add month at start of every month
                    else if ((curDate.date() === 2 || curDate.date() === 3) && curDate.day() === 1)
                        monthText.characters = curMonthName; //If it was in weekend, still add on Monday
                    else
                        monthText.characters = "";
                    if (i === 0 && j === 0)
                        monthText.characters = curMonthName; //Always add on first one
                }
                //Alternate month for colours
                if (curDate.date() === 1)
                    monthSwitch = !monthSwitch;
                if (background) {
                    if (monthSwitch)
                        background.opacity = 0.5;
                    else
                        background.opacity = 0.25;
                }
                xAxis += node.width;
            }
            xAxis = anchorX; //reset x
            yAxis += mondayComponent.height;
        }
        return "Done. ⚡️";
    });
}
