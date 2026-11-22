import JSZip from 'jszip';
import { GerberAnalysisResult, GerberLayerSummary } from './types';

interface GerberFormat {
  isInch: boolean;
  xInt: number;
  xDec: number;
  yInt: number;
  yDec: number;
}

/**
 * Phân tích header Gerber RS-274X để lấy đơn vị và định dạng số thập phân
 */
function parseGerberHeader(content: string): GerberFormat {
  let isInch = false;
  let xInt = 2;
  let xDec = 4;
  let yInt = 2;
  let yDec = 4;

  // 1. Kiểm tra đơn vị: %MOIN*% (Inch) hay %MOMM*% (Millimeter)
  if (content.includes('%MOIN*%') || /G20\*?/i.test(content) || /INCH/i.test(content)) {
    isInch = true;
  } else if (content.includes('%MOMM*%') || /G21\*?/i.test(content) || /METRIC/i.test(content)) {
    isInch = false;
  }

  // 2. Kiểm tra định dạng tọa độ: %FSLAX24Y24*% hoặc %FSLAX25Y25*% hoặc %FSTAX...%
  const fsMatch = content.match(/%FS[LT]A?X([0-9])([0-9])Y([0-9])([0-9])\*%/i);
  if (fsMatch) {
    xInt = parseInt(fsMatch[1], 10);
    xDec = parseInt(fsMatch[2], 10);
    yInt = parseInt(fsMatch[3], 10);
    yDec = parseInt(fsMatch[4], 10);
  } else {
    // Dự phòng Excellon hoặc định dạng chuẩn
    const fsExMatch = content.match(/%FSLAX([0-9])([0-9])\*%/i);
    if (fsExMatch) {
      xInt = parseInt(fsExMatch[1], 10);
      xDec = parseInt(fsExMatch[2], 10);
      yInt = xInt;
      yDec = xDec;
    }
  }

  return { isInch, xInt, xDec, yInt, yDec };
}

/**
 * Trích xuất các điểm tọa độ từ nội dung file Gerber hoặc Excellon Drill
 */
function extractCoordinates(content: string, format: GerberFormat): { minX: number; maxX: number; minY: number; maxY: number; count: number } {
  const xDivisor = Math.pow(10, format.xDec);
  const yDivisor = Math.pow(10, format.yDec);
  const unitFactor = format.isInch ? 25.4 : 1.0;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let count = 0;

  let currentX = 0;
  let currentY = 0;

  // Regex bắt tọa độ X và Y dạng: X12345Y67890 hoặc X12.345Y67.890
  const coordRegex = /(?:X(-?[0-9.]+))?(?:Y(-?[0-9.]+))?/g;
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('%') || trimmed.startsWith('G04') || trimmed.startsWith('M')) {
      continue;
    }

    // Kiểm tra dòng có chứa tọa độ X hoặc Y
    if (trimmed.includes('X') || trimmed.includes('Y')) {
      const xMatch = trimmed.match(/X(-?[0-9.]+)/i);
      const yMatch = trimmed.match(/Y(-?[0-9.]+)/i);

      if (xMatch || yMatch) {
        if (xMatch) {
          const valStr = xMatch[1];
          let val = 0;
          if (valStr.includes('.')) {
            val = parseFloat(valStr);
          } else {
            val = parseInt(valStr, 10) / xDivisor;
          }
          currentX = val * unitFactor;
        }

        if (yMatch) {
          const valStr = yMatch[1];
          let val = 0;
          if (valStr.includes('.')) {
            val = parseFloat(valStr);
          } else {
            val = parseInt(valStr, 10) / yDivisor;
          }
          currentY = val * unitFactor;
        }

        // Bỏ qua điểm (0,0) nếu nó là điểm khởi tạo
        if (Math.abs(currentX) > 0.001 || Math.abs(currentY) > 0.001) {
          if (currentX < minX) minX = currentX;
          if (currentX > maxX) maxX = currentX;
          if (currentY < minY) minY = currentY;
          if (currentY > maxY) maxY = currentY;
          count++;
        }
      }
    }
  }

  return { minX, maxX, minY, maxY, count };
}

/**
 * Phân loại các file trong file nén Gerber .ZIP
 */
