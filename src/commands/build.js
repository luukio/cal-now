var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as moment from 'moment';
import styles from '../assets/styles';
import { frameParent, frameNodesAndShow, loadFontsOfComponents, loadStyles } from '../utils';
//Populate Dates
export function build(message) {
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
        loadStyles(styles);
        if (!dayComponent || !weekendComponent || !daynameComponent || !daynameWeekendComponent)
            return "Can't find one of the calendar elements, please rebuild!";
        //remove calendar if it exists
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
                        if (!monthSwitch) {
                            if (j >= 0 && j <= 4)
                                backgroundNode.fillStyleId = styles.backgroundAltStyle.id;
                            else
                                backgroundNode.fillStyleId = styles.backgroundAltWeekendStyle.id;
                        }
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
