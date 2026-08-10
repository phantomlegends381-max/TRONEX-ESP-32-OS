
// diagnostics.js

// =========================================================================
// PROCEDURAL LOG GENERATOR FOR 2000+ LINES OF VIRTUAL OS SIMULATOR DIAGNOSTICS
// =========================================================================
// This module procedurally builds an ultra-realistic boot log array for a
// virtual ESP32 + Pi5 simulator. It includes staged boot statements, sensor
// initialization output, raw memory dumps, package extraction progress, and
// an interactive keyboard handshake trigger.

function generateTwoThousandLineLogs() {
  const logs = [];

  const timestamp = (value) => value.toFixed(6).padStart(9, ' ');
  const actions = [
    'Initializing', 'Mounting', 'Checking', 'Enabling', 'Verifying',
    'Optimizing', 'Allocating', 'Calibrating', 'Accepting', 'Reconciling',
    'Probing', 'Stacking', 'Decrypting', 'Prefetching', 'Indexing'
  ];
  const targets = [
    'GPIO Pin Interface', 'UART Serial Bus', 'Bluetooth Low Energy Mesh',
    'Chrome Render Engine Frame', 'USB-C Power Controller', 'SPIFFS Storage Cluster',
    'Git Bash Path Compiler', 'AI Pipeline Matrix Router',
    'RAM Sector Allocation Table', 'Crypto Core Module', 'Sensor Array Matrix',
    'Neural Accelerator Fabric', 'Virtual PCIe Bridge', 'Kernel Timing Unit',
    'Power Management Register'
  ];
  const memoryPatterns = [
    'A1', 'B2', 'C3', 'D4', 'E5', 'F6', '7F', '8E', '9D', '0C'
  ];
  const packages = [
    'bash_shell_core.tar.gz', 'chromium_sandbox_env.bin', 'ai_prompt_pipeline.assets',
    'linux_sys_explorer.config', 'git_terminal_shortcuts.bash', 'esp32_file_utilities.app'
  ];

  logs.push('[   0.000000] Virtual kernel bootstrap initiated inside simulator runtime...');
  logs.push('[   0.041203] Virtual Broadcom BCM2712 SoC model detected; assigning 4x Cortex-A76 cores at 2.4GHz.');
  logs.push('[   0.482910] VIRTUAL PI5: Power Delivery Controller firmware verified. Status: 5V/5A simulation profile.');
  logs.push('[   0.923841] VIRTUAL ESP32: Initializing Xtensa dual-core 32-bit LX6 microcontroller simulator...');
  logs.push('[   1.129482] VIRTUAL ESP32: Crystal oscillator calibration completed successfully (40 MHz).');
  logs.push('[   1.530291] VIRTUAL CHIP LINK: Mapping serial hardware bridge via virtual UART (/dev/ttyUSB0-emulator).');
  logs.push('[   1.980123] VIRTUAL CLOCK: Stable cycle lock acquired; rollback protection active.');

  // --- PHASE 1: CORE BOOT INITS (Lines 10 - 450) ---
  for (let i = 0; i < 400; i += 1) {
    const act = actions[Math.floor(Math.random() * actions.length)];
    const tgt = targets[Math.floor(Math.random() * targets.length)];
    const id = Math.floor(Math.random() * 0x10000);
    const lineTime = 2.0 + i * 0.015;
    logs.push(`[   ${timestamp(lineTime)}] [ VIRTUAL HARDWARE ] ${act} ${tgt} (Instance ID: 0x${id.toString(16).toUpperCase().padStart(4, '0')})... [ OK ]`);
  }

  // --- PHASE 2: HEXADECIMAL FLASH STORAGE DUMP (Lines 450 - 1950) ---
  logs.push('[   5.102941] [ CRITICAL ] Commencing raw block sector validation for virtual ESP32 SPIFFS flash memory...');
  for (let i = 0; i < 1500; i += 1) {
    const baseAddress = 0x3FF00000 + i * 0x10;
    const hexBytes = Array.from({ length: 8 }, () => {
      return Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
    });
    const fillHint = memoryPatterns[i % memoryPatterns.length];
    logs.push(`[ MEMORY_DUMP ] 0x${baseAddress.toString(16).toUpperCase()} | ${hexBytes.join(' ')} | TRACE=${fillHint} | [ VERIFIED ]`);
  }

  // --- PHASE 3: INTERACTIVE USER KEYBOARD HANDSHAKE TRIGGER ---
  logs.push('!! INTERACTIVE_PAUSE_TRIGGER_KEYBOARD_HANDSHAKE !!');

  // --- PHASE 4: EXTRACTING LINUX & GIT INTERFACES (Lines 1951 - 2100) ---
  logs.push('[   5.829104] Key handshake captured successfully. Unlocking virtual kernel pipelines.');
  logs.push('[   5.890422] Virtual UART baud rate negotiated at 115200 bps. Node handshake complete.');

  packages.forEach((pkg) => {
    logs.push(`[ DEPLOY ] Extracting payload package: secondary cluster source '${pkg}'`);
    for (let pct = 5; pct <= 100; pct += 5) {
      const barLength = Math.floor(pct / 5);
      const bar = '='.repeat(barLength) + '>' + '.'.repeat(20 - barLength);
      const sizeLoaded = ((pct / 100) * 48.5).toFixed(1);
      logs.push(`[ DEPLOY ] [${bar}] ${pct}% Decompressing ${pkg} (${sizeLoaded} MB / 48.5 MB)`);
    }
    logs.push(`[ SUCCESS ] Package '${pkg}' registered to simulated operating system memory.`);
  });

  // Additional incremental system maturation logs to surpass the 2000-line threshold.
  for (let i = 0; i < 35; i += 1) {
    const detail = [
      'Synthesizing virtual sensor matrix...',
      'Finalizing simulated PCIe lane bindings...',
      'Reconciling kernel module dependencies...',
      'Streaming telemetry to dashboard interface...',
      'Extending memory mapping table...',
      'Recalculating GPU shader pipeline latency...',
      'Refreshing virtual network routing cache...'
    ][i % 7];
    logs.push(`[   ${timestamp(6.1 + i * 0.12)}] SYSTEM MATURATION: ${detail}`);
  }

  logs.push('[   8.210492] SYSTEM INTERACTION MATRIX: Generating graphical wiring routing nets...');
  logs.push('[   8.600129] SUCCESS: Both processing units operating in perfect synchronization.');
  logs.push('[   9.102394] Syncing virtual filesystems across local device layout registers...');
  logs.push('[   9.592011] Final validation: virtual ESP32 responsive, Pi5 internal environment standing by...');
  logs.push('[  10.000000] Launching Virtual Hardware Simulator Interface Main Workspace now...');

  // Ensure at least 2000 lines even if the loops vary slightly.
  while (logs.length < 2005) {
    const lineTime = 10.0 + (logs.length % 100) * 0.002;
    logs.push(`[   ${timestamp(lineTime)}] [ SYSTEM ] Auto-scaling diagnostic log generator line ${logs.length + 1}...`);
  }

  return logs;
}

