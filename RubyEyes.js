// ╔══════════════════════════════════════════════════════════════════════════╗
// ║                          RUBY EYES REPORTER                              ║
// ║                    Professional Instagram Mass Reporter                  ║
// ║                      Developed by Klaws & Swatnfo                        ║
// ║                                                                          ║
// ║  Enhanced with SWATNFO's robust Instagram API methods:                  ║
// ║  • Multi-method user ID lookup (Mobile API + Web API + HTML)            ║
// ║  • Advanced reporting with enhanced headers & fallback logic             ║
// ║  • Improved error handling & redirect detection                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const fetch = require('node-fetch');
const tough = require('tough-cookie');
const fetchCookie = require('fetch-cookie');
const readline = require('readline');
const fs = require('fs');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { HttpsProxyAgent } = require('https-proxy-agent');
const crypto = require('crypto');
const cheerio = require('cheerio');
const { JSDOM } = require('jsdom');
const chalk = require('chalk');
const gradient = require('gradient-string');
const ora = require('ora');
const cliProgress = require('cli-progress');

// ═══════════════════════════════════════════════════════════════════════════
// COLOR GRADIENTS - Beautiful fade effects for terminal UI
// ═══════════════════════════════════════════════════════════════════════════
const rubyGradient = gradient(['#DC143C', '#FF1493', '#FF69B4']);
const goldGradient = gradient(['#DAA520', '#FFD700', '#FFA500']);
const purpleGradient = gradient(['#8B008B', '#DA70D6', '#FF69B4']);

// ═══════════════════════════════════════════════════════════════════════════
// USER AGENTS - Enhanced for 2025 (Dont touch nigga)
// ═══════════════════════════════════════════════════════════════════════════
const UA_WEB = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0"
];

const UA_MOBILE = [
  "Instagram 320.0.0.42.113 Android (33/13; 420dpi; 1080x2340; Samsung; SM-S918B; dm3q; qcom; en_US; 556085274)",
  "Instagram 318.0.0.31.120 Android (34/14; 440dpi; 1440x3088; samsung; SM-G998B; p3q; exynos2100; en_US; 554284651)",
  "Instagram 319.0.0.23.117 Android (31/12; 480dpi; 1080x2400; Xiaomi; M2012K11AG; venus; qcom; en_US; 555123456)",
  "Instagram 317.0.0.38.97 Android (30/11; 420dpi; 1080x2340; OnePlus; IN2023; kebab; qcom; en_US; 553012345)",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21C66 Instagram 320.0.0.22.114 (iPhone15,3; iOS 17_2_1; en_US; en; scale=3.00; 1290x2796; 556085274)",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21B101 Instagram 319.0.0.23.117 (iPhone14,2; iOS 17_1_2; en_US; en; scale=3.00; 1170x2532; 555123456)",
  "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
];

