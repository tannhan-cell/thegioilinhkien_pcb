import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PCB_CONFIG_DATA } from '../../lib/pricing';
import { GerberAnalysisResult } from '../../lib/types';
import { analyzeGerberZip } from '../../lib/gerberParser';
import { 
  RotateCw, 
  Layers, 
  Box, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode,
  Maximize2,
  Minimize2,
  RefreshCcw,
  Sparkles,
  Ruler
} from 'lucide-react';

interface PCB3DViewerProps {
  maskColor: string;
  surfaceFinish: string;
  thickness: string;
  widthMm: number;
  heightMm: number;
  gerberAnalysis?: GerberAnalysisResult | null;
  onDimensionsExtracted?: (w: number, h: number) => void;
  onAnalysisComplete?: (analysis: GerberAnalysisResult) => void;
}

export const PCB3DViewer: React.FC<PCB3DViewerProps> = ({
  maskColor,
  surfaceFinish,
  thickness,
  widthMm,
  heightMm,
  gerberAnalysis,
  onDimensionsExtracted,
  onAnalysisComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  const pcbGroupRef = useRef<THREE.Group | null>(null);
  const tracesGroupRef = useRef<THREE.Group | null>(null);
  
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localAnalysis, setLocalAnalysis] = useState<GerberAnalysisResult | null>(gerberAnalysis || null);

  // Sync external analysis if passed
  useEffect(() => {
    if (gerberAnalysis) setLocalAnalysis(gerberAnalysis);
  }, [gerberAnalysis]);

  // Create high-res canvas texture for PCB traces & pads
  const createPCBTexture = (isBottom = false) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    // Background mask color
    const maskInfo = PCB_CONFIG_DATA.MASK_COLORS[maskColor as keyof typeof PCB_CONFIG_DATA.MASK_COLORS] || PCB_CONFIG_DATA.MASK_COLORS['Xanh lá'];
    ctx.fillStyle = maskInfo.hex;
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle copper ground plane weave
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
    ctx.lineWidth = 3;

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

    // Bus lines and trace routing
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.lineTo(300, 200);
    ctx.lineTo(360, 260);
    ctx.lineTo(680, 260);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(120, 800);
    ctx.lineTo(320, 800);
    ctx.lineTo(380, 740);
    ctx.lineTo(750, 740);
    ctx.stroke();

    // Gold / Tin plated pads
    const finish = PCB_CONFIG_DATA.FINISH_MATERIALS[surfaceFinish as keyof typeof PCB_CONFIG_DATA.FINISH_MATERIALS] || PCB_CONFIG_DATA.FINISH_MATERIALS['Mạ Vàng'];
    ctx.fillStyle = finish.hex;

    // Center QFP / MCU IC footprint
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(392, 392, 240, 240);

    for (let pin = 0; pin < 24; pin++) {
      const step = 410 + pin * 9.5;
      ctx.fillRect(step, 355, 6, 26); // Top pins
      ctx.fillRect(step, 642, 6, 26); // Bottom pins
      ctx.fillRect(355, step, 26, 6); // Left pins
      ctx.fillRect(642, step, 26, 6); // Right pins
    }

    // SMD chip footprints (0805 / 0603 passive components)
    for (let r = 0; r < 12; r++) {
      for (let c = 0; c < 12; c++) {
        if (r >= 3 && r <= 8 && c >= 3 && c <= 8) continue; // Skip center MCU area
        const x = 90 + c * 75;
        const y = 90 + r * 75;
        ctx.fillRect(x, y, 12, 8);
        ctx.fillRect(x + 18, y, 12, 8);

        // Micro via drill hole in pad center
        ctx.fillStyle = '#111827';
        ctx.beginPath();
        ctx.arc(x + 6, y + 4, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 24, y + 4, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = finish.hex;
      }
    }

    // White silkscreen labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Consolas", "Courier New", monospace';
    ctx.fillText(isBottom ? 'BOTTOM LAYER • THE GIOI LINH KIEN & PCB' : 'TOP LAYER • THE GIOI LINH KIEN & PCB', 80, 80);
    ctx.font = '16px "Consolas", monospace';
    ctx.fillText(`SIZE: ${widthMm} x ${heightMm} mm • THICKNESS: ${thickness} • RoHS`, 80, 955);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  };

  // Rebuild 3D PCB board geometry
  const buildPCB = () => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Clean old board
    if (pcbGroupRef.current) {
      scene.remove(pcbGroupRef.current);
      pcbGroupRef.current = null;
    }

    const pcbGroup = new THREE.Group();
    pcbGroupRef.current = pcbGroup;

    const tracesGroup = new THREE.Group();
    tracesGroupRef.current = tracesGroup;
    pcbGroup.add(tracesGroup);

    const maskInfo = PCB_CONFIG_DATA.MASK_COLORS[maskColor as keyof typeof PCB_CONFIG_DATA.MASK_COLORS] || PCB_CONFIG_DATA.MASK_COLORS['Xanh lá'];
    const finish = PCB_CONFIG_DATA.FINISH_MATERIALS[surfaceFinish as keyof typeof PCB_CONFIG_DATA.FINISH_MATERIALS] || PCB_CONFIG_DATA.FINISH_MATERIALS['Mạ Vàng'];
    const thickVal = parseFloat(thickness) || 1.6;

    // Normalizing 3D scale: 100mm = 40 units in 3D viewport
    const sx = Math.max(8, (widthMm / 100) * 40);
    const sy = Math.max(8, (heightMm / 100) * 40);
    const sz = Math.max(0.4, (thickVal / 1.6) * 0.9);

    // 1. FR-4 Core Substrate
    const coreGeo = new THREE.BoxGeometry(sx, sy, sz);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x4a5d23, // FR-4 translucent olive green
      roughness: 0.85,
      metalness: 0.05,
      wireframe: isWireframe,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    pcbGroup.add(coreMesh);

    // 2. Top Solder Mask
    const topTex = createPCBTexture(false);
    const topGeo = new THREE.PlaneGeometry(sx, sy);
    const topMat = new THREE.MeshStandardMaterial({
      color: maskInfo.hex,
      map: topTex,
      roughness: maskInfo.roughness,
      metalness: maskInfo.metalness,
      wireframe: isWireframe,
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.z = sz / 2 + 0.05;
    topMesh.receiveShadow = true;
    tracesGroup.add(topMesh);

    // 3. Bottom Solder Mask
    const botTex = createPCBTexture(true);
    const botGeo = new THREE.PlaneGeometry(sx, sy);
    const botMat = new THREE.MeshStandardMaterial({
      color: maskInfo.hex,
      map: botTex,
      roughness: maskInfo.roughness,
      metalness: maskInfo.metalness,
      wireframe: isWireframe,
    });
    const botMesh = new THREE.Mesh(botGeo, botMat);
    botMesh.position.z = -sz / 2 - 0.05;
    botMesh.rotation.y = Math.PI; // Flip for underside
    botMesh.receiveShadow = true;
    tracesGroup.add(botMesh);

    // 4. Center SMD Microcontroller Chip (realistic 3D appearance)
    const icGeo = new THREE.BoxGeometry(sx * 0.22, sy * 0.22, 0.45);
    const icMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.4,
      metalness: 0.2,
      wireframe: isWireframe,
    });
    const icMesh = new THREE.Mesh(icGeo, icMat);
    icMesh.position.z = sz / 2 + 0.28;
    icMesh.castShadow = true;
    pcbGroup.add(icMesh);

    // 5. Plated Mounting Holes in 4 corners
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
      ringTop.position.set(hx, hy, sz / 2 + 0.06);
      tracesGroup.add(ringTop);

      const ringBot = new THREE.Mesh(ringGeo, padMat);
      ringBot.position.set(hx, hy, -sz / 2 - 0.06);
      ringBot.rotation.y = Math.PI;
      tracesGroup.add(ringBot);
    });

    scene.add(pcbGroup);
  };

  // Mount Three.js WebGL Scene with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, -55, 55);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true 
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

    // OrbitControls
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

    // Initial PCB build
    buildPCB();

    // Render loop
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

    // ResizeObserver ensures canvas NEVER collapses to 0 height!
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

  // Update PCB on spec changes
  useEffect(() => {
    buildPCB();
  }, [maskColor, surfaceFinish, thickness, widthMm, heightMm, isWireframe]);

  // Handle Layer Explode
  useEffect(() => {
    if (!tracesGroupRef.current) return;
    tracesGroupRef.current.position.z = explodeFactor * 9;
  }, [explodeFactor]);

  // Set camera view angles
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

  const handleResetCamera = () => {
    setCameraView('iso');
    setIsAutoRotating(true);
    setExplodeFactor(0);
  };

  // Upload and parse Gerber ZIP
  const handleGerberFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      alert('Vui lòng chọn file nén .ZIP chứa các lớp Gerber.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeGerberZip(file);
      setLocalAnalysis(result);

      if (result.success && result.boardWidthMm && result.boardHeightMm) {
        if (onDimensionsExtracted) {
          onDimensionsExtracted(result.boardWidthMm, result.boardHeightMm);
        }
      }

      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (e: any) {
      const errResult: GerberAnalysisResult = {
        success: false,
        message: 'Lỗi khi đọc file ZIP: ' + (e.message || 'Lỗi không xác định'),
      };
      setLocalAnalysis(errResult);
      if (onAnalysisComplete) onAnalysisComplete(errResult);
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
            onClick={handleResetCamera}
            className="p-1.5 rounded text-xs text-slate-400 hover:text-slate-200 transition"
            title="Đặt lại góc nhìn mặc định"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Info Badges & Fullscreen */}
        <div className="flex items-center gap-2 pointer-events-auto">
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
        {/* Explode layer slider */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Layers className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="text-slate-300 shrink-0 font-medium">Tách lớp 3D:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={explodeFactor}
            onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
            className="w-28 sm:w-36 accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="font-mono text-sky-400 w-9">{Math.round(explodeFactor * 100)}%</span>
        </div>

        {/* Gerber Drop / Upload shortcut */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <label className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-950/70 hover:bg-sky-900/80 text-sky-300 border border-sky-500/50 rounded-lg cursor-pointer transition shadow">
            <FileCode className="w-4 h-4 text-sky-400" />
            <span className="font-semibold">{isAnalyzing ? 'Đang phân tích...' : 'Xem 3D Gerber .ZIP'}</span>
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
        </div>
      </div>

      {/* 4. GERBER AUTO-MEASURE & ANALYSIS RESULT BANNER */}
      {localAnalysis && (
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 text-xs shrink-0">
          {localAnalysis.success ? (
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ĐÃ XEM 3D & PHÂN TÍCH: {localAnalysis.fileName} ({localAnalysis.layerCount} lớp)</span>
                </div>
                
                {localAnalysis.boardWidthMm && localAnalysis.boardHeightMm && (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-sky-950 text-sky-300 border border-sky-500/40 rounded text-[11px] font-mono font-bold">
                    <Ruler className="w-3.5 h-3.5 text-sky-400" />
                    <span>Auto Kích thước: {localAnalysis.boardWidthMm} x {localAnalysis.boardHeightMm} mm</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300">
                <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800 truncate">
                  <span className="text-slate-500">Top Cu:</span> <span className="text-sky-300">{localAnalysis.layers?.topCopper || '---'}</span>
                </div>
                <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800 truncate">
                  <span className="text-slate-500">Bot Cu:</span> <span className="text-sky-300">{localAnalysis.layers?.botCopper || '---'}</span>
                </div>
                <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800 truncate">
                  <span className="text-slate-500">Outline:</span> <span className="text-emerald-400">{localAnalysis.layers?.outline || '---'}</span>
                </div>
                <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800 truncate">
                  <span className="text-slate-500">Khoan Drill:</span> <span className="text-amber-400">{localAnalysis.layers?.drill || '---'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{localAnalysis.message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