function runDiagnosticBoot() {
  const masterLogs = generateTwoThousandLineLogs();
  const terminalLog = document.getElementById('terminal-log');
  const bootScreen = document.getElementById('boot-screen');
  const mainApp = document.getElementById('main-app');
  let currentLine = 0;
  let isPausedForHandshake = false;
  let handshakePromptBox = null;
  let accountSetupVisible = false;
  let accountSetupOpen = false;

  function resumeBoot() {
    if (!accountSetupVisible) {
      return;
    }

    accountSetupVisible = false;
    accountSetupOpen = false;
    isPausedForHandshake = false;
    window.removeEventListener('keydown', handleUserHandshakeKey);
    if (handshakePromptBox) {
      handshakePromptBox.remove();
      handshakePromptBox = null;
    }

    currentLine += 1;
    printNextLine();
  }

  function finishBoot() {
    bootScreen.classList.remove('active');
    bootScreen.style.display = 'none';
    mainApp.classList.add('visible');
    mainApp.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function saveAccount(username, password) {
    try {
      localStorage.setItem('tronexOsUsername', username);
      localStorage.setItem('tronexOsPassword', password);
      localStorage.setItem('tronexOsCreated', 'true');
    } catch (e) {
      console.warn('Unable to save account data:', e);
    }
  }

  function handleUserHandshakeKey() {
    if (!isPausedForHandshake || accountSetupVisible || accountSetupOpen) {
      return;
    }

    showAccountSetupTerminal();
  }

  function printNextLine() {
    if (currentLine >= masterLogs.length) {
      setTimeout(() => {
        const completionNotice = document.createElement('p');
        completionNotice.textContent = 'BOOT COMPLETE. HANDOVER TO MAIN SIMULATOR INTERFACE INITIATED.';
        completionNotice.style.color = '#7dff7d';
        completionNotice.style.marginTop = '0.75rem';
        terminalLog.appendChild(completionNotice);
        terminalLog.scrollTop = terminalLog.scrollHeight;
        finishBoot();
      }, 1200);
      return;
    }

    const rawLine = masterLogs[currentLine];
    if (rawLine === '!! INTERACTIVE_PAUSE_TRIGGER_KEYBOARD_HANDSHAKE !!') {
      isPausedForHandshake = true;
      handshakePromptBox = document.createElement('p');
      handshakePromptBox.id = 'handshake-prompt-box';
      handshakePromptBox.textContent = '⚠️ [ ATTENTION ] PRESS ANY KEY TO OPEN THE VIRTUAL OS ACCOUNT TERMINAL';
      handshakePromptBox.style.cssText = 'color:#ffdd57;background:rgba(16,16,16,0.92);padding:0.75rem 1rem;border:1px solid rgba(255,221,87,0.35);margin:0.5rem 0;border-radius:0.75rem;font-family:monospace;font-size:0.95rem;text-align:center;';
      terminalLog.appendChild(handshakePromptBox);
      terminalLog.scrollTop = terminalLog.scrollHeight;
      window.addEventListener('keydown', handleUserHandshakeKey);
      return;
    }

    const line = document.createElement('p');
    line.style.margin = '0.2rem 0';
    line.style.fontFamily = 'monospace';
    line.style.fontSize = '0.92rem';
    line.style.color = '#7dfd8f';
    line.textContent = `${new Date().toLocaleTimeString()} ${rawLine}`;
    terminalLog.appendChild(line);
    terminalLog.scrollTop = terminalLog.scrollHeight;

    currentLine += 1;
    let baselineDelay = 40;
    if (rawLine.includes('MEMORY_DUMP')) baselineDelay = 4;
    if (rawLine.includes('DEPLOY')) baselineDelay = 8;
    if (rawLine.includes('INTERACTIVE')) baselineDelay = 0;

    setTimeout(printNextLine, Math.max(2, Math.round(Math.random() * baselineDelay + 2)));
  }

  printNextLine();

  function showAccountSetupTerminal() {
    const panel = document.createElement('div');
    panel.style.cssText = 'margin-top:1.25rem;padding:1rem;border:1px solid rgba(0,255,102,0.22);border-radius:18px;background:rgba(0,0,0,0.92);font-family:monospace;font-size:0.95rem;color:#c8ffb2;';
    panel.innerHTML = `
      <div style="margin-bottom:0.85rem;color:#00ff99;font-weight:700;letter-spacing:0.16em;">SIMULATOR OS LOGIN SETUP</div>
      <p style="margin:0 0 1rem;line-height:1.5;">Set up your simulator OS account here. Default password: <strong style=\"color:#fff\">opyio</strong>.</p>
      <div style="display:grid;gap:0.85rem;">
        <div style="display:grid;gap:0.4rem;">
          <span style="font-size:0.85rem;color:#7dfd8f;letter-spacing:0.08em;">USERNAME</span>
          <input id="boot-account-user" type="text" value="tronex" style="width:100%;padding:0.75rem;background:#041403;border:1px solid rgba(0,255,102,0.18);color:#d4ffd4;border-radius:12px;" />
        </div>
        <div style="display:grid;gap:0.4rem;">
          <span style="font-size:0.85rem;color:#7dfd8f;letter-spacing:0.08em;">PASSWORD</span>
          <input id="boot-account-password" type="password" value="opyio" style="width:100%;padding:0.75rem;background:#041403;border:1px solid rgba(0,255,102,0.18);color:#d4ffd4;border-radius:12px;" />
        </div>
        <button id="boot-account-create" style="width:100%;padding:0.85rem 1rem;background:#00ff65;color:#001900;border:none;border-radius:14px;font-weight:700;cursor:pointer;">Create OS Account</button>
        <button id="boot-account-forgot" style="width:100%;padding:0.85rem 1rem;background:transparent;color:#00ff65;border:1px solid rgba(0,255,102,0.35);border-radius:14px;cursor:pointer;">Forgot Password?</button>
        <div id="boot-account-reset" style="display:none;padding:0.85rem;border:1px solid rgba(0,255,102,0.18);border-radius:14px;background:rgba(0,0,0,0.85);">
          <span style="font-size:0.85rem;color:#7dfd8f;letter-spacing:0.08em;display:block;margin-bottom:0.4rem;">EMAIL FOR RESET LINK</span>
          <input id="boot-account-email" type="email" placeholder="you@example.com" style="width:100%;padding:0.75rem;background:#041403;border:1px solid rgba(0,255,102,0.18);color:#d4ffd4;border-radius:12px;" />
          <button id="boot-account-send-reset" style="width:100%;margin-top:0.75rem;padding:0.85rem 1rem;background:#007f00;color:#d4ffd4;border:none;border-radius:14px;cursor:pointer;">Send Reset Link</button>
          <p id="boot-account-reset-msg" style="margin-top:0.75rem;color:#a5ff9b;display:none;line-height:1.4;"></p>
        </div>
      </div>
    `;

    const continueButton = document.createElement('button');
    continueButton.id = 'boot-account-continue';
    continueButton.textContent = 'Continue Boot';
    continueButton.disabled = true;
    continueButton.style.cssText = 'padding:0.85rem 1rem;background:#001f00;color:#7dff7d;border:1px solid rgba(0,255,102,0.3);border-radius:14px;cursor:not-allowed;opacity:0.65;margin-top:0.75rem;';
    panel.appendChild(continueButton);

    terminalLog.appendChild(panel);
    terminalLog.scrollTop = terminalLog.scrollHeight;
    accountSetupOpen = true;

    const userInput = panel.querySelector('#boot-account-user');
    const passInput = panel.querySelector('#boot-account-password');
    const createButton = panel.querySelector('#boot-account-create');
    const forgotButton = panel.querySelector('#boot-account-forgot');
    const resetPanel = panel.querySelector('#boot-account-reset');
    const emailInput = panel.querySelector('#boot-account-email');
    const sendResetButton = panel.querySelector('#boot-account-send-reset');
    const resetMsg = panel.querySelector('#boot-account-reset-msg');

    function enableContinue() {
      accountSetupVisible = true;
      continueButton.disabled = false;
      continueButton.style.cursor = 'pointer';
      continueButton.style.opacity = '1';
      continueButton.style.background = '#007f00';
    }

    createButton.addEventListener('click', () => {
      const username = userInput.value.trim() || 'tronex';
      const password = passInput.value.trim() || 'opyio';
      saveAccount(username, password);
      const successLine = document.createElement('p');
      successLine.style.color = '#7dff7d';
      successLine.textContent = `[ ACCOUNT ] OS account '${username}' created with password '${password}'. Account saved to browser storage. You can now continue into the simulator.`;
      terminalLog.appendChild(successLine);
      terminalLog.scrollTop = terminalLog.scrollHeight;
      createButton.disabled = true;
      createButton.style.opacity = '0.7';
      enableContinue();
    });

    forgotButton.addEventListener('click', () => {
      resetPanel.style.display = 'block';
      terminalLog.scrollTop = terminalLog.scrollHeight;
    });

    sendResetButton.addEventListener('click', () => {
      const email = emailInput.value.trim();
      if (!email) {
        resetMsg.textContent = 'Enter a valid email address to receive the reset link.';
        resetMsg.style.display = 'block';
        return;
      }
      resetMsg.textContent = `A password reset link has been sent to ${email}. Follow the instructions to create a new password.`;
      resetMsg.style.display = 'block';
      const notificationLine = document.createElement('p');
      notificationLine.style.color = '#a5ff9b';
      notificationLine.textContent = `[ EMAIL ] Reset link request processed for ${email}.`;
      terminalLog.appendChild(notificationLine);
      terminalLog.scrollTop = terminalLog.scrollHeight;
      enableContinue();
    });

    continueButton.addEventListener('click', () => {
      if (continueButton.disabled) {
        return;
      }
      const noticeLine = document.createElement('p');
      noticeLine.style.color = '#7dff7d';
      noticeLine.textContent = '[ BOOT ] Account setup complete. Resuming diagnostic roll...';
      terminalLog.appendChild(noticeLine);
      terminalLog.scrollTop = terminalLog.scrollHeight;
      resumeBoot();
    });
  }
}

window.runDiagnosticBoot = runDiagnosticBoot;
window.startBootSequence = runDiagnosticBoot;
