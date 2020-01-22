import './ui.css';
//Setup elements
const step2Element = document.getElementById('step2');
const buttonElement = document.getElementById('generate');
const infoElement = document.getElementById('readmore-inner');
const form = document.getElementById("form");
let createdValid = false;
document.getElementById('generate').onclick = () => {
    const datebox = document.getElementById('date');
    const weekbox = document.getElementById('weeks');
    const data = { "date": datebox.value, "weeks": weekbox.value };
    parent.postMessage({ pluginMessage: { type: 'generate', data } }, '*');
};
document.getElementById('create').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create' } }, '*');
};
document.getElementById('date').valueAsDate = new Date();
//Readmore
document.getElementById('readmore').onclick = () => {
    if (infoElement.classList.contains('collapsed'))
        parent.postMessage({ pluginMessage: { type: 'openinfo' } }, '*');
    else
        parent.postMessage({ pluginMessage: { type: 'closeinfo' } }, '*');
    infoElement.classList.toggle('collapsed');
};
//Fancy enabler
form.addEventListener("input", () => {
    if (createdValid && form.checkValidity()) {
        buttonElement.disabled = false;
    }
    else {
        buttonElement.disabled = true;
    }
});
onmessage = (event) => {
    if (event.data.pluginMessage == 'created') {
        createdValid = true;
        if (form.checkValidity()) {
            step2Element.classList.remove('disabled');
        }
    }
};
