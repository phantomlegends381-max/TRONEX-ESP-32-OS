(() => {
  const STORAGE_KEY = 'tronexVirtualFilesV1';
  const KEY_SESSION_KEY = 'tronexGeminiApiKey';
  const rootFolders = ['Documents', 'Projects', 'Logs', 'Downloads', 'System'];
  const starterFiles = [
    { path: 'Documents/Welcome.txt', type: 'text/plain', content: 'Welcome to TRONEX OS.\n\nUse the file explorer to create, edit, upload, and download files.' },
    { path: 'Projects/TRONEX-project.txt', type: 'text/plain', content: 'TRONEX ESP-32 OS\nA browser-based operating system simulation.' },
    { path: 'Logs/system.log', type: 'text/plain', content: '[BOOT] TRONEX virtual desktop is ready.\n[INFO] Files are stored in this browser.' },
  ];

  let files = loadFiles();
  let currentFolder = '';
  let selectedPath = '';

  function loadFiles() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return Array.isArray(stored) ? stored : starterFiles.map((file) => ({ ...file, data: textToDataUrl(file.content, file.type) }));
    } catch {
      return starterFiles.map((file) => ({ ...file, data: textToDataUrl(file.content, file.type) }));
    }
  }

  function textToDataUrl(text, type) {
    return `data:${type};base64,${btoa(unescape(encodeURIComponent(text)))}`;
  }

  function saveFiles() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
      setExplorerStatus('Saved in this browser. Download a file or folder ZIP to keep a copy elsewhere.');
      return true;
    } catch {
      setExplorerStatus('Browser storage is full. Download the files and remove some large uploads.');
      return false;
    }
  }

  function setExplorerStatus(message) {
    const status = document.getElementById('explorer-status');
    if (status) status.textContent = message;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function filename(path) { return path.split('/').pop(); }

  function renderFiles() {
    const list = document.getElementById('explorer-list');
    const pathLabel = document.getElementById('explorer-path');
    if (!list || !pathLabel) return;
    pathLabel.textContent = currentFolder || 'Home';
    list.replaceChildren();

    const prefix = currentFolder ? `${currentFolder}/` : '';
    const folders = new Set(rootFolders.filter((folder) => !currentFolder));
    const visibleFiles = [];
    files.forEach((file) => {
      if (!file.path.startsWith(prefix)) return;
      const remainder = file.path.slice(prefix.length);
      if (remainder.includes('/')) folders.add(remainder.split('/')[0]);
      else visibleFiles.push(file);
    });

    [...folders].sort().forEach((folder) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'os-file-item';
      button.innerHTML = `ðŸ“ ${escapeHtml(folder)} <small>Folder</small>`;
      button.addEventListener('click', () => {
        currentFolder = currentFolder ? `${currentFolder}/${folder}` : folder;
        selectedPath = '';
        renderFiles();
      });
      list.appendChild(button);
    });

    visibleFiles.sort((a, b) => filename(a.path).localeCompare(filename(b.path))).forEach((file) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `os-file-item${selectedPath === file.path ? ' selected' : ''}`;
      button.innerHTML = `ðŸ“„ ${escapeHtml(filename(file.path))}<small>${escapeHtml(file.type || 'File')}</small>`;
      button.addEventListener('click', () => {
        selectedPath = file.path;
        renderFiles();
      });
      list.appendChild(button);
    });

    if (!folders.size && !visibleFiles.length) {
      const empty = document.createElement('p');
      empty.className = 'small-note';
      empty.textContent = 'This folder is empty. Create a document or add files.';
      list.appendChild(empty);
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  function initExplorer() {
    const up = document.getElementById('folder-up-btn');
    const create = document.getElementById('new-document-btn');
    const uploadButton = document.getElementById('upload-files-btn');
    const uploadInput = document.getElementById('upload-files-input');
    const downloadFile = document.getElementById('download-file-btn');
    const downloadFolder = document.getElementById('download-folder-btn');
    const deleteFile = document.getElementById('delete-file-btn');
    const editFile = document.getElementById('edit-file-btn');

    up.addEventListener('click', () => {
      currentFolder = currentFolder.includes('/') ? currentFolder.slice(0, currentFolder.lastIndexOf('/')) : '';
      selectedPath = '';
      renderFiles();
    });

    create.addEventListener('click', () => {
      const title = prompt('Document name (include .txt or .md):', 'New document.txt');
      if (!title) return;
      const safeName = title.trim().replace(/[\\/:*?"<>|]/g, '-');
      if (!safeName) return;
      const body = prompt('Document text:', '') ?? '';
      const path = `${currentFolder ? `${currentFolder}/` : ''}${safeName}`;
      files = files.filter((file) => file.path !== path);
      files.push({ path, type: 'text/plain', data: textToDataUrl(body, 'text/plain') });
      selectedPath = path;
      saveFiles();
      renderFiles();
    });

    uploadButton.addEventListener('click', () => uploadInput.click());
    uploadInput.addEventListener('change', async () => {
      const picked = [...uploadInput.files];
      if (!picked.length) return;
      for (const file of picked) {
        const data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const path = `${currentFolder ? `${currentFolder}/` : ''}${file.name}`;
        files = files.filter((entry) => entry.path !== path);
        files.push({ path, type: file.type || 'application/octet-stream', data });
        selectedPath = path;
      }
      saveFiles();
      renderFiles();
      uploadInput.value = '';
    });

    downloadFile.addEventListener('click', async () => {
      const file = files.find((entry) => entry.path === selectedPath);
      if (!file) return setExplorerStatus('Select a file first.');
      const response = await fetch(file.data);
      downloadBlob(await response.blob(), filename(file.path));
      setExplorerStatus(`Downloaded ${filename(file.path)}.`);
    });

    editFile.addEventListener('click', async () => {
      const file = files.find((entry) => entry.path === selectedPath);
      if (!file) return setExplorerStatus('Select a file first.');
      if (file.type && !file.type.startsWith('text/') && file.type !== 'application/json') {
        return setExplorerStatus('This file type can be downloaded but not edited in the text editor.');
      }
      const response = await fetch(file.data);
      const original = await response.text();
      const updated = prompt(`Edit ${filename(file.path)}:`, original);
      if (updated === null) return;
      file.data = textToDataUrl(updated, file.type || 'text/plain');
      saveFiles();
      setExplorerStatus(`Saved ${filename(file.path)}.`);
    });

    downloadFolder.addEventListener('click', async () => {
      const prefix = currentFolder ? `${currentFolder}/` : '';
      const folderFiles = files.filter((file) => file.path.startsWith(prefix));
      if (!folderFiles.length) return setExplorerStatus('There are no files in this folder to download.');
      const zip = await makeZip(folderFiles.map((file) => ({
        name: currentFolder ? file.path.slice(prefix.length) : file.path,
        data: file.data,
      })));
      downloadBlob(zip, `${(currentFolder.split('/').pop() || 'TRONEX-files')}.zip`);
      setExplorerStatus(`Downloaded ${folderFiles.length} file(s) as a ZIP archive.`);
    });

    deleteFile.addEventListener('click', () => {
      if (!selectedPath) return setExplorerStatus('Select a file first.');
      files = files.filter((file) => file.path !== selectedPath);
      selectedPath = '';
      saveFiles();
      renderFiles();
    });
    renderFiles();
  }

  async function makeZip(entries) {
    const encoder = new TextEncoder();
    const crcTable = makeCrcTable();
    const localParts = [];
    const centralParts = [];
    let offset = 0;
    const now = new Date();
    const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
    const dosDate = ((Math.max(1980, now.getFullYear()) - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

    for (const entry of entries) {
      const nameBytes = encoder.encode(entry.name.replace(/\\/g, '/'));
      const response = await fetch(entry.data);
      const data = new Uint8Array(await response.arrayBuffer());
      const crc = crc32(data, crcTable);
      const local = new Uint8Array(30 + nameBytes.length + data.length);
      const localView = new DataView(local.buffer);
      localView.setUint32(0, 0x04034b50, true);
      localView.setUint16(4, 20, true);
      localView.setUint16(6, 0x0800, true);
      localView.setUint16(8, 0, true);
      localView.setUint16(10, dosTime, true);
      localView.setUint16(12, dosDate, true);
      localView.setUint32(14, crc, true);
      localView.setUint32(18, data.length, true);
      localView.setUint32(22, data.length, true);
      localView.setUint16(26, nameBytes.length, true);
      localView.setUint16(28, 0, true);
      local.set(nameBytes, 30);
      local.set(data, 30 + nameBytes.length);
      localParts.push(local);

      const central = new Uint8Array(46 + nameBytes.length);
      const centralView = new DataView(central.buffer);
      centralView.setUint32(0, 0x02014b50, true);
      centralView.setUint16(4, 20, true);
      centralView.setUint16(6, 20, true);
      centralView.setUint16(8, 0x0800, true);
      centralView.setUint16(10, 0, true);
      centralView.setUint16(12, dosTime, true);
      centralView.setUint16(14, dosDate, true);
      centralView.setUint32(16, crc, true);
      centralView.setUint32(20, data.length, true);
      centralView.setUint32(24, data.length, true);
      centralView.setUint16(28, nameBytes.length, true);
      centralView.setUint16(30, 0, true);
      centralView.setUint16(32, 0, true);
      centralView.setUint16(34, 0, true);
      centralView.setUint16(36, 0, true);
      centralView.setUint32(38, 0, true);
      centralView.setUint32(42, offset, true);
      central.set(nameBytes, 46);
      centralParts.push(central);
      offset += local.length;
    }

    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(4, 0, true);
    endView.setUint16(6, 0, true);
    endView.setUint16(8, entries.length, true);
    endView.setUint16(10, entries.length, true);
    endView.setUint32(12, centralSize, true);
    endView.setUint32(16, offset, true);
    endView.setUint16(20, 0, true);
    return new Blob([...localParts, ...centralParts, end], { type: 'application/zip' });
  }

  function makeCrcTable() {
    return Array.from({ length: 256 }, (_, index) => {
      let value = index;
      for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
      return value >>> 0;
    });
  }

  function crc32(bytes, table) {
    let crc = 0xffffffff;
    bytes.forEach((byte) => { crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8); });
    return (crc ^ 0xffffffff) >>> 0;
  }

  function initBrowser() {
    const form = document.getElementById('browser-form');
    const address = document.getElementById('browser-address');
    const frame = document.getElementById('browser-frame');
    const status = document.getElementById('browser-status');
    let destination = '';

    function resolveAddress(rawValue) {
      const value = rawValue.trim();
      if (!value) return '';
      if (/^https?:\/\//i.test(value)) return value;
      if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(value)) return `https://${value}`;
      return `https://www.google.com/search?q=${encodeURIComponent(value)}`;
    }

    function navigate() {
      destination = resolveAddress(address.value);
      if (!destination) {
        status.textContent = 'Enter a search or web address first.';
        return;
      }
      frame.src = destination;
      status.textContent = 'Loading preview. Some websites block embedding; use â€œOpen in new tabâ€ if the preview is blank.';
    }

    form.addEventListener('submit', (event) => { event.preventDefault(); navigate(); });
    document.getElementById('open-browser-tab').addEventListener('click', () => {
      if (!destination) destination = resolveAddress(address.value);
      if (!destination) return status.textContent = 'Enter a search or web address first.';
      window.open(destination, '_blank', 'noopener,noreferrer');
    });
    frame.addEventListener('load', () => {
      if (destination) status.textContent = `Preview requested: ${destination}`;
    });
  }

  function initChat() {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const keyInput = document.getElementById('gemini-api-key');
    const historyBox = document.getElementById('chat-history');
    const sendButton = document.getElementById('chat-send-btn');
    const conversation = [];
    keyInput.value = sessionStorage.getItem(KEY_SESSION_KEY) || '';
    keyInput.addEventListener('input', () => sessionStorage.setItem(KEY_SESSION_KEY, keyInput.value.trim()));

    function addMessage(role, text) {
      const item = document.createElement('p');
      item.className = 'chat-message';
      const label = document.createElement('strong');
      label.textContent = `${role}: `;
      item.append(label, document.createTextNode(text));
      historyBox.appendChild(item);
      historyBox.scrollTop = historyBox.scrollHeight;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const promptText = input.value.trim();
      const apiKey = keyInput.value.trim();
      if (!promptText) return;
      if (!apiKey) {
        addMessage('TRONEX', 'Paste a Gemini API key above to start a chat.');
        keyInput.focus();
        return;
      }

      input.value = '';
      input.disabled = true;
      sendButton.disabled = true;
      addMessage('You', promptText);
      conversation.push({ role: 'user', parts: [{ text: promptText }] });
      const pending = document.createElement('p');
      pending.className = 'chat-message';
      pending.textContent = 'TRONEX is thinkingâ€¦';
      historyBox.appendChild(pending);
      historyBox.scrollTop = historyBox.scrollHeight;

      try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify({ contents: conversation }),
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error?.message || `Google API returned ${response.status}.`);
        const answer = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
        if (!answer) throw new Error('Gemini returned an empty response.');
        conversation.push({ role: 'model', parts: [{ text: answer }] });
        pending.remove();
        addMessage('TRONEX', answer);
      } catch (error) {
        pending.remove();
        addMessage('TRONEX', `Could not reach Gemini: ${error.message}`);
        conversation.pop();
      } finally {
        input.disabled = false;
        sendButton.disabled = false;
        input.focus();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initExplorer();
    initBrowser();
    initChat();
  });
})();

