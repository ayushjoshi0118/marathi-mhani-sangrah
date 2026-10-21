/**
 * Marathi Mhani Sangrah — Production Dataset Backup Utility
 * 
 * Creates timestamped JSON snapshots, UTF-8 CSV exports, and SHA-256 integrity
 * checksums for proverbs, community submissions, and correction records.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.resolve('src/data');
const BACKUP_ROOT = path.resolve('backups');

const FILES_TO_BACKUP = [
  'proverbs.json',
  'submissions.json',
  'corrections.json',
  'curation_report.json',
];

function generateHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function performBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const targetDir = path.join(BACKUP_ROOT, `backup_${timestamp}`);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const manifest = {
    timestamp: new Date().toISOString(),
    files: {},
    metrics: {},
  };

  console.log('===============================================================');
  console.log(`   BACKUP PROCEDURE STARTED — ${manifest.timestamp}`);
  console.log('===============================================================\n');

  for (const fileName of FILES_TO_BACKUP) {
    const srcPath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(srcPath)) {
      console.warn(`[SKIP] File not found: ${fileName}`);
      continue;
    }

    const content = fs.readFileSync(srcPath, 'utf8');
    const destPath = path.join(targetDir, fileName);
    fs.writeFileSync(destPath, content, 'utf8');

    const sha256 = generateHash(content);
    manifest.files[fileName] = {
      sizeBytes: Buffer.byteLength(content, 'utf8'),
      sha256,
      destination: destPath,
    };

    if (fileName === 'proverbs.json') {
      const parsed = JSON.parse(content);
      const published = parsed.filter((p) => p.status === 'published').length;
      const draft = parsed.filter((p) => p.status === 'draft').length;
      manifest.metrics.proverbs = {
        total: parsed.length,
        published,
        draft,
      };

      // Also export a clean UTF-8 CSV for offline archival & research
      const csvPath = path.join(targetDir, 'proverbs_export.csv');
      const csvHeader = 'serialNumber,proverb,meaningMarathi,meaningEnglish,category,status\n';
      const csvRows = parsed
        .map((p) =>
          [
            p.serialNumber,
            `"${(p.proverb || '').replace(/"/g, '""')}"`,
            `"${(p.meaningMarathi || '').replace(/"/g, '""')}"`,
            `"${(p.meaningEnglish || '').replace(/"/g, '""')}"`,
            `"${(p.category || '').replace(/"/g, '""')}"`,
            p.status,
          ].join(',')
        )
        .join('\n');
      fs.writeFileSync(csvPath, '\uFEFF' + csvHeader + csvRows, 'utf8');
      console.log(`[CSV] Exported proverbs CSV archive at ${csvPath}`);
    }

    console.log(`[BACKUP] ${fileName} -> ${sha256.substring(0, 12)}... (${manifest.files[fileName].sizeBytes} bytes)`);
  }

  const manifestPath = path.join(targetDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\n[SUCCESS] Backup completed successfully in:\n  ${targetDir}\n`);

  return { targetDir, manifest };
}

// Execute when invoked directly
if (process.argv[1] && process.argv[1].endsWith('backup_dataset.mjs')) {
  performBackup();
}
