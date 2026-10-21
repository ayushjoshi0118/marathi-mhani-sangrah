/**
 * Marathi Mhani Sangrah — Production Dataset Restore Utility
 * 
 * Restores dataset files from a validated timestamped backup snapshot,
 * verifying SHA-256 integrity and preventing accidental data corruption.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.resolve('src/data');
const BACKUP_ROOT = path.resolve('backups');

function generateHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function restoreBackup(backupFolderName) {
  console.log('===============================================================');
  console.log('   DATASET RESTORE PROCEDURE');
  console.log('===============================================================\n');

  if (!backupFolderName) {
    // Pick the most recent backup folder
    if (!fs.existsSync(BACKUP_ROOT)) {
      console.error('[ERROR] No backups directory found.');
      process.exit(1);
    }
    const folders = fs.readdirSync(BACKUP_ROOT).filter((f) => f.startsWith('backup_')).sort().reverse();
    if (folders.length === 0) {
      console.error('[ERROR] No backup snapshots found in backups/.');
      process.exit(1);
    }
    backupFolderName = folders[0];
    console.log(`[AUTO] Selected most recent backup: ${backupFolderName}`);
  }

  const sourceDir = path.join(BACKUP_ROOT, backupFolderName);
  const manifestPath = path.join(sourceDir, 'manifest.json');

  if (!fs.existsSync(manifestPath)) {
    console.error(`[ERROR] Manifest not found in ${sourceDir}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log(`[INFO] Restoring snapshot from: ${manifest.timestamp}`);

  for (const [fileName, meta] of Object.entries(manifest.files)) {
    const srcFile = path.join(sourceDir, fileName);
    if (!fs.existsSync(srcFile)) {
      console.warn(`[WARN] Backup file missing: ${srcFile}`);
      continue;
    }

    const content = fs.readFileSync(srcFile, 'utf8');
    const hash = generateHash(content);

    if (hash !== meta.sha256) {
      console.error(`[ERROR] Checksum mismatch for ${fileName}! Expected ${meta.sha256}, got ${hash}. Aborting restore.`);
      process.exit(1);
    }

    const destFile = path.join(DATA_DIR, fileName);
    fs.writeFileSync(destFile, content, 'utf8');
    console.log(`[RESTORED] ${fileName} (Verified SHA-256)`);
  }

  console.log('\n[SUCCESS] Dataset restored and verified successfully!\n');
}

// Execute when invoked directly
const target = process.argv[2];
restoreBackup(target);
