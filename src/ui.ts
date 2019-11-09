import './ui.css'

document.getElementById('generate').onclick = () => {
  const datebox = document.getElementById('date') as HTMLInputElement
  const weekbox = document.getElementById('weeks') as HTMLInputElement
  const data = {"date": datebox.value, "weeks": weekbox.value}
  parent.postMessage({ pluginMessage: { type: 'generate', data } }, '*')
};

document.getElementById('create').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'create' } }, '*')
};

// document.getElementById('cancel').onclick = () => {
//   parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
// };

(document.getElementById('date') as HTMLInputElement).valueAsDate = new Date()
