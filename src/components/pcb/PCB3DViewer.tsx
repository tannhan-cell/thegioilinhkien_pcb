import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PCB_CONFIG_DATA } from '../../lib/pricing';
import { GerberAnalysisResult } from '../../lib/types';
import { renderGerberStackup } from '../../lib/gerberParser';
import { 
  RotateCw, 
  Box, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode,
  Maximize2,
  Minimize2,
  RefreshCcw,
  Ruler,
  Sparkles
} from 'lucide-react';

interface PCB3DViewerProps {
  maskColor: string;
  surfaceFinish: string;
  thickness: string;
  widthMm: number;
  heightMm: number;
  topSvg?: string | null;
  bottomSvg?: string | null;
  gerberAnalysis?: GerberAnalysisResult | null;
  rawGerberFile?: File | null;
  tabName?: string;
  onDimensionsExtracted?: (w: number, h: number) => void;
  onAnalysisComplete?: (analysis: GerberAnalysisResult & { topSvg?: string; bottomSvg?: string }) => void;
}

export const PCB3DViewer: React.FC<PCB3DViewerProps> = ({
  maskColor,
  surfaceFinish,
  thickness,
  widthMm,
  heightMm,
  topSvg,
  bottomSvg,
  gerberAnalysis,
  rawGerberFile,
  tabName,
  onDimensionsExtracted,
  onAnalysisComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  const pcbGroupRef = useRef<THREE.Group | null>(null);
  
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // SVG textures state
  const [topTexture, setTopTexture] = useState<THREE.Texture | null>(null);
  const [bottomTexture, setBottomTexture] = useState<THREE.Texture | null>(null);

  // Dynamic solder mask & plating color replacer for pcb-stackup SVG
  const applySvgTheme = (svgStr: string, currentMaskColor: string, currentFinish: string): string => {
    const maskInfo = PCB_CONFIG_DATA.MASK_COLORS[currentMaskColor as keyof typeof PCB_CONFIG_DATA.MASK_COLORS] || PCB_CONFIG_DATA.MASK_COLORS['Xanh lá'];
    const finishInfo = PCB_CONFIG_DATA.FINISH_MATERIALS[currentFinish as keyof typeof PCB_CONFIG_DATA.FINISH_MATERIALS] || PCB_CONFIG_DATA.FINISH_MATERIALS['Mạ Vàng'];

    // Solder mask color rule in pcb-stackup: .prefix_sm {color: #...;}
    let modified = svgStr.replace(/(\.[a-zA-Z0-9_-]+_sm\s*\{\s*color:\s*)[^;}\s]+/gi, `$1${maskInfo.hex}`);
    // Plating finish color rule in pcb-stackup: .prefix_cf {color: #...;}
    modified = modified.replace(/(\.[a-zA-Z0-9_-]+_cf\s*\{\s*color:\s*)[^;}\s]+/gi, `$1${finishInfo.hex}`);
    return modified;
  };

  // Convert SVG string to Three.js Texture with current color theme
  const svgToTexture = (svgStr: string, wMm: number, hMm: number, currentMask: string, currentFinish: string): Promise<THREE.Texture> => {
    return new Promise((resolve) => {
      const themedSvg = applySvgTheme(svgStr, currentMask, currentFinish);
      const maskInfo = PCB_CONFIG_DATA.MASK_COLORS[currentMask as keyof typeof PCB_CONFIG_DATA.MASK_COLORS] || PCB_CONFIG_DATA.MASK_COLORS['Xanh lá'];

      const maxSide = 2048;
      const scale = maxSide / Math.max(wMm, hMm, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(2, Math.round(wMm * scale));
      canvas.height = Math.max(2, Math.round(hMm * scale));

      const blob = new Blob([themedSvg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = maskInfo.hex;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        URL.revokeObjectURL(url);
        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 4;
        texture.needsUpdate = true;
        resolve(texture);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(createProceduralTexture(false));
      };

      img.src = url;
    });
  };

  // Convert incoming SVGs into textures and re-render when maskColor or surfaceFinish changes
  useEffect(() => {
    let cancelled = false;

    if (topSvg && bottomSvg) {
      Promise.all([
        svgToTexture(topSvg, widthMm, heightMm, maskColor, surfaceFinish),
        svgToTexture(bottomSvg, widthMm, heightMm, maskColor, surfaceFinish),
      ]).then(([tTex, bTex]) => {
        if (!cancelled) {
          setTopTexture(tTex);
          setBottomTexture(bTex);
        }
      });
    } else {
      setTopTexture(null);
      setBottomTexture(null);
    }

    return () => {
      cancelled = true;
    };
  }, [topSvg, bottomSvg, widthMm, heightMm, maskColor, surfaceFinish]);

  // Create procedural fallback texture if no Gerber SVG exists yet
  const createProceduralTexture = (isBottom = false): THREE.Texture => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    const maskInfo = PCB_CONFIG_DATA.MASK_COLORS[maskColor as keyof typeof PCB_CONFIG_DATA.MASK_COLORS] || PCB_CONFIG_DATA.MASK_COLORS['Xanh lá'];
    ctx.fillStyle = maskInfo.hex;
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle Grid hatch
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    for (let i = 40; i < 980; i += 60) {
      ctx.beginPath();
      ctx.moveTo(40, i);
      ctx.lineTo(980, i);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(i, 40);
      ctx.lineTo(i, 980);
      ctx.stroke();
    }

    // Bus lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(80, 180);
    ctx.lineTo(320, 180);
    ctx.lineTo(400, 260);
    ctx.lineTo(750, 260);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(120, 820);
    ctx.lineTo(340, 820);
    ctx.lineTo(420, 740);
    ctx.lineTo(820, 740);
    ctx.stroke();

    // Pads
    const finish = PCB_CONFIG_DATA.FINISH_MATERIALS[surfaceFinish as keyof typeof PCB_CONFIG_DATA.FINISH_MATERIALS] || PCB_CONFIG_DATA.FINISH_MATERIALS['Mạ Vàng'];
    ctx.fillStyle = finish.hex;

    // Center IC footprint
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(380, 380, 260, 260);

    for (let pin = 0; pin < 24; pin++) {
      const step = 400 + pin * 10;
      ctx.fillRect(step, 340, 6, 26);
      ctx.fillRect(step, 650, 6, 26);
      ctx.fillRect(340, step, 26, 6);
      ctx.fillRect(650, step, 26, 6);
    }

    // Passives 0805
    for (let r = 0; r < 12; r++) {
      for (let c = 0; c < 12; c++) {
        if (r >= 3 && r <= 8 && c >= 3 && c <= 8) continue;
        const x = 90 + c * 75;
        const y = 90 + r * 75;
        ctx.fillRect(x, y, 12, 8);
        ctx.fillRect(x + 18, y, 12, 8);
      }
    }

    // Silkscreen
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(isBottom ? 'BOTTOM LAYER • THE GIOI LINH KIEN & PCB' : 'TOP LAYER • THE GIOI LINH KIEN & PCB', 80, 80);
    ctx.font = '16px monospace';
    ctx.fillText(`SIZE: ${widthMm} x ${heightMm} mm • REV 2.0 • RoHS`, 80, 955);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  };

  // Build the 3D PCB Mesh as a single unified solid board
  const buildPCB = () => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    if (pcbGroupRef.current) {
      scene.remove(pcbGroupRef.current);
      pcbGroupRef.current = null;
    }

    const pcbGroup = new THREE.Group();
    pcbGroupRef.current = pcbGroup;

    const maskInfo = PCB_CONFIG_DATA.MASK_COLORS[maskColor as keyof typeof PCB_CONFIG_DATA.MASK_COLORS] || PCB_CONFIG_DATA.MASK_COLORS['Xanh lá'];
    const finish = PCB_CONFIG_DATA.FINISH_MATERIALS[surfaceFinish as keyof typeof PCB_CONFIG_DATA.FINISH_MATERIALS] || PCB_CONFIG_DATA.FINISH_MATERIALS['Mạ Vàng'];
    const thickVal = parseFloat(thickness) || 1.6;

    // Normalizing 3D scale: 100mm = 40 units
    const sx = Math.max(8, (widthMm / 100) * 40);
    const sy = Math.max(8, (heightMm / 100) * 40);
    const sz = Math.max(0.4, (thickVal / 1.6) * 0.9);

    // 1. FR-4 Core Substrate
    const coreGeo = new THREE.BoxGeometry(sx, sy, sz);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x2d3a24,
      roughness: 0.85,
      metalness: 0.05,
      wireframe: isWireframe,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    pcbGroup.add(coreMesh);

    // 2. Top Solder Mask / Real Gerber Texture
    const topTex = topTexture || createProceduralTexture(false);
    const topGeo = new THREE.PlaneGeometry(sx, sy);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: topTex,
      roughness: maskInfo.roughness,
      metalness: maskInfo.metalness,
      wireframe: isWireframe,
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.z = sz / 2 + 0.01;
    topMesh.receiveShadow = true;
    pcbGroup.add(topMesh);

    // 3. Bottom Solder Mask / Real Gerber Texture
    const botTex = bottomTexture || createProceduralTexture(true);
    const botGeo = new THREE.PlaneGeometry(sx, sy);
    const botMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: botTex,
      roughness: maskInfo.roughness,
      metalness: maskInfo.metalness,
      wireframe: isWireframe,
    });
    const botMesh = new THREE.Mesh(botGeo, botMat);
    botMesh.position.z = -sz / 2 - 0.01;
    botMesh.rotation.y = Math.PI;
    botMesh.receiveShadow = true;
    pcbGroup.add(botMesh);

    // Only add sample components and mount holes if NOT showing real Gerber
    if (!topTexture) {
      // SMD Center Chip
      const icGeo = new THREE.BoxGeometry(sx * 0.22, sy * 0.22, 0.45);
      const icMat = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.4,
        metalness: 0.2,
        wireframe: isWireframe,
      });
      const icMesh = new THREE.Mesh(icGeo, icMat);
      icMesh.position.z = sz / 2 + 0.25;
      icMesh.castShadow = true;
      pcbGroup.add(icMesh);

      // Plated Holes
      const holeRadius = Math.min(sx, sy) * 0.04;
      const holeOffsets = [
        [-sx / 2 + holeRadius * 2, -sy / 2 + holeRadius * 2],
        [sx / 2 - holeRadius * 2, -sy / 2 + holeRadius * 2],
        [-sx / 2 + holeRadius * 2, sy / 2 - holeRadius * 2],
        [sx / 2 - holeRadius * 2, sy / 2 - holeRadius * 2],
      ];

      const padMat = new THREE.MeshStandardMaterial({
        color: finish.hex,
        roughness: finish.roughness,
        metalness: finish.metalness,
      });

      holeOffsets.forEach(([hx, hy]) => {
        const ringGeo = new THREE.RingGeometry(holeRadius * 0.5, holeRadius * 1.25, 24);
        const ringTop = new THREE.Mesh(ringGeo, padMat);
        ringTop.position.set(hx, hy, sz / 2 + 0.02);
        pcbGroup.add(ringTop);

        const ringBot = new THREE.Mesh(ringGeo, padMat);
        ringBot.position.set(hx, hy, -sz / 2 - 0.02);
        ringBot.rotation.y = Math.PI;
        pcbGroup.add(ringBot);
      });
    }

    scene.add(pcbGroup);
  };

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, -55, 55);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI - 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 180;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(45, 65, 80);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const cyanRim = new THREE.DirectionalLight(0x0284c7, 0.7);
    cyanRim.position.set(-60, -40, 35);
    scene.add(cyanRim);

    const bottomFill = new THREE.DirectionalLight(0xffffff, 0.75);
    bottomFill.position.set(0, 0, -60);
    scene.add(bottomFill);

    buildPCB();

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (pcbGroupRef.current && isAutoRotating) {
        pcbGroupRef.current.rotation.z += 0.004;
      }
      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 20 && h > 20 && rendererRef.current && cameraRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Rebuild mesh when specs, textures or tab changes
  useEffect(() => {
    buildPCB();
  }, [maskColor, surfaceFinish, thickness, widthMm, heightMm, isWireframe, topTexture, bottomTexture]);

  // View angle controls
  const setCameraView = (view: 'top' | 'bottom' | 'iso') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    setIsAutoRotating(false);

    if (view === 'top') {
      cam.position.set(0, 0, 70);
      cam.up.set(0, 1, 0);
    } else if (view === 'bottom') {
      cam.position.set(0, 0, -70);
      cam.up.set(0, 1, 0);
    } else {
      cam.position.set(0, -55, 55);
      cam.up.set(0, 0, 1);
    }
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  // Handle direct file upload from 3D Viewer overlay (also syncs with active spec!)
  const handleGerberFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      alert('Vui lòng chọn file nén .ZIP chứa các lớp Gerber.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const maskInfo = PCB_CONFIG_DATA.MASK_COLORS[maskColor as keyof typeof PCB_CONFIG_DATA.MASK_COLORS] || PCB_CONFIG_DATA.MASK_COLORS['Xanh lá'];
      const finishInfo = PCB_CONFIG_DATA.FINISH_MATERIALS[surfaceFinish as keyof typeof PCB_CONFIG_DATA.FINISH_MATERIALS] || PCB_CONFIG_DATA.FINISH_MATERIALS['Mạ Vàng'];
      
      const result = await renderGerberStackup(file, maskInfo.hex, finishInfo.hex);

      if (result.success && result.boardWidthMm && result.boardHeightMm) {
        if (onDimensionsExtracted) {
          onDimensionsExtracted(result.boardWidthMm, result.boardHeightMm);
        }
      }

      if (onAnalysisComplete) {
        onAnalysisComplete({
          ...result,
          rawGerberFile: file,
        });
      }
    } catch (e: any) {
      alert('Lỗi phân tích Gerber: ' + e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={`relative flex flex-col w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[440px] sm:h-[480px]'
    }`}>
      {/* 1. TOP OVERLAY CONTROLS */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left View Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/95 backdrop-blur border border-slate-700/80 rounded-lg shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setCameraView('top')}
            className="px-2.5 py-1 text-xs font-mono font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
            title="Mặt Trên (Top)"
          >
            TOP
          </button>
          <button
            type="button"
            onClick={() => setCameraView('bottom')}
            className="px-2.5 py-1 text-xs font-mono font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
            title="Mặt Dưới (Bottom)"
          >
            BOT
          </button>
          <button
            type="button"
            onClick={() => setCameraView('iso')}
            className="px-2.5 py-1 text-xs font-mono font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
            title="Góc Nhìn Nghiêng 3D"
          >
            ISO
          </button>
          <span className="w-px h-4 bg-slate-700 mx-0.5" />
          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1.5 rounded text-xs transition ${
              isAutoRotating ? 'text-sky-400 bg-sky-950/70' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tự động xoay 360°"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsWireframe(!isWireframe)}
            className={`p-1.5 rounded text-xs transition ${
              isWireframe ? 'text-amber-400 bg-amber-950/70' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Chế độ khung dây Wireframe"
          >
            <Box className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setCameraView('iso');
              setIsAutoRotating(true);
            }}
            className="p-1.5 rounded text-xs text-slate-400 hover:text-slate-200 transition"
            title="Đặt lại góc nhìn mặc định"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Info Badges & Fullscreen */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {tabName && (
            <span className="px-2.5 py-1 rounded-lg bg-sky-950 border border-sky-500/50 text-sky-300 font-mono text-xs font-bold shadow-lg">
              {tabName}
            </span>
          )}

          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/95 backdrop-blur border border-sky-500/40 rounded-lg font-mono text-xs text-slate-200 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="font-bold text-sky-300">{widthMm} x {heightMm} mm</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">{thickness}</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-semibold">{maskColor}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 bg-slate-900/95 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg shadow-lg transition"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. MAIN THREE.JS CANVAS CONTAINER */}
      <div 
        ref={containerRef} 
        className="w-full flex-1 cursor-grab active:cursor-grabbing bg-radial from-slate-900 via-slate-950 to-slate-950" 
        style={{ minHeight: '340px' }}
      />

      {/* 3. BOTTOM CONTROLS & GERBER DROP BUTTON */}
      <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2.5 text-slate-300">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="text-sky-300 font-semibold">Mô hình 3D WebGL:</span>
          <span className="text-slate-400">Tự động đồng bộ màu sơn {maskColor} & kiểu mạ {surfaceFinish}</span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {topTexture ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/70 border border-emerald-500/50 rounded-lg text-emerald-300 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Đang hiển thị Gerber thực tế 3D</span>
            </span>
          ) : (
            <label className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-950/70 hover:bg-sky-900/80 text-sky-300 border border-sky-500/50 rounded-lg cursor-pointer transition shadow">
              <FileCode className="w-4 h-4 text-sky-400" />
              <span className="font-semibold">{isAnalyzing ? 'Đang dựng hình 3D...' : 'Xem 3D Gerber .ZIP'}</span>
              <input
                type="file"
                accept=".zip,.rar"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleGerberFileUpload(file);
                }}
              />
            </label>
          )}
        </div>
      </div>

      {/* 4. GERBER AUTO-MEASURE & ANALYSIS RESULT BANNER (KHÔNG DỰ ĐOÁN SỐ LỚP) */}
      {gerberAnalysis && (
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 text-xs shrink-0">
          {gerberAnalysis.success ? (
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ĐÃ XEM 3D GERBER: {gerberAnalysis.fileName}</span>
                </div>
                
                {gerberAnalysis.boardWidthMm && gerberAnalysis.boardHeightMm && (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-sky-950 text-sky-300 border border-sky-500/40 rounded text-[11px] font-mono font-bold">
                    <Ruler className="w-3.5 h-3.5 text-sky-400" />
                    <span>Auto Kích thước: {gerberAnalysis.boardWidthMm} x {gerberAnalysis.boardHeightMm} mm</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{gerberAnalysis.message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
