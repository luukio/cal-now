import './ui.css'

document.getElementById('create').onclick = () => {
  const datebox = document.getElementById('date') as HTMLInputElement
  const weekbox = document.getElementById('weeks') as HTMLInputElement
  const data = {"date": datebox.value, "weeks": weekbox.value}
  parent.postMessage({ pluginMessage: { type: 'create', data } }, '*')
};

document.getElementById('cancel').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
};

(document.getElementById('date') as HTMLInputElement).valueAsDate = new Date()