// ═══════════════════════════════════════════════════════════════════════════
// REPORT OPTIONS - All available report categories
// ═══════════════════════════════════════════════════════════════════════════
const REPORT_OPTIONS = [
  { label: "Spam or Scam",          reason_id: "1",  category: "community" },
  { label: "Bullying/Harassment",   reason_id: "2",  category: "community" },
  { label: "Hate Speech",           reason_id: "3",  category: "community" },
  { label: "Violence/Threats",      reason_id: "4",  category: "safety" },
  { label: "Impersonation",         reason_id: "5",  category: "identity" },
  { label: "Self-Injury",           reason_id: "6",  category: "safety" },
  { label: "Nudity/Sexual Content", reason_id: "7",  category: "content" },
  { label: "Copyright Violation",   reason_id: "8",  category: "legal" },
  { label: "Underage Account",      reason_id: "9",  category: "safety" },
  { label: "False Information",     reason_id: "10", category: "community" },
  { label: "Biz Impersonation",     reason_id: "11", category: "identity" },
  { label: "Trademark Violation",   reason_id: "12", category: "legal" },
  { label: "Consumer Policy",       reason_id: "13", category: "legal" },
  { label: "Counterfeit Goods",     reason_id: "14", category: "legal" },
  { label: "Suicide/Self-Harm",     reason_id: "15", category: "safety" },
  { label: "Terrorist Content",     reason_id: "16", category: "safety" },
  { label: "Animal Abuse",          reason_id: "17", category: "content" },
  { label: "Sale of Illegal Goods", reason_id: "18", category: "legal" }
];

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function pickUA(mode = 'web') {
  const agents = mode === 'mobile' ? UA_MOBILE : UA_WEB;
  return agents[Math.floor(Math.random() * agents.length)];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function calculateSmartDelay(baseMin, baseMax, reportNumber, totalReports) {
  const progressFactor = Math.sin((reportNumber / totalReports) * Math.PI) * 0.3 + 1;
  let delay = baseMin + Math.random() * (baseMax - baseMin);
  delay *= progressFactor;
  if (Math.random() < 0.1) delay *= (1.5 + Math.random() * 0.5);
  delay += (Math.random() - 0.5) * 500;
  return Math.max(1000, delay);
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    console.log('  ' + purpleGradient('▶ ' + question));
    rl.question('    ' + purpleGradient('» '), answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function loadConfig() {
  if (fs.existsSync('./config.json')) {
    try {
      return JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    } catch { }
  }
  return {};
}

function saveConfig(config) {
  fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
}

function getProxyAgent(proxyUrl) {
  if (!proxyUrl) return null;
  if (proxyUrl.startsWith('socks')) return new SocksProxyAgent(proxyUrl);
  if (proxyUrl.startsWith('http')) return new HttpsProxyAgent(proxyUrl);
  throw new Error("Unsupported proxy type (use http:// or socks://)");
}

// ═══════════════════════════════════════════════════════════════════════════
// UI COMPONENTS - Beautiful terminal displays with gradients
// ═══════════════════════════════════════════════════════════════════════════

function showBanner() {
  console.clear();
  const terminalWidth = process.stdout.columns || 80;
  // Centered title with gradient
  const title = 'RUBY EYES';
  const titlePadding = ' '.repeat(Math.floor((terminalWidth - title.length) / 2));
  console.log(titlePadding + rubyGradient(title));
  // Version tag
  const version = 'v3.0';
  const versionPadding = ' '.repeat(Math.floor((terminalWidth - version.length) / 2));
  console.log(versionPadding + purpleGradient(version));
  // Heart divider
  const hearts = '♥ You cant heal where you were hurt ♥';
  const heartPadding = ' '.repeat(Math.floor((terminalWidth - hearts.length) / 2));
  console.log(heartPadding + purpleGradient(hearts));
  // Welcome box
  const boxWidth = 50;
  const boxPadding = ' '.repeat(Math.floor((terminalWidth - boxWidth) / 2));
  const line = '─'.repeat(boxWidth - 2);
  
  console.log(boxPadding + purpleGradient('┌' + line + '┐'));
  
  const welcome = 'Welcome To Ruby Eyes Instagram Reporter';
  const welcomePad = Math.floor((boxWidth - 2 - welcome.length) / 2);
  console.log(boxPadding + purpleGradient('│') + ' '.repeat(welcomePad) + chalk.white(welcome) + 
    ' '.repeat(boxWidth - 2 - welcomePad - welcome.length) + purpleGradient('│'));
  
  const typeHelp = 'Type "0" To Go Back At Any Time';
  const helpPad = Math.floor((boxWidth - 2 - typeHelp.length) / 2);
  console.log(boxPadding + purpleGradient('│') + ' '.repeat(helpPad) + chalk.gray(typeHelp) + 
    ' '.repeat(boxWidth - 2 - helpPad - typeHelp.length) + purpleGradient('│'));
  
  console.log(boxPadding + purpleGradient('└' + line + '┘'));
  // Copyright box
  const copyrightBox = 'Copyright © 2025 Klaws & Swatnfo All Rights Reserved.';
  const copyrightPad = Math.floor((terminalWidth - copyrightBox.length) / 2);
  const copyLine = '─'.repeat(copyrightBox.length + 2);
  const copyBoxPadding = ' '.repeat(copyrightPad - 1);
  
  console.log(copyBoxPadding + rubyGradient('┌' + copyLine + '┐'));
  console.log(copyBoxPadding + rubyGradient('│') + ' ' + purpleGradient(copyrightBox) + ' ' + rubyGradient('│'));
  console.log(copyBoxPadding + rubyGradient('└' + copyLine + '┘'));
}

function showMenu() {
  const terminalWidth = process.stdout.columns || 80;
  const boxWidth = 45;
  const boxPadding = ' '.repeat(Math.floor((terminalWidth - boxWidth) / 2));
  const line = '─'.repeat(boxWidth - 2);
  
  console.log(boxPadding + purpleGradient('┌' + line + '┐'));
  const title = 'MAIN MENU';
  const titlePad = Math.floor((boxWidth - 2 - title.length) / 2);
  console.log(boxPadding + purpleGradient('│') + ' '.repeat(titlePad) + chalk.bold.white(title) + 
    ' '.repeat(boxWidth - 2 - titlePad - title.length) + purpleGradient('│'));
  console.log(boxPadding + purpleGradient('├' + line + '┤'));
  const options = [
    { num: '1', text: 'Quick Report (Fast Start)' },
    { num: '2', text: 'Advanced Setup' },
    { num: '3', text: 'Load Configuration' },
    { num: '4', text: 'View Report Options' },
    { num: '5', text: 'Credits' },
    { num: '6', text: 'Exit' }
  ];
  
  options.forEach(opt => {
    const optText = `${opt.num}. ${opt.text}`;
    const optPad = Math.floor((boxWidth - 2 - optText.length) / 2);
    console.log(boxPadding + purpleGradient('│') + ' '.repeat(optPad) + 
      purpleGradient(opt.num + '. ' + opt.text) + 
      ' '.repeat(boxWidth - 2 - optPad - optText.length) + purpleGradient('│'));
  });
  
  console.log(boxPadding + purpleGradient('└' + line + '┘'));
}

function showCredits() {
  console.clear();
  const terminalWidth = process.stdout.columns || 80;
  
  // Title
  const title = 'DEVELOPMENT CREDITS';
  const titlePad = Math.floor((terminalWidth - title.length) / 2);
  console.log('\n');
  console.log(' '.repeat(titlePad) + rubyGradient(title));
  console.log();
  
  // Main credits box
  const boxWidth = 65;
  const boxPadding = ' '.repeat(Math.floor((terminalWidth - boxWidth) / 2));
  const line = '─'.repeat(boxWidth - 2);
  
  console.log(boxPadding + purpleGradient('┌' + line + '┐'));
  
  // SWATNFO Section
  const swatnfoTitle = '♥ SWATNFO ♥';
  const swatnfoPad = Math.floor((boxWidth - 2 - swatnfoTitle.length) / 2);
  console.log(boxPadding + purpleGradient('│') + ' '.repeat(swatnfoPad) + 
    goldGradient(swatnfoTitle) + 
    ' '.repeat(boxWidth - 2 - swatnfoPad - swatnfoTitle.length) + purpleGradient('│'));
  
  console.log(boxPadding + purpleGradient('├' + line + '┤'));
  
  // SWATNFO contributions
  const contributions = [
    'Beautiful Terminal UI Design',
    'Enhanced Report Logic & Methods',
    'SessionID & CSRF Token Authentication',
    'Multi-Method User ID Lookup System',
    'Attack Display Interface'
  ];
  
  contributions.forEach(contrib => {
    const contribText = `• ${contrib}`;
    const contribPad = Math.floor((boxWidth - 2 - contribText.length) / 2);
    console.log(boxPadding + purpleGradient('│') + ' '.repeat(contribPad) + 
      purpleGradient(contribText) + 
      ' '.repeat(boxWidth - 2 - contribPad - contribText.length) + purpleGradient('│'));
  });
  
  console.log(boxPadding + purpleGradient('├' + line + '┤'));
  
  // Klaws Section
  const klawsTitle = '♥ KLAWS ♥';
  const klawsPad = Math.floor((boxWidth - 2 - klawsTitle.length) / 2);
  console.log(boxPadding + purpleGradient('│') + ' '.repeat(klawsPad) + 
    goldGradient(klawsTitle) + 
    ' '.repeat(boxWidth - 2 - klawsPad - klawsTitle.length) + purpleGradient('│'));
  
  console.log(boxPadding + purpleGradient('├' + line + '┤'));
  
  // Klaws contributions
  const klawsContribs = [
    'Core Reporting Engine',
    'Instagram API Integration',
    'Original Project Architecture'
  ];
  
  klawsContribs.forEach(contrib => {
    const contribText = `• ${contrib}`;
    const contribPad = Math.floor((boxWidth - 2 - contribText.length) / 2);
    console.log(boxPadding + purpleGradient('│') + ' '.repeat(contribPad) + 
      purpleGradient(contribText) + 
      ' '.repeat(boxWidth - 2 - contribPad - contribText.length) + purpleGradient('│'));
  });
  
  console.log(boxPadding + purpleGradient('└' + line + '┘'));
  console.log();
  
  // Footer message
  const footer = 'Thank you for using Ruby Eyes ♥';
  const footerPad = Math.floor((terminalWidth - footer.length) / 2);
  console.log(' '.repeat(footerPad) + rubyGradient(footer));
  console.log();
}

function showAccountsList(accounts) {
  const terminalWidth = process.stdout.columns || 80;
  const boxWidth = 50;
  const boxPadding = ' '.repeat(Math.floor((terminalWidth - boxWidth) / 2));
  const line = '─'.repeat(boxWidth - 2);
  
  console.log(boxPadding + purpleGradient('┌' + line + '┐'));
  
  const title = 'CONFIGURED ACCOUNTS';
  const titlePad = Math.floor((boxWidth - 2 - title.length) / 2);
  console.log(boxPadding + purpleGradient('│') + ' '.repeat(titlePad) + chalk.bold.white(title) + 
    ' '.repeat(boxWidth - 2 - titlePad - title.length) + purpleGradient('│'));
  
  console.log(boxPadding + purpleGradient('├' + line + '┤'));
  
  if (accounts.length === 0) {
    const noAcc = 'No accounts configured yet...';
    const noAccPad = Math.floor((boxWidth - 2 - noAcc.length) / 2);
    console.log(boxPadding + purpleGradient('│') + ' '.repeat(noAccPad) + chalk.gray(noAcc) + 
      ' '.repeat(boxWidth - 2 - noAccPad - noAcc.length) + purpleGradient('│'));
  } else {
    for (let i = 0; i < accounts.length; i++) {
      const num = String(i + 1).padStart(2, ' ');
      const username = '@' + accounts[i].username;
      const accText = `${num}. ♥ ${username}`;
      const accPad = Math.floor((boxWidth - 2 - accText.length) / 2);
      console.log(boxPadding + purpleGradient('│') + ' '.repeat(accPad) + 
        purpleGradient(num + '. ♥ ' + username) + 
        ' '.repeat(boxWidth - 2 - accPad - accText.length) + purpleGradient('│'));
    }
  }
  
  console.log(boxPadding + purpleGradient('└' + line + '┘'));
}

function showReportOptions() {
  const terminalWidth = process.stdout.columns || 80;
  const boxWidth = 70;
  const boxPadding = ' '.repeat(Math.floor((terminalWidth - boxWidth) / 2));
  const line = '─'.repeat(boxWidth - 2);
  
  console.log(boxPadding + rubyGradient('┌' + line + '┐'));
  
  const title = 'REPORT CATEGORIES';
  const titlePad = Math.floor((boxWidth - 2 - title.length) / 2);
  console.log(boxPadding + rubyGradient('│') + ' '.repeat(titlePad) + chalk.bold.white(title) + 
    ' '.repeat(boxWidth - 2 - titlePad - title.length) + rubyGradient('│'));
  
  console.log(boxPadding + rubyGradient('├' + line + '┤'));
  
  const half = Math.ceil(REPORT_OPTIONS.length / 2);
  for (let i = 0; i < half; i++) {
    const left = REPORT_OPTIONS[i];
    const right = REPORT_OPTIONS[i + half];
    
    const leftNum = String(i + 1).padStart(2, ' ');
    const leftLabel = left.label;
    const leftFull = `${leftNum}. ${leftLabel}`;
    
    let lineContent = '';
    
    if (right) {
      const rightNum = String(i + half + 1).padStart(2, ' ');
      const rightLabel = right.label;
      const rightFull = `${rightNum}. ${rightLabel}`;
      
      // Two columns - left aligned with spacing
      const colWidth = 33;
      lineContent = leftFull.padEnd(colWidth) + rightFull;
    } else {
      lineContent = leftFull;
    }
    
    const contentPad = 2; // Small left padding
    const rightPad = boxWidth - 2 - contentPad - lineContent.length;
    
    console.log(boxPadding + rubyGradient('│') + ' '.repeat(contentPad) + 
      rubyGradient(lineContent) + ' '.repeat(rightPad) + rubyGradient('│'));
  }
  
  console.log(boxPadding + rubyGradient('├' + line + '┤'));
  
  const backText = '0. Back to Menu';
  const backPad = Math.floor((boxWidth - 2 - backText.length) / 2);
  console.log(boxPadding + rubyGradient('│') + ' '.repeat(backPad) + 
    purpleGradient('0. Back to Menu') + 
    ' '.repeat(boxWidth - 2 - backPad - backText.length) + rubyGradient('│'));
  
  console.log(boxPadding + rubyGradient('└' + line + '┘'));
  console.log('\n');
}

function showResults(statuses) {
  const total = statuses.length;
  const successes = statuses.filter(x => x === 200).length;
  const ratelimits = statuses.filter(x => x === 429).length;
  const notfound = statuses.filter(x => x === 500).length;
  const failures = statuses.filter(x => ![200, 429, 500].includes(x)).length;
  const percent = Math.floor(100 * successes / total);

  const terminalWidth = process.stdout.columns || 80;
  const boxWidth = 55;
  const boxPadding = ' '.repeat(Math.floor((terminalWidth - boxWidth) / 2));
  const line = '─'.repeat(boxWidth - 2);
  
  console.log(boxPadding + goldGradient('┌' + line + '┐'));
  
  const title = 'RESULTS SUMMARY';
  const titlePad = Math.floor((boxWidth - 2 - title.length) / 2);
  console.log(boxPadding + goldGradient('│') + ' '.repeat(titlePad) + chalk.bold.white(title) + 
    ' '.repeat(boxWidth - 2 - titlePad - title.length) + goldGradient('│'));
  
  console.log(boxPadding + goldGradient('├' + line + '┤'));
  
  // Progress bar
  const barWidth = 30;
  const filled = Math.floor(barWidth * (percent / 100));
  const empty = barWidth - filled;
  const bar = chalk.hex('#00FF00')('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
  
  const successText = `Success Rate: [${' '.repeat(barWidth)}] ${percent}%`;
  const successPad = Math.floor((boxWidth - 2 - successText.length) / 2);
  console.log(boxPadding + goldGradient('│') + ' '.repeat(successPad) + 
    chalk.white('Success Rate: [') + bar + chalk.white('] ') + chalk.bold.hex('#00FF00')(percent + '%') + 
    ' '.repeat(boxWidth - 2 - successPad - successText.length) + goldGradient('│'));
  
  console.log(boxPadding + goldGradient('├' + line + '┤'));
  
  // Stats
  const stats = `OK: ${successes}  Rate-Limited: ${ratelimits}  Failed: ${notfound + failures}  Total: ${total}`;
  const statsPad = Math.floor((boxWidth - 2 - stats.length) / 2);
  console.log(boxPadding + goldGradient('│') + ' '.repeat(statsPad) +
    chalk.green('OK: ' + successes) + '  ' +
    chalk.yellow('Rate-Limited: ' + ratelimits) + '  ' +
    chalk.red('Failed: ' + (notfound + failures)) + '  ' +
    chalk.white('Total: ' + total) +
    ' '.repeat(boxWidth - 2 - statsPad - stats.length) + goldGradient('│'));
  
  console.log(boxPadding + goldGradient('└' + line + '┘'));
}

function showLoading(text) {
  return ora({
    text: chalk.cyan(text),
    spinner: { interval: 80, frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'] },
    color: 'magenta'
  }).start();
}

function showAttackDisplay(target, reportType, status, stats) {
  console.clear();
  const terminalWidth = process.stdout.columns || 80;
  
  // ASCII Art Title - simpler, cleaner
  const titleLines = [
    'REPORT SENT',
  ];
  
  titleLines.forEach(line => {
    const padding = ' '.repeat(Math.floor((terminalWidth - line.length) / 2));
    console.log(padding + rubyGradient(line));
  });
  console.log();
  
  // Quote box - centered
  const quote = '"Keep your friends close, But your enemies closer." - Semp';
  const quoteBoxWidth = quote.length + 4;
  const quotePad = Math.floor((terminalWidth - quoteBoxWidth) / 2);
  console.log(' '.repeat(quotePad) + purpleGradient('┌' + '─'.repeat(quote.length + 2) + '┐'));
  console.log(' '.repeat(quotePad) + purpleGradient('│ ') + chalk.italic.gray(quote) + purpleGradient(' │'));
  console.log(' '.repeat(quotePad) + purpleGradient('└' + '─'.repeat(quote.length + 2) + '┘'));
  console.log();
  
  // Status box - centered
  const boxWidth = 70;
  const boxPadding = ' '.repeat(Math.floor((terminalWidth - boxWidth) / 2));
  const line = '─'.repeat(boxWidth - 2);
  
  console.log(boxPadding + rubyGradient('┌' + line + '┐'));
  
  // Helper to create centered line with proper spacing
  const createLine = (label, value, gradient) => {
    const plainText = `${label}  [ ${value} ]`;
    const leftPad = 10; // Fixed left padding for alignment
    const rightPad = boxWidth - 2 - leftPad - plainText.length;
    return boxPadding + rubyGradient('│') + ' '.repeat(leftPad) + 
      `${label}  [ ` + gradient(value) + ' ]' + 
      ' '.repeat(Math.max(0, rightPad)) + rubyGradient('│');
  };
  
  // Status line
  const statusText = status.replace(/\x1B\[[0-9;]*m/g, '');
  const leftPad = 10;
  const statusPlain = `Status:  [ ${statusText} ]`;
  const statusRight = boxWidth - 2 - leftPad - statusPlain.length;
  console.log(boxPadding + rubyGradient('│') + ' '.repeat(leftPad) + 
    'Status:  [ ' + status + ' ]' + 
    ' '.repeat(Math.max(0, statusRight)) + rubyGradient('│'));
  
  // Target line
  console.log(createLine('Target:', target, rubyGradient));
  
  // Protocol line
  console.log(createLine('Protocol:', 'HTTPS', goldGradient));
  
  // Time line
  const timeValue = new Date().toLocaleTimeString();
  console.log(createLine('Time:', timeValue, purpleGradient));
  
  // Method line
  console.log(createLine('Method:', reportType, purpleGradient));
  
  console.log(boxPadding + rubyGradient('├' + line + '┤'));
  
  // Org line
  console.log(createLine('Org:', 'Instagram', purpleGradient));
  
  // Region line
  const regionValue = stats.region || 'Global';
  console.log(createLine('Region:', regionValue, purpleGradient));
  
  // Country line
  const countryValue = stats.country || 'Worldwide';
  console.log(createLine('Country:', countryValue, purpleGradient));
  
  // Running line
  const runningValue = `${stats.sent}/${stats.total}`;
  console.log(createLine('Running:', runningValue, purpleGradient));
  
  console.log(boxPadding + rubyGradient('└' + line + '┘'));
  console.log();
}

// ═══════════════════════════════════════════════════════════════════════════
// INSTAGRAM API FUNCTIONS - Login and user lookup
// ═══════════════════════════════════════════════════════════════════════════

async function loginWeb(username, password, proxyAgent) {
  const jar = new tough.CookieJar();
  const _fetch = fetchCookie((url, opts = {}) => {
    opts.agent = proxyAgent || opts.agent;
    opts.headers = opts.headers || {};
    opts.headers["User-Agent"] = pickUA('web');
    return fetch(url, opts);
  }, jar);

  await _fetch('https://www.instagram.com/accounts/login/', {
    headers: { "User-Agent": pickUA('web') }
  });

  const csrf = (await jar.getCookies('https://www.instagram.com')).find(c => c.key === 'csrftoken')?.value;
  if (!csrf) throw new Error("No CSRF token found");

  const enc_password = `#PWD_INSTAGRAM_BROWSER:0:${Math.floor(Date.now() / 1000)}:${password}`;
  const loginResp = await _fetch('https://www.instagram.com/accounts/login/ajax/', {
    method: 'POST',
    headers: {
      "User-Agent": pickUA('web'),
      "Referer": "https://www.instagram.com/accounts/login/",
      "X-CSRFToken": csrf,
      "X-IG-App-ID": "936619743392459",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      username: username,
      enc_password: enc_password,
      queryParams: "{}",
      optIntoOneTap: "false"
    }),
    redirect: 'manual'
  });

  const outJson = await loginResp.json();
  if (!outJson.authenticated) {
    throw new Error(`Login failed: ${outJson.message || "Authentication failed"}`);
  }

  const cookies = await jar.getCookies('https://www.instagram.com');
  const sessionid = cookies.find(c => c.key === 'sessionid')?.value;
  const csrftoken = cookies.find(c => c.key === 'csrftoken')?.value;

  if (!sessionid || !csrftoken) throw new Error("SessionID or CSRFToken missing");

  return { _fetch, sessionid, csrftoken, jar, username, password, mode: 'web' };
}

async function loginMobile(username, password, proxyAgent) {
  const jar = new tough.CookieJar();
  const _fetch = fetchCookie((url, opts = {}) => {
    opts.agent = proxyAgent || opts.agent;
    opts.headers = opts.headers || {};
    opts.headers["User-Agent"] = pickUA('mobile');
    return fetch(url, opts);
  }, jar);

  const uuid = crypto.randomBytes(8).toString('hex');
  await _fetch('https://i.instagram.com/api/v1/accounts/login/', {
    headers: { "User-Agent": pickUA('mobile') }
  });

  const loginData = new URLSearchParams({
    username,
    password,
    device_id: `android-${uuid}`,
    _uuid: uuid,
    login_attempt_count: "0"
  });

  const loginResp = await _fetch('https://i.instagram.com/api/v1/accounts/login/', {
    method: 'POST',
    headers: {
      "User-Agent": pickUA('mobile'),
      "X-IG-Capabilities": "3brTvw==",
      "X-IG-Connection-Type": "WIFI",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: loginData.toString(),
    redirect: 'manual'
  });

  const outJson = await loginResp.json();
  if (!outJson.logged_in_user) {
    throw new Error(`Mobile API login failed: ${outJson.message || JSON.stringify(outJson)}`);
  }

  const cookies = await jar.getCookies('https://i.instagram.com');
  const sessionid = cookies.find(c => c.key === 'sessionid')?.value;
  const csrftoken = cookies.find(c => c.key === 'csrftoken')?.value;

  if (!sessionid) throw new Error("Mobile API: sessionid not found");

  return { _fetch, sessionid, csrftoken, jar, username, password, mode: 'mobile' };
}

async function loginAccounts(accounts, proxy, apimode) {
  const result = [];
  
  console.log(rubyGradient('\n🔐 Authenticating accounts...\n'));
  
  const progressBar = new cliProgress.SingleBar({
    format: '  ' + purpleGradient('{bar}') + ' ' + purpleGradient('{value}/{total}'),
    barCompleteChar: '█',
    barIncompleteChar: '░',
    hideCursor: true,
    barsize: 40
  }, cliProgress.Presets.shades_classic);
  
  progressBar.start(accounts.length, 0);
  
  for (let i = 0; i < accounts.length; i++) {
    const { username, password } = accounts[i];
    try {
      const account = apimode === "web"
        ? await loginWeb(username, password, getProxyAgent(proxy))
        : await loginMobile(username, password, getProxyAgent(proxy));
      result.push(account);
      progressBar.update(i + 1);
      await sleep(300);
    } catch (e) {
      progressBar.update(i + 1);
      console.log('\n' + chalk.red(`  ✗ @${username}: ${e.message.substring(0, 50)}...`));
    }
  }
  
  progressBar.stop();
  
  if (result.length === 0) {
    throw new Error('All logins failed - no available accounts');
  }
  
  console.log(chalk.bold.green(`\n  ✓ ${result.length}/${accounts.length} accounts ready\n`));
  return result;
}

async function getUserIdMobile(username) {
  try {
    const loginData = new URLSearchParams({
      signed_body: `35a2d547d3b6ff400f713948cdffe0b789a903f86117eb6e2f3e573079b2f038.${JSON.stringify({ q: username })}`
    });
    
    const resp = await fetch('https://i.instagram.com:443/api/v1/users/lookup/', {
      method: 'POST',
      headers: {
        "Connection": "close",
        "X-IG-Connection-Type": "WIFI",
        "mid": "XOSINgABAAG1IDmaral3noOozrK0rrNSbPuSbzHq",
        "X-IG-Capabilities": "3R4=",
        "Accept-Language": "en-US",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Instagram 99.4.0",
        "Accept-Encoding": "gzip, deflate"
      },
      body: loginData.toString()
    });
    
    const json = await resp.json();
    if (json.user_id && !json.spam) {
      return String(json.user_id);
    }
  } catch (e) {
    // Fall through to next method
  }
  return null;
}

async function getUserIdWeb(username, _fetch) {
  const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`;
  const resp = await _fetch(url, {
    headers: {
      "User-Agent": pickUA('web'),
      "X-IG-App-ID": "936619743392459",
      "Referer": `https://www.instagram.com/${username}/`
    }
  });
  
  if (!resp.ok) throw new Error(`WebAPI: Could not resolve user "${username}"`);
  
  const json = await resp.json();
  const id = json?.data?.user?.id;
  
  if (!id) throw new Error(`WebAPI: User ID not found for "${username}"`);
  return id;
}

async function getUserIdHTML(username, _fetch) {
  const url = `https://www.instagram.com/${username}/`;
  const resp = await _fetch(url, { headers: { "User-Agent": pickUA('web') } });
  
  if (!resp.ok) throw new Error(`HTML: Could not retrieve profile for "${username}"`);
  
  const html = await resp.text();
  const $ = cheerio.load(html);
  let userId = null;

  // Method 1: Look for profile_id pattern
  const profileIdMatch = html.match(/"profile_id":"(\d+)"/);
  if (profileIdMatch) userId = profileIdMatch[1];

  // Method 2: Look for profilePage pattern
  if (!userId) {
    const pageIdMatch = html.match(/"page_id":"profilePage_(\d+)"/);
    if (pageIdMatch) userId = pageIdMatch[1];
  }

  // Method 3: Script tags
  if (!userId) {
    const scripts = $('script[type="application/ld+json"], script[type="text/javascript"]');
    scripts.each((i, el) => {
      const txt = $(el).html();
      const match = txt && txt.match(/profilePage_(\d+)/);
      if (match) userId = match[1];
    });
  }

  // Method 4: Meta tags
  if (!userId) {
    const metaId = $('meta[property="al:ios:url"]').attr('content');
    if (metaId) {
      const metaMatch = metaId.match(/id=(\d+)/);
      if (metaMatch) userId = metaMatch[1];
    }
  }

  // Method 5: JSDOM fallback
  if (!userId) {
    const dom = new JSDOM(html);
    const scripts = dom.window.document.querySelectorAll('script');
    scripts.forEach(script => {
      const txt = script.textContent;
      const match = txt && txt.match(/profilePage_(\d+)/);
      if (match) userId = match[1];
    });
  }

  if (!userId) throw new Error(`HTML: Could not find user ID for "${username}"`);
  return userId;
}

async function getUserId(username, _fetch) {
  // Method 1: Try mobile API lookup (fastest, no auth needed)
  try {
    const mobileId = await getUserIdMobile(username);
    if (mobileId) return mobileId;
  } catch (e) {
    // Continue to next method
  }
  
  // Method 2: Try Web API
  try {
    return await getUserIdWeb(username, _fetch);
  } catch (e) {
    // Continue to next method
  }
  
  // Method 3: HTML scraping fallback
  try {
    return await getUserIdHTML(username, _fetch);
  } catch (e) {
    throw new Error(`All methods failed to resolve @${username}: ${e.message}`);
  }
}

async function getCurrentUsername(_fetch) {
  try {
    // Method 1: Try accounts edit endpoint
    const resp = await _fetch('https://www.instagram.com/api/v1/accounts/edit/web_form_data/', {
      headers: {
        "User-Agent": pickUA('web'),
        "X-IG-App-ID": "936619743392459",
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    
    if (resp.ok) {
      const json = await resp.json();
      if (json?.form_data?.username) {
        return json.form_data.username;
      }
    }
  } catch (e) {
    // Continue to next method
  }
  
  try {
    // Method 2: Try current user endpoint
    const resp = await _fetch('https://www.instagram.com/api/v1/users/web_profile_info/?username=', {
      headers: {
        "User-Agent": pickUA('web'),
        "X-IG-App-ID": "936619743392459"
      }
    });
    
    if (resp.ok) {
      const json = await resp.json();
      if (json?.data?.user?.username) {
        return json.data.user.username;
      }
    }
  } catch (e) {
    // Continue to next method
  }
  
  try {
    // Method 3: Parse from homepage
    const resp = await _fetch('https://www.instagram.com/', {
      headers: { "User-Agent": pickUA('web') }
    });
    
    if (resp.ok) {
      const html = await resp.text();
      
      // Try multiple regex patterns
      const patterns = [
        /"username":"([^"]+)"/,
        /"userName":"([^"]+)"/,
        /instagram:\/\/user\?username=([^"&]+)/,
        /"viewerId":"(\d+)","username":"([^"]+)"/
      ];
      
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match && match[1] && match[1] !== 'null') {
          // If pattern has 2 groups, username is in group 2
          return match[2] || match[1];
        }
      }
    }
  } catch (e) {
    // Ignore
  }
  
  return 'token_user';
}

