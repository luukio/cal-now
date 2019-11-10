import './ui.css'

//Setup elements
const buildButton = document.getElementById('generate') as HTMLInputElement
const infoInner = document.getElementById('readmore-inner') as HTMLInputElement
let createdValid = false

document.getElementById('generate').onclick = () => {
  const datebox = document.getElementById('date') as HTMLInputElement
  const weekbox = document.getElementById('weeks') as HTMLInputElement
  const data = {"date": datebox.value, "weeks": weekbox.value}
  parent.postMessage({ pluginMessage: { type: 'generate', data } }, '*')
}

document.getElementById('create').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'create' } }, '*')
}

(document.getElementById('date') as HTMLInputElement).valueAsDate = new Date()

//Readmore
document.getElementById('readmore').onclick = () => {
  if (infoInner.classList.contains('collapsed')) parent.postMessage({ pluginMessage: { type: 'openinfo' } }, '*')
  else parent.postMessage({ pluginMessage: { type: 'closeinfo' } }, '*')
  infoInner.classList.toggle('collapsed')
}

//Fancy enabler
const form = document.getElementById("form") as HTMLInputElement
form.addEventListener("change", () => {
  if (createdValid && form.checkValidity()) buildButton.disabled = false
  else buildButton.disabled = true  
})

onmessage = (event) => {
  if (event.data.pluginMessage == 'created') {
    createdValid = true;
    if (form.checkValidity()) buildButton.disabled = false
  }
}
