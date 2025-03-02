const fs = require('fs');
const process = require('process');
const { generateVersion } = require('./_generateVersion');

const isDev = process.argv.includes('--dev');
const version = process.argv.includes('--version') ? process.argv[process.argv.indexOf('--version') + 1] : null;
const browser = process.argv.find(arg => arg.startsWith('--browser='))?.split('=')?.[1];
if (browser == null) {
    throw new Error('No browser provided. Build with option --browser=<chrome|firefox>');
}

const contentScriptDir = './src/content-scripts';
const contentScripts = fs.readdirSync(contentScriptDir, { withFileTypes: true })
    .filter(file => file.isDirectory())
    .map(dir => dir.name)
    .map(dirName => {
        const files = fs.readdirSync('./dist/content-scripts', { withFileTypes: true })
            .filter(file => file.isFile())
            .map(file => file.name)
            .filter(fileName => fileName.startsWith(dirName) && !fileName.endsWith('.map'));

        const options = JSON.parse(fs.readFileSync(`${contentScriptDir}/${dirName}/options.json`, 'utf-8'));

        ['js', 'css'].forEach(type => {
            const file = files.find(file => file.endsWith(`.${type}`));
            if (file == null) {
                return;
            }

            options[type] ??= [];
            options[type].push(`content-scripts/${file}`);
        });

        ['js', 'css'].forEach(type => {
            const files = options[type];
            if (files == null) {
                return;
            }

            options[type] = files.map(file => file.replace('${browser}', browser));
        });

        return options;
    });

const now = new Date();
const manifest = {
    name: 'OGame Tracker' + (isDev ? ' DEV' : ''),
    description: '__MSG_appDesc__',
    manifest_version: 3,
    default_locale: 'de',
    version: version ?? generateVersion(),
    icons: {
        [128]: isDev ? 'icon128-dev.png' : 'icon128.png',
    },
    permissions: [
        'storage',
        'unlimitedStorage',
    ],
    host_permissions: [
        'https://*.ogame.gameforge.com/*',
    ],
    web_accessible_resources: [
        {
            resources: ['img/*', 'views/*', 'mdi/*', "ogti/*"],
            matches: ['https://*.ogame.gameforge.com/*'],
        },
    ],
    content_scripts: [
        ...contentScripts,
    ],
    background: {},
};

if (browser == 'chrome') {
    manifest.background.service_worker = 'service-worker.js';
} 
else if (browser == 'firefox') {
    manifest.background.scripts = ['service-worker.js'];
    manifest.browser_specific_settings = {
        gecko: {
            id: '{ce110eb6-2f01-4ee5-9dc3-6378e566c0fa}', // addon ID from addons.mozilla.org
            strict_min_version: '109.0',
        },
    };
}

fs.writeFileSync('./dist/manifest.json', JSON.stringify(manifest, null, 4), 'utf-8');