// ═══════════════════════════════════════════════════════════════════════════
// REPORTING ENGINE - Submit reports to Instagram
// ═══════════════════════════════════════════════════════════════════════════

async function submitReport(targetId, { reason_id }, sessionid, csrftoken, _fetch, mode = 'mobile') {
  const ua = pickUA(mode);
  const url = `https://i.instagram.com/users/${targetId}/flag/`;
  
  // Enhanced headers dont touch nigga
  const headers = {
    "User-Agent": ua,
    "Host": "i.instagram.com",
    "cookie": `sessionid=${sessionid}`,
    "X-CSRFToken": csrftoken || "",
    "X-IG-App-ID": "567067343352427",
    "X-IG-Capabilities": "3brTvw==",
    "X-IG-Connection-Type": ["WIFI", "4G", "5G"][Math.floor(Math.random() * 3)],
    "X-IG-Device-ID": crypto.randomUUID(),
    "Accept-Language": "en-US",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Accept-Encoding": "gzip, deflate",
    "X-FB-HTTP-Engine": "Liger",
    "Accept": "*/*",
    "Origin": "https://www.instagram.com",
    "Referer": "https://www.instagram.com/"
  };
  
  // Build body with additional context based on reason type
  let extraData = '';
  
  // Special handling for certain report types (from Python)
  if (reason_id === '5' && Math.random() > 0.5) {
    // Impersonation - sometimes add celebrity context
    extraData = '&action_type=celebrity&celebrity_username=tmnaofcl';
  }
  
  const body = `source_name=&reason_id=${reason_id}&frx_context=${extraData}`;
  
  try {
    const resp = await _fetch(url, {
      method: 'POST',
      headers,
      body,
      redirect: 'manual',
      timeout: 15000
    });
    
    // Enhanced status handling
    const status = resp.status;
    
    // Treat redirects as success (Instagram sometimes redirects on successful reports)
    if (status === 302 || status === 301) return 200;
    
    return status;
  } catch (error) {
    // Better error handling
    if (error.code === 'ETIMEDOUT') return 408;
    if (error.type === 'request-timeout') return 408;
    if (error.message && error.message.includes('redirect')) return 200; // Redirect errors often mean success
    return 0;
  }
}