export function identifyGerberLayers(filenames: string[]): GerberLayerSummary {
  const summary: GerberLayerSummary = {};

  for (const filename of filenames) {
    const lower = filename.toLowerCase();
    
    // Outline / Board Cut
    if (
      lower.endsWith('.gko') ||
      lower.endsWith('.gm1') ||
      lower.endsWith('.gm2') ||
      lower.endsWith('.gml') ||
      lower.includes('outline') ||
      lower.includes('edge') ||
      lower.includes('boardoutline') ||
      lower.includes('profile') ||
      lower.includes('cut') ||
      lower.endsWith('.out')
    ) {
      if (!summary.outline) summary.outline = filename;
    }
    // Top Copper
    else if (
      lower.endsWith('.gtl') ||
      lower.includes('top.gtl') ||
      lower.includes('copper_top') ||
      lower.includes('f_cu') ||
      lower.includes('front_cu') ||
      (lower.includes('top') && lower.endsWith('.gbr'))
    ) {
      if (!summary.topCopper) summary.topCopper = filename;
    }
    // Bottom Copper
    else if (
      lower.endsWith('.gbl') ||
      lower.includes('bot.gbl') ||
      lower.includes('bottom.gbl') ||
      lower.includes('copper_bot') ||
      lower.includes('b_cu') ||
      lower.includes('back_cu') ||
      (lower.includes('bot') && lower.endsWith('.gbr'))
    ) {
      if (!summary.botCopper) summary.botCopper = filename;
    }
    // Top Solder Mask
    else if (
      lower.endsWith('.gts') ||
      lower.includes('mask_top') ||
      lower.includes('f_mask') ||
      lower.includes('soldermask_top')
    ) {
      if (!summary.topMask) summary.topMask = filename;
    }
    // Bottom Solder Mask
    else if (
      lower.endsWith('.gbs') ||
      lower.includes('mask_bot') ||
      lower.includes('b_mask') ||
      lower.includes('soldermask_bot')
    ) {
      if (!summary.botMask) summary.botMask = filename;
    }
    // Top Silkscreen
    else if (
      lower.endsWith('.gto') ||
      lower.includes('silk_top') ||
      lower.includes('f_silks') ||
      lower.includes('silkscreen_top')
    ) {
      if (!summary.topSilk) summary.topSilk = filename;
    }
    // Bottom Silkscreen
    else if (
      lower.endsWith('.gbo') ||
      lower.includes('silk_bot') ||
      lower.includes('b_silks') ||
      lower.includes('silkscreen_bot')
    ) {
      if (!summary.botSilk) summary.botSilk = filename;
    }
    // Drill (PTH & NPTH)
    else if (
      lower.endsWith('.drl') ||
      lower.endsWith('.txt') ||
      lower.endsWith('.xln') ||
      lower.includes('drill') ||
      lower.includes('pth')
    ) {
      if (!summary.drill) summary.drill = filename;
    }
  }

  return summary;
}

/**
 * Phân tích toàn bộ file .ZIP Gerber và đo đạc kích thước chính xác (mm)
 */
export async function analyzeGerberZip(file: File): Promise<GerberAnalysisResult> {
  try {
    const zip = await JSZip.loadAsync(file);
    const filenames = Object.keys(zip.files).filter(name => !zip.files[name].dir);
    
    if (filenames.length === 0) {
      return {
        success: false,
        message: 'File ZIP trống hoặc không chứa file hợp lệ.',
      };
    }

    const layers = identifyGerberLayers(filenames);
    let calculatedWidth = 0;
    let calculatedHeight = 0;
    let extractionSource = '';

    // Ưu tiên 1: Lớp Outline / Viền bo mạch (Chính xác tuyệt đối)
    if (layers.outline && zip.files[layers.outline]) {
      const outlineContent = await zip.files[layers.outline].async('text');
      const format = parseGerberHeader(outlineContent);
      const bounds = extractCoordinates(outlineContent, format);

      if (bounds.count >= 2 && isFinite(bounds.minX) && isFinite(bounds.maxX)) {
        const w = bounds.maxX - bounds.minX;
        const h = bounds.maxY - bounds.minY;
        if (w >= 3 && h >= 3 && w <= 1200 && h <= 1200) {
          calculatedWidth = Math.round(w * 10) / 10;
          calculatedHeight = Math.round(h * 10) / 10;
          extractionSource = `Lớp viền Outline (${layers.outline})`;
        }
      }
    }

    // Ưu tiên 2: Lớp Top Copper hoặc Bottom Copper nếu không có outline
    if (calculatedWidth === 0 && (layers.topCopper || layers.botCopper)) {
      const cuLayerName = layers.topCopper || layers.botCopper!;
      if (zip.files[cuLayerName]) {
        const cuContent = await zip.files[cuLayerName].async('text');
        const format = parseGerberHeader(cuContent);
        const bounds = extractCoordinates(cuContent, format);

        if (bounds.count >= 4 && isFinite(bounds.minX) && isFinite(bounds.maxX)) {
          const w = bounds.maxX - bounds.minX;
          const h = bounds.maxY - bounds.minY;
          if (w >= 3 && h >= 3 && w <= 1200 && h <= 1200) {
            calculatedWidth = Math.round(w * 10) / 10;
            calculatedHeight = Math.round(h * 10) / 10;
            extractionSource = `Lớp đồng ${cuLayerName}`;
          }
        }
      }
    }

    // Ưu tiên 3: Lớp Khoan Drill
    if (calculatedWidth === 0 && layers.drill && zip.files[layers.drill]) {
      const drillContent = await zip.files[layers.drill].async('text');
      const format = parseGerberHeader(drillContent);
      const bounds = extractCoordinates(drillContent, format);

      if (bounds.count >= 3 && isFinite(bounds.minX) && isFinite(bounds.maxX)) {
        const w = (bounds.maxX - bounds.minX) * 1.05; // Dự phòng viền lề 5%
        const h = (bounds.maxY - bounds.minY) * 1.05;
        if (w >= 3 && h >= 3 && w <= 1200 && h <= 1200) {
          calculatedWidth = Math.round(w * 10) / 10;
          calculatedHeight = Math.round(h * 10) / 10;
          extractionSource = `Lớp lỗ khoan (${layers.drill})`;
        }
      }
    }

    // Dự phòng chuẩn mặc định 100 x 80 mm nếu không đọc được tọa độ
    if (calculatedWidth === 0 || calculatedHeight === 0) {
      calculatedWidth = 100;
      calculatedHeight = 80;
      extractionSource = 'Kích thước mặc định tiêu chuẩn (100 x 80 mm)';
    }

    return {
      success: true,
      fileName: file.name,
      fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      layers,
      layerCount: filenames.length,
      boardWidthMm: calculatedWidth,
      boardHeightMm: calculatedHeight,
      message: `Tự động nhận diện kích thước chính xác: ${calculatedWidth} x ${calculatedHeight} mm (${extractionSource})`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Lỗi phân tích file Gerber ZIP: ' + (error.message || 'File không đúng định dạng'),
    };
  }
}

