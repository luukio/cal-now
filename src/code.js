import { create } from './commands/create';
import { build } from './commands/build';
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
        build(msg.data).then((message) => {
            figma.notify(message);
        });
    }
    else if (msg.type === 'openinfo') {
        figma.ui.resize(380, 320);
    }
    else if (msg.type === 'closeinfo') {
        setTimeout(function () { figma.ui.resize(380, 200); }, 400);
    }
    else {
        figma.closePlugin("Message not recognised 🥳");
    }
};
//If components are already created, enable button
const componentsExist = figma.currentPage.findAll(n => (n.name.includes('cal#')));
if (componentsExist.length > 0)
    figma.ui.postMessage('created');