async function executeReporting(accounts, targets, chosenOption, nReports, sleepMin, sleepMax, apimode) {
  let accIdx = 0;
  let results = [];
  
  for (const targetUser of targets) {
    let targetId = null;
    
    // Resolve target ID first
    const spinner = showLoading(`Resolving @${targetUser}...`);
    try {
      targetId = await getUserId(targetUser, accounts[accIdx]._fetch);
      spinner.succeed(chalk.green(`✓ Resolved @${targetUser} → ${targetId}`));
      await sleep(1000);
    } catch (e) {
      spinner.fail(chalk.red(`✗ Failed: ${e.message}`));
      continue;
    }
    
    // Initialize attack display stats
    const stats = {
      total: nReports,
      sent: 0,
      success: 0,
      failed: 0,
      rateLimited: 0,
      region: 'Global',
      country: 'Worldwide',
      recentEvents: []
    };
    
    let successCount = 0;
    let rateLimitCount = 0;
    
    for (let i = 1; i <= nReports; i++) {
      accIdx = (accIdx + 1) % accounts.length;
      const acc = accounts[accIdx];
      
      // Show live attack display
      const statusText = goldGradient('Attack Successfully Sent');
      showAttackDisplay(
        `instagram.com/${targetUser}`,
        chosenOption.label,
        statusText,
        stats
      );
      
      const status = await submitReport(targetId, chosenOption, acc.sessionid, acc.csrftoken, acc._fetch, apimode);
      
      // Update stats based on response
      stats.sent = i;
      
      if (status === 200) {
        successCount++;
        stats.success++;
      } else if (status === 429) {
        rateLimitCount++;
        stats.rateLimited++;
        if (rateLimitCount > 2) {
          sleepMin *= 1.5;
          sleepMax *= 1.5;
        }
      } else {
        stats.failed++;
      }
      
      // Calculate smart delay for next report
      if (i < nReports) {
        const delayMs = calculateSmartDelay(sleepMin * 1000, sleepMax * 1000, i, nReports);
        await sleep(delayMs);
      }
    }
    
    // Final display with completion status
    showAttackDisplay(
      `instagram.com/${targetUser}`,
      chosenOption.label,
      goldGradient('Attack Completed Successfully'),
      stats
    );
    
    await sleep(2000);
    
    results.push({ targetUser, stats });
  }
  
  return results;
}

