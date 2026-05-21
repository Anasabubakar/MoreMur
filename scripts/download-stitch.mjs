import { stitch } from '@google/stitch-sdk';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.STITCH_API_KEY;
const PROJECT_ID = '3984967297086363189';
const ASSET_DIR = path.join(__dirname, '../stitch/screens');

const targetScreens = [
  { id: '0bfd9428e277404ab598a7eeb3fbaa4b', name: '01-anonymous-feed-mobile' },
  { id: '362bfe203ee240d08df0711319c1e10a', name: '02-trending-feed-mobile' },
  { id: '4c03f6f122724559a4022df892bec57e', name: '03-signup-verification-mobile' },
  { id: '69723d159c904df7a0412e4ab9b6b109', name: '04-culture-intel-mobile' },
  { id: '6d656a0018cf459cb9ccf33f74149096', name: '05-landing-page' },
  { id: '789d55911e994344b537f460eaf27749', name: '06-culture-intelligence-report' },
  { id: '8058d9d62bf24c5b82497912ddd50d6f', name: '07-anonymous-feed' },
  { id: '92ff9f006db24e27a881999ca6c9aedb', name: '08-signup-verification' },
  { id: '9600730465df4510990b72d8b73d4dfd', name: '09-trending-feed' },
  { id: 'a0147a3b94064e4eb76c4f69768c05c0', name: '10-landing-page-mobile' },
  {
    id: 'asset-stub-assets-99af8109b548496f9afd4e8fe8f76774-1779358323352',
    name: '11-design-system',
  },
  { id: 'c67b75d926104c1797cda4121e4d1765', name: '12-org-admin-mobile' },
  { id: 'ce1691e0839d49a9b86b5df1227b9765', name: '13-org-admin-dashboard' },
  { id: '6afc7ca712d94f7581ad38a5bec4331a', name: '14-landing-page-alt' },
  { id: '03926ae1864c4e6cac2c2148ae4be21a', name: '15-anonymous-feed-alt' },
  { id: 'b4200fd731a64927ab2170d34eed225c', name: '16-signup-verification-alt' },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const request = https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });
    request.on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  if (!API_KEY) {
    console.error('STITCH_API_KEY is required');
    process.exit(1);
  }

  fs.mkdirSync(ASSET_DIR, { recursive: true });
  process.env.STITCH_API_KEY = API_KEY;

  console.log(`Downloading Stitch project ${PROJECT_ID}...`);
  const project = stitch.project(PROJECT_ID);
  const allScreens = await project.screens();
  console.log(`Found ${allScreens.length} screens in project.`);

  const manifest = [];

  for (const target of targetScreens) {
    console.log(`Processing ${target.name} (${target.id})...`);
    const screen = allScreens.find((s) => s.id === target.id);

    if (!screen) {
      console.warn(`Screen ${target.id} not found.`);
      manifest.push({ ...target, status: 'not_found' });
      continue;
    }

    const entry = {
      id: target.id,
      slug: target.name,
      title: screen.title ?? target.name,
      deviceType: screen.deviceType ?? null,
      width: screen.width ?? null,
      height: screen.height ?? null,
      status: 'ok',
      files: {},
    };

    try {
      const imageUrl = await screen.getImage();
      const htmlUrl = await screen.getHtml();

      if (imageUrl) {
        const imagePath = path.join(ASSET_DIR, `${target.name}.png`);
        await downloadFile(imageUrl, imagePath);
        entry.files.png = path.relative(path.join(__dirname, '..'), imagePath);
        console.log(`  saved ${entry.files.png}`);
      }

      if (htmlUrl) {
        const htmlPath = path.join(ASSET_DIR, `${target.name}.html`);
        await downloadFile(htmlUrl, htmlPath);
        entry.files.html = path.relative(path.join(__dirname, '..'), htmlPath);
        console.log(`  saved ${entry.files.html}`);
      }
    } catch (err) {
      entry.status = 'error';
      entry.error = err.message;
      console.error(`  failed: ${err.message}`);
    }

    manifest.push(entry);
  }

  const manifestPath = path.join(__dirname, '../stitch/manifest.json');
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        projectId: PROJECT_ID,
        projectTitle: 'MURMUR Anonymous Intelligence Platform',
        downloadedAt: new Date().toISOString(),
        screens: manifest,
      },
      null,
      2,
    ),
  );
  console.log(`Wrote manifest to ${manifestPath}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
