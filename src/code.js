import { create } from './commands/create';
import { build } from './commands/build';
figma.showUI(__html__, {
    height: 360,
    width: 240
});
figma.ui.onmessage = msg => {
    //check if message is correct, otherwise cancel
    if (msg.type === 'create') {
        create().then((message) => {
            figma.notify(message, { timeout: 2000 });
            // figma.ui.resize(240, 360)
            figma.ui.postMessage('created');
        });
    }
    else if (msg.type === 'generate') {
        build(msg.data).then((message) => {
            figma.notify(message);
        });
    }
    else if (msg.type === 'openinfo') {
        figma.ui.resize(240, 490);
    }
    else if (msg.type === 'closeinfo') {
        setTimeout(function () { figma.ui.resize(240, 360); }, 400);
    }
    else {
        figma.closePlugin("Message not recognised 🥳");
    }
};
//If components are already created, enable button
const componentsExist = figma.currentPage.findAll(n => (n.name.includes('cal#')));
if (componentsExist.length > 0) {
    // figma.ui.resize(240, 360)
    figma.ui.postMessage('created');
}