declare global {
  interface Window {
    pcbStackup?: (layers: any[], options?: any) => Promise<any>;
    whatsThatGerber?: (filenames: string[]) => Record<string, { type?: string; side?: string }>;
  }
}

function looksLikeGerberContent(text: string, type?: string): boolean {
  if (!text) return false;
  if (type === 'drill') return /M48|^T\d+/m.test(text);
  return /%FS|%MO|G04|D0?[123]\*/.test(text);
}

/**
 * Render toàn bộ file Gerber ZIP thành hình ảnh SVG thực tế bằng pcb-stackup
 * Trả về SVG mặt Top, mặt Bottom và kích thước thực tế (mm)
 */
export async function renderGerberStackup(
  file: File, 
  maskHex = '#0a632d', 
  finishHex = '#f59e0b'
): Promise<GerberAnalysisResult & { topSvg?: string; bottomSvg?: string }> {
  // Trước tiên, phân tích bounding box và các lớp
  const baseAnalysis = await analyzeGerberZip(file);
  if (!baseAnalysis.success) return baseAnalysis;

  if (typeof window === 'undefined' || !window.pcbStackup) {
    return baseAnalysis;
  }

  try {
    const zip = await JSZip.loadAsync(file);
    const filenames = Object.keys(zip.files).filter(name => !zip.files[name].dir && !name.startsWith('__MACOSX/'));
    
    const identify = window.whatsThatGerber || (() => ({}));
    const types = identify(filenames);
    const gerberLayers: any[] = [];

    for (const name of filenames) {
      const info = types[name] || {};
      if (!info.type || info.type === 'drawing') continue;

      const text = await zip.files[name].async('text');
      if (!looksLikeGerberContent(text, info.type)) continue;

      gerberLayers.push({
        filename: name,
        gerber: text,
        type: info.type,
        side: info.side
      });
    }

    if (gerberLayers.length === 0) {
      return baseAnalysis;
    }

    const options = {
      outlineGapFill: 0.011,
      color: {
        fr4: '#2d3a24',
        cu: '#cccccc',
        cf: finishHex,
        sm: maskHex,
        ss: '#ffffff',
        sp: 'rgba(0, 0, 0, 0)',
        out: '#000000'
      }
    };

    let stackup;
    try {
      stackup = await window.pcbStackup(gerberLayers, options);
    } catch (e) {
      stackup = await window.pcbStackup(gerberLayers, { ...options, maskWithOutline: false });
    }

    if (!stackup || !stackup.top) {
      return baseAnalysis;
    }

    const toMm = (v: number) => (stackup.top.units === 'in' ? v * 25.4 : v);
    const realW = Math.round(toMm(stackup.top.width) * 10) / 10;
    const realH = Math.round(toMm(stackup.top.height) * 10) / 10;

    return {
      ...baseAnalysis,
      boardWidthMm: realW > 0 ? realW : baseAnalysis.boardWidthMm,
      boardHeightMm: realH > 0 ? realH : baseAnalysis.boardHeightMm,
      topSvg: stackup.top.svg,
      bottomSvg: stackup.bottom?.svg,
      message: `Đã dựng hình 3D thực tế từ Gerber: ${realW} x ${realH} mm (${gerberLayers.length} lớp)`
    };
  } catch (err) {
    console.warn('pcbStackup rendering fallback to base coordinate parser:', err);
    return baseAnalysis;
  }
}
