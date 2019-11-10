import './ui.css';
//Setup elements
const buildButton = document.getElementById('generate');
const infoInner = document.getElementById('readmore-inner');
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
    if (infoInner.classList.contains('collapsed'))
        parent.postMessage({ pluginMessage: { type: 'openinfo' } }, '*');
    else
        parent.postMessage({ pluginMessage: { type: 'closeinfo' } }, '*');
    infoInner.classList.toggle('collapsed');
};
//Fancy enabler
const form = document.getElementById("form");
form.addEventListener("change", () => {
    if (createdValid && form.checkValidity())
        buildButton.disabled = false;
    else
        buildButton.disabled = true;
});
onmessage = (event) => {
    if (event.data.pluginMessage == 'created') {
        createdValid = true;
        if (form.checkValidity())
            buildButton.disabled = false;
    }
};
