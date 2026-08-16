'use strict';

const fs = require('fs');
const path = require('path');

class JsonFileReader {
  static _getFolderCandidates(folder) {
    const candidates = [folder];
    const lower = (folder || '').toLowerCase().replace(/_/g, '-');
    if (lower === 'query-parameters' || lower === 'query_parameters') {
      candidates.push('Query_Parameters', 'query-parameters');
    } else if (lower === 'request-bodies' || lower === 'request_bodies') {
      candidates.push('Request_Bodies', 'request-bodies');
    } else if (lower === 'schema' || lower === 'schemas') {
      candidates.push('Schema', 'schemas');
    } else if (lower === 'headers') {
      candidates.push('headers');
    }
    return [...new Set(candidates)];
  }

  static getResourcePath(folder, fileName) {
    if (!fileName || fileName === 'NA') return null;

    const fullFileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
    const folderCandidates = this._getFolderCandidates(folder);

    const baseRoots = [
      path.resolve(__dirname, '../resources'),
      path.resolve(__dirname, '../../../test-data/api'),
    ];

    for (const baseRoot of baseRoots) {
      for (const fCandidate of folderCandidates) {
        const candidatePath = path.join(baseRoot, fCandidate, fullFileName);
        if (fs.existsSync(candidatePath)) {
          return candidatePath;
        }
      }
    }

    return path.resolve(__dirname, `../resources/${folder}/${fullFileName}`);
  }

  static readJson(folder, fileName) {
    if (!fileName || fileName === 'NA') return null;

    const filePath = this.getResourcePath(folder, fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`JSON file not found at path: ${filePath}`);
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  }

  static readRawFile(folder, fileName) {
    if (!fileName || fileName === 'NA') return null;

    const folderCandidates = this._getFolderCandidates(folder);
    const baseRoots = [
      path.resolve(__dirname, '../resources'),
      path.resolve(__dirname, '../../../test-data/api'),
    ];

    for (const baseRoot of baseRoots) {
      for (const fCandidate of folderCandidates) {
        const candidatePath = path.join(baseRoot, fCandidate, fileName);
        if (fs.existsSync(candidatePath)) {
          return candidatePath;
        }
      }
    }

    return path.resolve(__dirname, `../resources/${folder}/${fileName}`);
  }
}

module.exports = JsonFileReader;