// ═══════════════════════════════════════════════════════════════════════════
// SETUP WORKFLOWS - Different configuration paths
// ═══════════════════════════════════════════════════════════════════════════

async function quickSetup() {
  console.log(rubyGradient('\n⚡ QUICK REPORT SETUP\n'));
  
  // Login method
  console.log('  ' + purpleGradient('1. Username & Password'));
  console.log('  ' + purpleGradient('2. SessionID & CSRF Token'));
  console.log('  ' + purpleGradient('0. Back to Menu'));
  console.log();
  
  let loginMethod = '';
  while (loginMethod !== 'credentials' && loginMethod !== 'tokens') {
    const ans = await prompt('Login Method [1=Credentials, 2=Tokens, 0=Back]:');
    if (ans === '0') return null;
    if (ans === '1') loginMethod = 'credentials';
    else if (ans === '2') loginMethod = 'tokens';
  }
  
  // API Mode
  console.log('  ' + purpleGradient('1. Web (Browser) API'));
  console.log('  ' + purpleGradient('2. Mobile (Android App) API'));
  console.log('  ' + purpleGradient('0. Back to Menu'));
  console.log();
  let apimode = '';
  while (apimode !== 'web' && apimode !== 'mobile') {
    const ans = await prompt('API Mode [1=Web, 2=Mobile, 0=Back]:');
    if (ans === '0') return null;
    if (ans === '1' || ans.toLowerCase() === 'web') apimode = 'web';
    else if (ans === '2' || ans.toLowerCase() === 'mobile') apimode = 'mobile';
  }
  
  let accounts = [];
  
  if (loginMethod === 'credentials') {
    // Single account with username/password
    const username = await prompt('Instagram username:');
    const password = await prompt('Instagram password:');
    accounts = [{ username, password }];
  } else {
    // SessionID & CSRF Token login
    const sessionid = await prompt('SessionID:');
    const csrftoken = await prompt('CSRF Token:');
    
    // Create mock fetch function with cookies
    const jar = new tough.CookieJar();
    const _fetch = fetchCookie((url, opts = {}) => {
      opts.headers = opts.headers || {};
      opts.headers["User-Agent"] = pickUA(apimode);
      opts.headers["cookie"] = `sessionid=${sessionid}; csrftoken=${csrftoken}`;
      return fetch(url, opts);
    }, jar);
    
    // Get actual username from session
    const spinner = showLoading('Fetching account info...');
    const actualUsername = await getCurrentUsername(_fetch);
    spinner.succeed(chalk.green(`✓ Logged in as @${actualUsername}`));
    
    accounts = [{
      _fetch,
      sessionid,
      csrftoken,
      jar,
      username: actualUsername,
      password: '',
      mode: apimode
    }];
  }
  
  // Target
  const target = await prompt('Target username to report:');
  const targets = [target];
  
  // Report type
  showReportOptions();
  let reasonIdx = NaN;
  while (isNaN(reasonIdx) || reasonIdx < 1 || reasonIdx > REPORT_OPTIONS.length) {
    reasonIdx = parseInt(await prompt('Report reason number:'), 10);
  }
  const chosenOption = REPORT_OPTIONS[reasonIdx - 1];
  
  // Number of reports
  let nReports = NaN;
  while (isNaN(nReports) || nReports < 1 || nReports > 1000) {
    nReports = parseInt(await prompt('Number of reports (1-1000):'), 10);
  }
  
  const config = {
    apiMode: apimode,
    accounts,
    targets,
    reasonIdx,
    nReports,
    sleepMin: 2,
    sleepMax: 5,
    proxy: '',
    webhookUrl: '',
    scheduleMin: 0
  };
  
  return config;
}

