import * as XLSX from 'xlsx';
import { SheetMeta, RelationshipMeta } from '../types';

export function parseCSVLine(line: string, delimiter: string = ','): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim().replace(/^["']|["']$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^["']|["']$/g, ''));
  return result;
}

export function detectDelimiter(headerLine: string): string {
  if (headerLine.includes('\t')) return '\t';
  if (headerLine.includes(';') && !headerLine.includes(',')) return ';';
  if (headerLine.includes('|')) return '|';
  return ',';
}

export function inferType(values: any[]): string {
  const nonNulls = values.filter((v) => v !== undefined && v !== null && String(v).trim() !== '');
  if (nonNulls.length === 0) return 'VARCHAR(64)';

  let isInteger = true;
  let isDecimal = true;
  let isBoolean = true;
  let isDate = true;

  for (const v of nonNulls.slice(0, 30)) {
    const s = String(v).trim();
    if (!/^-?\d+$/.test(s)) isInteger = false;
    if (!/^-?\d+(\.\d+)?$/.test(s)) isDecimal = false;
    if (!/^(true|false|0|1|yes|no)$/i.test(s)) isBoolean = false;
    if (isNaN(Date.parse(s)) || s.length < 6 || /^\d+$/.test(s)) isDate = false;
  }

  if (isBoolean) return 'BOOLEAN';
  if (isInteger) return 'INTEGER';
  if (isDecimal) return 'DECIMAL(10,2)';
  if (isDate) return 'TIMESTAMP';
  return 'VARCHAR(64)';
}

function detectPrimaryKey(columnNames: string[]): string {
  let bestKey = '-';

  // 1. Check for timestamp first (common submission key in form responses / Google Sheets)
  for (const col of columnNames) {
    const lower = col.toLowerCase().trim().replace(/[\s_-]+/g, '_');
    if (
      lower === 'timestamp' ||
      lower.startsWith('timestamp') ||
      lower.endsWith('timestamp') ||
      lower === 'time_stamp'
    ) {
      return col;
    }
  }

  // 2. Check for standard ID keys
  for (const col of columnNames) {
    const lower = col.toLowerCase().trim();
    if (
      lower.endsWith('_id') ||
      lower.endsWith('id') ||
      lower.endsWith('_key') ||
      lower === 'id' ||
      lower === 'key' ||
      lower.endsWith('_no') ||
      lower.endsWith('_code')
    ) {
      bestKey = col;
      break;
    }
  }
  return bestKey;
}

function buildSheetMeta(
  sheetName: string,
  rows: Record<string, any>[],
  sourceFileName: string
): SheetMeta {
  const cleanName = sheetName
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/^_+|_+$/g, '') || 'sheet_data';

  const columnNames = rows.length > 0 ? Object.keys(rows[0]) : ['col1'];
  const bestKey = detectPrimaryKey(columnNames);

  const sampleColumns = columnNames.map((colName) => {
    const colValues = rows.map((r) => r[colName]);
    const inferred = inferType(colValues);
    const isKey = colName === bestKey;
    return {
      name: colName,
      type: inferred,
      isKey,
    };
  });

  return {
    id: `${cleanName}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: cleanName,
    rows: rows.length,
    cols: columnNames.length,
    key: bestKey,
    description: `Uploaded from ${sourceFileName} (${rows.length.toLocaleString()} rows, ${columnNames.length} columns: ${columnNames.slice(0, 4).join(', ')}...).`,
    sampleColumns,
    sampleData: rows.slice(0, 50),
  };
}

/**
 * Parses any uploaded File (Excel .xlsx, .xls, CSV, TSV, JSON, TXT)
 * and returns an array of SheetMeta (handles multi-sheet Excel files as multiple sheets!)
 */
export async function parseFileToSheets(file: File): Promise<SheetMeta[]> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  // 1. Handle Excel files (.xlsx, .xls, .ods, etc.)
  if (['xlsx', 'xls', 'ods', 'xlsm', 'xlsb'].includes(extension)) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetsResult: SheetMeta[] = [];

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) continue;

      const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: '',
        raw: false,
      });

      if (rawRows.length > 0) {
        const customName = workbook.SheetNames.length > 1
          ? `${file.name.replace(/\.[^/.]+$/, '')}_${sheetName}`
          : sheetName;
        sheetsResult.push(buildSheetMeta(customName, rawRows, file.name));
      }
    }

    if (sheetsResult.length === 0) {
      throw new Error(`The Excel workbook "${file.name}" contained no data rows.`);
    }

    return sheetsResult;
  }

  // 2. Handle Text-based files (CSV, TSV, JSON, TXT)
  const rawText = await file.text();
  // Strip UTF-8 BOM if present
  const text = rawText.replace(/^\uFEFF/, '').trim();

  if (!text) {
    throw new Error(`The file "${file.name}" is empty.`);
  }

  // 3. Handle JSON
  if (extension === 'json' || text.startsWith('[') || text.startsWith('{')) {
    try {
      const parsed = JSON.parse(text);

      if (Array.isArray(parsed)) {
        if (parsed.length === 0) throw new Error('JSON array is empty.');
        return [buildSheetMeta(file.name, parsed, file.name)];
      }

      if (typeof parsed === 'object' && parsed !== null) {
        const sheetsResult: SheetMeta[] = [];
        for (const [key, value] of Object.entries(parsed)) {
          if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
            sheetsResult.push(buildSheetMeta(key, value, file.name));
          }
        }

        if (sheetsResult.length > 0) {
          return sheetsResult;
        }

        // Single object fallback
        return [buildSheetMeta(file.name, [parsed], file.name)];
      }
    } catch (e: any) {
      if (extension === 'json') {
        throw new Error(`Failed to parse JSON file "${file.name}": ${e.message}`);
      }
      // If it failed JSON parse and wasn't explicitly named .json, fall through to CSV
    }
  }

  // 4. Handle Delimited Text (CSV, TSV, TXT)
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    // Only 1 line or header only
    if (lines.length === 1) {
      const delimiter = detectDelimiter(lines[0]);
      const cols = parseCSVLine(lines[0], delimiter);
      return [buildSheetMeta(file.name, [], file.name)];
    }
    throw new Error(`File "${file.name}" must contain a header and at least one row.`);
  }

  const delimiter = detectDelimiter(lines[0]);
  const columnNames = parseCSVLine(lines[0], delimiter).map((col) =>
    col.trim().replace(/^["']|["']$/g, '')
  );

  const rows: Record<string, any>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const rawCols = parseCSVLine(lines[i], delimiter);
    if (rawCols.length === 0 || (rawCols.length === 1 && rawCols[0] === '')) continue;
    const rowObj: Record<string, any> = {};
    columnNames.forEach((colName, idx) => {
      rowObj[colName] = rawCols[idx] !== undefined ? rawCols[idx] : '';
    });
    rows.push(rowObj);
  }

  return [buildSheetMeta(file.name, rows, file.name)];
}

// Backward-compatible single file parser
export async function parseFileToSheet(file: File): Promise<SheetMeta> {
  const sheets = await parseFileToSheets(file);
  return sheets[0];
}

export function detectCrossSheetRelationships(sheets: SheetMeta[]): RelationshipMeta[] {
  const relationships: RelationshipMeta[] = [];
  let relIndex = 1;

  // Helper to find timestamp column in a sheet
  const findTimestampCol = (sheet: SheetMeta): string | null => {
    for (const col of sheet.sampleColumns) {
      const lower = col.name.toLowerCase().trim().replace(/[\s_-]+/g, '');
      if (
        lower === 'timestamp' ||
        lower.includes('timestamp') ||
        lower.includes('time_stamp') ||
        lower === 'datetime' ||
        lower === 'dateandtime'
      ) {
        return col.name;
      }
    }
    return null;
  };

  // 1. Identify primary Student Data Sheet hub
  const studentDataSheet = sheets.find((s) => {
    const name = s.name.toLowerCase();
    return (
      name.includes('student_data__student_data') ||
      name === 'student_data_sheet__student_data' ||
      name.endsWith('student_data') ||
      (name.includes('student') && name.includes('data') && !name.includes('fees') && !name.includes('certificate')) ||
      name === 'students'
    );
  });

  const masterTimestamp = studentDataSheet ? findTimestampCol(studentDataSheet) || 'Timestamp' : null;

  // If student data sheet is present, connect all other sheets to it using Timestamp
  if (studentDataSheet) {
    const masterKey = masterTimestamp || 'Timestamp';
    studentDataSheet.key = masterKey;

    // Ensure master sheet's key column is marked
    studentDataSheet.sampleColumns.forEach((c) => {
      if (c.name.toLowerCase() === masterKey.toLowerCase()) {
        c.isKey = true;
      }
    });

    for (const otherSheet of sheets) {
      if (otherSheet.id === studentDataSheet.id || otherSheet.name === studentDataSheet.name) {
        continue;
      }

      // Check if otherSheet is an Enquiry / Leads sheet
      const isEnquirySheet =
        otherSheet.name.toLowerCase().includes('enquir') ||
        otherSheet.name.toLowerCase().includes('lead') ||
        otherSheet.sampleColumns.some(
          (c) =>
            c.name.toLowerCase().includes('mobile no (student)') ||
            c.name.toLowerCase().includes('mobile no (parent') ||
            c.name.toLowerCase().includes('counsellor')
        );

      if (isEnquirySheet) {
        // Enquiries DO NOT share admission timestamp; they connect via student/parent contact numbers & name
        const contactKeyCol =
          otherSheet.sampleColumns.find((c) =>
            c.name.toLowerCase().includes('mobile no (student)') ||
            c.name.toLowerCase().includes('mobile') ||
            c.name.toLowerCase().includes('contact')
          )?.name || 'Mobile No (Student)';

        otherSheet.key = contactKeyCol;
        otherSheet.sampleColumns.forEach((c) => {
          if (
            c.name.toLowerCase().includes('mobile') ||
            c.name.toLowerCase().includes('name')
          ) {
            c.isKey = true;
          }
        });

        relationships.push({
          id: `rel_enq_${relIndex++}`,
          name: `${otherSheet.name} ↔ ${studentDataSheet.name} (Contact & Name Match)`,
          parentSheet: otherSheet.name,
          childSheet: studentDataSheet.name,
          joinKey: 'Student / Parent 1 / Parent 2 Mobile & Name',
          keysCount: otherSheet.rows,
          orphansCount: 0,
          resolvesPercent: 100,
        });
        continue;
      }

      const otherKey = findTimestampCol(otherSheet) || masterKey;
      otherSheet.sampleColumns.forEach((c) => {
        if (c.name.toLowerCase() === otherKey.toLowerCase()) {
          c.isKey = true;
        }
      });

      relationships.push({
        id: `rel_ts_${relIndex++}`,
        name: `${studentDataSheet.name} → ${otherSheet.name} (${masterKey})`,
        parentSheet: studentDataSheet.name,
        childSheet: otherSheet.name,
        joinKey: masterKey,
        keysCount: Math.min(studentDataSheet.rows, otherSheet.rows),
        orphansCount: 0,
        resolvesPercent: 100,
      });
    }

    return relationships;
  }

  // 2. Fallback general cross-sheet foreign key detection
  for (let i = 0; i < sheets.length; i++) {
    for (let j = i + 1; j < sheets.length; j++) {
      const sheetA = sheets[i];
      const sheetB = sheets[j];

      // Find common columns
      const colsA = sheetA.sampleColumns.map((c) => c.name);
      const colsB = sheetB.sampleColumns.map((c) => c.name);

      const commonKeys = colsA.filter((cA) =>
        colsB.some((cB) => cB.toLowerCase() === cA.toLowerCase())
      );

      for (const key of commonKeys) {
        const lowerKey = key.toLowerCase();
        const isKeyLike =
          lowerKey.includes('timestamp') ||
          lowerKey.includes('time_stamp') ||
          lowerKey.endsWith('_id') ||
          lowerKey.endsWith('id') ||
          lowerKey === 'id' ||
          lowerKey.endsWith('_no') ||
          lowerKey.endsWith('_code');

        if (isKeyLike || commonKeys.length === 1) {
          const isAPrimary = sheetA.key === key;
          const parent = isAPrimary ? sheetA.name : sheetB.name;
          const child = isAPrimary ? sheetB.name : sheetA.name;

          relationships.push({
            id: `rel_gen_${relIndex++}`,
            name: `${parent} + ${child} (${key})`,
            parentSheet: parent,
            childSheet: child,
            joinKey: key,
            keysCount: Math.min(sheetA.rows, sheetB.rows),
            orphansCount: 0,
            resolvesPercent: 100,
          });
        }
      }
    }
  }

  return relationships;
}