async function advancedSetup() {
  console.log(rubyGradient('\n⚙️  ADVANCED SETUP\n'));
  
  // API Mode
  console.log('  ' + purpleGradient('1. Web (Browser) API'));
  console.log('  ' + purpleGradient('2. Mobile (Android App) API'));
  console.log('  ' + purpleGradient('0. Back to Menu'));
  console.log();
  let apimode = '';
  while (apimode !== 'web' && apimode !== 'mobile') {
    const ans = await prompt('API Mode [1=Web, 2=Mobile, 0=Back]:');
    if (ans === '0') return null;
    if (ans === '1' || ans.toLowerCase() === 'web') apimode = 'web';
    else if (ans === '2' || ans.toLowerCase() === 'mobile') apimode = 'mobile';
  }
  
  // Multiple accounts
  let nAcc = NaN;
  while (isNaN(nAcc) || nAcc < 1) {
    nAcc = parseInt(await prompt('Number of Instagram accounts:'), 10);
  }
  
  const accounts = [];
  for (let i = 1; i <= nAcc; i++) {
    const username = await prompt(`Account #${i} username:`);
    const password = await prompt(`Account #${i} password:`);
    accounts.push({ username, password });
  }
  
  // Multiple targets
  const targetsInput = await prompt('Target usernames (comma-separated):');
  const targets = targetsInput.split(',').map(x => x.trim()).filter(Boolean);
  
  // Proxy
  const proxy = await prompt('Proxy URL (http://... or socks://..., leave blank for none):');
  
  // Report type
  showReportOptions();
  let reasonIdx = NaN;
  while (isNaN(reasonIdx) || reasonIdx < 1 || reasonIdx > REPORT_OPTIONS.length) {
    reasonIdx = parseInt(await prompt('Report reason number:'), 10);
  }
  const chosenOption = REPORT_OPTIONS[reasonIdx - 1];
  
  // Number of reports per target
  let nReports = NaN;
  while (isNaN(nReports) || nReports < 1 || nReports > 1000) {
    nReports = parseInt(await prompt('Reports per target (1-1000):'), 10);
  }
  
  // Sleep times
  let sleepMin = NaN;
  while (isNaN(sleepMin) || sleepMin < 1 || sleepMin > 200) {
    sleepMin = parseFloat(await prompt('Minimum sleep (1-200 sec):'));
  }
  
  let sleepMax = NaN;
  while (isNaN(sleepMax) || sleepMax < sleepMin || sleepMax > 200) {
    sleepMax = parseFloat(await prompt('Maximum sleep (>= min, max 200 sec):'));
  }
  
  // Webhook
  const webhookUrl = await prompt('Webhook URL for notifications (optional):');
  
  // Schedule
  let scheduleMin = parseInt(await prompt('Schedule interval in minutes (0 for run once):'), 10);
  if (isNaN(scheduleMin) || scheduleMin < 0) scheduleMin = 0;
  
  const config = {
    apiMode: apimode,
    accounts,
    targets,
    reasonIdx,
    nReports,
    sleepMin,
    sleepMax,
    proxy: proxy || '',
    webhookUrl: webhookUrl || '',
    scheduleMin
  };
  
  saveConfig(config);
  console.log(chalk.green('\n  ✓ Configuration saved to config.json\n'));
  
  return config;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APPLICATION
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  showBanner();
  showMenu();
  
  const choice = await prompt('Select option [1-6]:');
  
  let config = {};
  
  switch (choice) {
    case '1':
      config = await quickSetup();
      if (!config) return main();
      break;
      
    case '2':
      config = await advancedSetup();
      if (!config) return main();
      break;
      
    case '3':
      config = loadConfig();
      if (Object.keys(config).length === 0) {
        console.log(chalk.red('\n  ✗ No configuration file found\n'));
        return main();
      }
      console.log(chalk.green('\n  ✓ Configuration loaded\n'));
      break;
      
    case '4':
      showReportOptions();
      const backChoice = await prompt('Press Enter to return or select option:');
      if (backChoice === '0' || backChoice === '') return main();
      return main();
      
    case '5':
      showCredits();
      await prompt('Press Enter to return to menu');
      return main();
      
    case '6':
      console.log(chalk.yellow('\n  Goodbye!\n'));
      process.exit(0);
      
    default:
      console.log(chalk.red('\n  ✗ Invalid choice\n'));
      return main();
  }
  
  // Validate config
  if (!config || !config.accounts || !config.targets || !config.apiMode) {
    console.log(chalk.red('\n  ✗ Invalid configuration\n'));
    return main();
  }
  
  showAccountsList(config.accounts);
  
  // Login - skip if using token method
  let igAccounts;
  if (config.accounts[0].sessionid && config.accounts[0]._fetch) {
    // Already authenticated with tokens
    console.log(chalk.bold.green('\n  ✓ Using existing session tokens\n'));
    igAccounts = config.accounts;
  } else {
    // Normal login flow
    try {
      igAccounts = await loginAccounts(config.accounts, config.proxy, config.apiMode);
    } catch (e) {
      console.log(chalk.bold.red(`\n  ✗ Login Error: ${e.message}\n`));
      process.exit(1);
    }
  }
  
  // Execute reporting
  const chosenOption = REPORT_OPTIONS[config.reasonIdx - 1];
  await executeReporting(
    igAccounts,
    config.targets,
    chosenOption,
    config.nReports,
    config.sleepMin,
    config.sleepMax,
    config.apiMode
  );
  
  console.log(chalk.bold.green('\n  ✓ Reporting completed successfully!\n'));
  
  // Ask to continue
  const cont = await prompt('Return to main menu? [Y/n]:');
  if (cont.toLowerCase() === 'y' || cont === '') {
    return main();
  }
  
  process.exit(0);
}

// Start application
main().catch(err => {
  console.error(chalk.bold.red('\n  ✗ Fatal Error: ' + err.message + '\n'));
  process.exit(1);
});
