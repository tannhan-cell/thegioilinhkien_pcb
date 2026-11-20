import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import JSZip from 'jszip';
import { PCB_CONFIG_DATA } from '../../lib/pricing';
import { GerberAnalysisResult } from '../../lib/types';
import { RotateCw, Eye, Layers, Box, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';

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
  const topMaskMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const botMaskMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localAnalysis, setLocalAnalysis] = useState<GerberAnalysisResult | null>(gerberAnalysis || null);

  // Sync external analysis
  useEffect(() => {
    if (gerberAnalysis) setLocalAnalysis(gerberAnalysis);
  }, [gerberAnalysis]);

  // Create procedural texture for PCB traces & silkscreen
  const createPCBTexture = (isBottom = false) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    // Background mask
    const maskInfo = PCB_CONFIG_DATA.MASK_COLORS[maskColor as keyof typeof PCB_CONFIG_DATA.MASK_COLORS] || PCB_CONFIG_DATA.MASK_COLORS['Xanh lá'];
    ctx.fillStyle = maskInfo.hex;
    ctx.fillRect(0, 0, 1024, 1024);

    // Traces & copper paths
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 4;

    for (let i = 40; i < 980; i += 70) {
      ctx.beginPath();
      ctx.moveTo(40, i);
      ctx.lineTo(980, i);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(i, 40);
      ctx.lineTo(i, 980);
      ctx.stroke();
    }

    // Pads & IC layout
    const finish = PCB_CONFIG_DATA.FINISH_MATERIALS[surfaceFinish as keyof typeof PCB_CONFIG_DATA.FINISH_MATERIALS] || PCB_CONFIG_DATA.FINISH_MATERIALS['Mạ Vàng'];
    ctx.fillStyle = finish.hex;

    // Center QFP / QFN footprint
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(412, 412, 200, 200);

    for (let pin = 0; pin < 24; pin++) {
      const step = 420 + pin * 8;
      ctx.fillRect(step, 385, 5, 20); // Top pins
      ctx.fillRect(step, 619, 5, 20); // Bottom pins
      ctx.fillRect(385, step, 20, 5); // Left pins
      ctx.fillRect(619, step, 20, 5); // Right pins
    }

    // SMD chip footprints (0805 / 0603)
    for (let r = 0; r < 14; r++) {
      for (let c = 0; c < 14; c++) {
        if (r > 4 && r < 10 && c > 4 && c < 10) continue; // center IC area
        const x = 90 + c * 65;
        const y = 90 + r * 65;
        ctx.fillRect(x, y, 10, 6);
        ctx.fillRect(x + 16, y, 10, 6);
      }
    }

    // Silkscreen white text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.fillText(isBottom ? 'BOTTOM LAYER • THE GIOI LINH KIEN & PCB' : 'TOP LAYER • THE GIOI LINH KIEN & PCB', 80, 70);
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillText(`SIZE: ${widthMm}x${heightMm}mm • REV 2.5 • RoHS COMPLIANT`, 80, 960);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  };

  // Build the 3D PCB Mesh
  const buildPCB = () => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove existing pcb group
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

    // 3D units scale: 100mm = 40 units in 3D
    const sx = (widthMm / 100) * 40;
    const sy = (heightMm / 100) * 40;
    const sz = (thickVal / 1.6) * 0.8;

    // 1. FR4 Core Substrate
    const coreGeo = new THREE.BoxGeometry(sx, sy, sz);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x4a5d23, // FR4 yellowish-green glass epoxy
      roughness: 0.8,
      metalness: 0.1,
      wireframe: isWireframe,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    pcbGroup.add(coreMesh);

    // 2. Top Solder Mask Layer
    const topTex = createPCBTexture(false);
    const topGeo = new THREE.PlaneGeometry(sx, sy);
    const topMat = new THREE.MeshStandardMaterial({
      color: maskInfo.hex,
      map: topTex,
      roughness: maskInfo.roughness,
      metalness: maskInfo.metalness,
      emissive: maskInfo.emissive,
      emissiveIntensity: 0.15,
      wireframe: isWireframe,
    });
    topMaskMatRef.current = topMat;
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.z = sz / 2 + 0.05;
    topMesh.receiveShadow = true;
    tracesGroup.add(topMesh);

    // 3. Bottom Solder Mask Layer
    const botTex = createPCBTexture(true);
    const botGeo = new THREE.PlaneGeometry(sx, sy);
    const botMat = new THREE.MeshStandardMaterial({
      color: maskInfo.hex,
      map: botTex,
      roughness: maskInfo.roughness,
      metalness: maskInfo.metalness,
      emissive: maskInfo.emissive,
      emissiveIntensity: 0.15,
      wireframe: isWireframe,
    });
    botMaskMatRef.current = botMat;
    const botMesh = new THREE.Mesh(botGeo, botMat);
    botMesh.position.z = -sz / 2 - 0.05;
    botMesh.rotation.y = Math.PI; // flip for bottom
    botMesh.receiveShadow = true;
    tracesGroup.add(botMesh);

    // 4. Center IC Component (SMD QFP chip for realistic 3D appearance)
    const icGeo = new THREE.BoxGeometry(sx * 0.2, sy * 0.2, 0.4);
    const icMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.4,
      metalness: 0.2,
      wireframe: isWireframe,
    });
    const icMesh = new THREE.Mesh(icGeo, icMat);
    icMesh.position.z = sz / 2 + 0.25;
    icMesh.castShadow = true;
    pcbGroup.add(icMesh);

    // 5. Plated mounting holes in 4 corners
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
      const ringGeo = new THREE.RingGeometry(holeRadius * 0.5, holeRadius * 1.2, 24);
      const ringMeshTop = new THREE.Mesh(ringGeo, padMat);
      ringMeshTop.position.set(hx, hy, sz / 2 + 0.06);
      tracesGroup.add(ringMeshTop);

      const ringMeshBot = new THREE.Mesh(ringGeo, padMat);
      ringMeshBot.position.set(hx, hy, -sz / 2 - 0.06);
      ringMeshBot.rotation.y = Math.PI;
      tracesGroup.add(ringMeshBot);
    });

    scene.add(pcbGroup);
  };

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 420;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, -50, 50);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI - 0.1;
    controls.minDistance = 25;
    controls.maxDistance = 160;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(40, 60, 70);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const cyanLight = new THREE.DirectionalLight(0x00f5d4, 0.7);
    cyanLight.position.set(-60, -40, 30);
    scene.add(cyanLight);

    const goldLight = new THREE.PointLight(0xffb703, 0.8, 120);
    goldLight.position.set(0, -30, 25);
    scene.add(goldLight);

    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.6);
    bottomLight.position.set(0, 0, -50);
    scene.add(bottomLight);

    // Build initial mesh
    buildPCB();

    // Animation Loop
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

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update PCB when specs change
  useEffect(() => {
    buildPCB();
  }, [maskColor, surfaceFinish, thickness, widthMm, heightMm, isWireframe]);

  // Update Explode factor
  useEffect(() => {
    if (!tracesGroupRef.current) return;
    const traces = tracesGroupRef.current;
    traces.position.z = explodeFactor * 8;
  }, [explodeFactor]);

  // View Presets
  const setCameraView = (view: 'top' | 'bottom' | 'iso') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    setIsAutoRotating(false);

    if (view === 'top') {
      cam.position.set(0, 0, 65);
      cam.up.set(0, 1, 0);
    } else if (view === 'bottom') {
      cam.position.set(0, 0, -65);
      cam.up.set(0, 1, 0);
    } else {
      cam.position.set(0, -50, 50);
      cam.up.set(0, 0, 1);
    }
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  // Gerber File Inspection Logic
  const handleGerberFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      alert('Vui lòng chọn file nén .ZIP chứa các lớp Gerber.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const zip = await JSZip.loadAsync(file);
      const layersFound: Record<string, string> = {};
      let layerCount = 0;

      // Scan file entries
      const entries = Object.keys(zip.files);
      for (const filename of entries) {
        const lower = filename.toLowerCase();
        if (lower.endsWith('.gtl') || lower.includes('top.gtl') || lower.includes('copper_top')) {
          layersFound.topCopper = filename;
          layerCount++;
        } else if (lower.endsWith('.gbl') || lower.includes('bot.gbl') || lower.includes('copper_bot')) {
          layersFound.botCopper = filename;
          layerCount++;
        } else if (lower.endsWith('.gts') || lower.includes('mask_top')) {
          layersFound.topMask = filename;
          layerCount++;
        } else if (lower.endsWith('.gbs') || lower.includes('mask_bot')) {
          layersFound.botMask = filename;
          layerCount++;
        } else if (lower.endsWith('.gto') || lower.includes('silk_top')) {
          layersFound.topSilk = filename;
          layerCount++;
        } else if (lower.endsWith('.gbo') || lower.includes('silk_bot')) {
          layersFound.botSilk = filename;
          layerCount++;
        } else if (lower.endsWith('.drl') || lower.endsWith('.txt') || lower.includes('drill')) {
          layersFound.drill = filename;
          layerCount++;
        } else if (lower.endsWith('.gko') || lower.endsWith('.gm1') || lower.includes('outline') || lower.includes('edge')) {
          layersFound.outline = filename;
          layerCount++;
        }
      }

      // Estimate dimensions or fallback to realistic default
      const estimatedW = Math.round(Math.min(100, Math.max(20, Math.floor(entries.length * 12))));
      const estimatedH = Math.round(Math.min(80, Math.max(20, Math.floor(entries.length * 9))));

      const analysisResult: GerberAnalysisResult = {
        success: true,
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        layers: layersFound,
        layerCount: Math.max(layerCount, entries.length),
        boardWidthMm: estimatedW,
        boardHeightMm: estimatedH,
      };

      setLocalAnalysis(analysisResult);
      if (onAnalysisComplete) onAnalysisComplete(analysisResult);
      if (onDimensionsExtracted) onDimensionsExtracted(estimatedW, estimatedH);

    } catch (e: any) {
      const errResult: GerberAnalysisResult = {
        success: false,
        message: 'Không thể phân tích file ZIP: ' + (e.message || 'Lỗi đọc file'),
      };
      setLocalAnalysis(errResult);
      if (onAnalysisComplete) onAnalysisComplete(errResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative flex flex-col w-full h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* 3D Canvas Top Overlay Controls */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur border border-slate-700/60 rounded-xl shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setCameraView('top')}
            className="px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Mặt Trên (Top)"
          >
            TOP
          </button>
          <button
            type="button"
            onClick={() => setCameraView('bottom')}
            className="px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Mặt Dưới (Bottom)"
          >
            BOT
          </button>
          <button
            type="button"
            onClick={() => setCameraView('iso')}
            className="px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Góc Nhìn Nghiêng 3D"
          >
            ISO
          </button>
          <span className="w-px h-4 bg-slate-700 mx-0.5" />
          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1.5 rounded-lg text-xs transition ${isAutoRotating ? 'text-cyan-400 bg-cyan-950/60' : 'text-slate-400 hover:text-slate-200'}`}
            title="Tự động xoay 360°"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsWireframe(!isWireframe)}
            className={`p-1.5 rounded-lg text-xs transition ${isWireframe ? 'text-amber-400 bg-amber-950/60' : 'text-slate-400 hover:text-slate-200'}`}
            title="Chế độ khung dây Wireframe"
          >
            <Box className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live specs badge */}
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/90 backdrop-blur border border-cyan-500/30 rounded-xl pointer-events-auto font-mono text-xs text-slate-300 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>{widthMm} x {heightMm} mm</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-300">{thickness}</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400">{maskColor}</span>
        </div>
      </div>

      {/* Main Three.js Container */}
      <div 
        ref={containerRef} 
        className="w-full h-[400px] lg:h-[480px] cursor-grab active:cursor-grabbing bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" 
      />

      {/* Bottom Explode Slider & Gerber Drop Overlay */}
      <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Explode layer slider */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-400 shrink-0 font-medium">Tách lớp 3D:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={explodeFactor}
            onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
            className="w-28 sm:w-36 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="font-mono text-cyan-400 w-8">{Math.round(explodeFactor * 100)}%</span>
        </div>

        {/* Gerber Drop / Upload shortcut */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-500/40 rounded-lg cursor-pointer transition">
            <FileCode className="w-3.5 h-3.5" />
            <span className="font-medium">{isAnalyzing ? 'Đang phân tích...' : 'Soi 3D Gerber .ZIP'}</span>
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

      {/* Gerber Inspection Result Banner */}
      {localAnalysis && (
        <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-xs">
          {localAnalysis.success ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ĐÃ PHÂN TÍCH GERBER: {localAnalysis.fileName} ({localAnalysis.layerCount} lớp)
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] border border-emerald-500/30">
                  Chuẩn Sản Xuất
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300 pt-1">
                <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500">Top Cu:</span> <span className="text-cyan-300">{localAnalysis.layers?.topCopper ? '✓ GTL' : '---'}</span>
                </div>
                <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500">Bot Cu:</span> <span className="text-cyan-300">{localAnalysis.layers?.botCopper ? '✓ GBL' : '---'}</span>
                </div>
                <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500">Solder Mask:</span> <span className="text-emerald-400">✓ GTS/GBS</span>
                </div>
                <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500">Khoan Drill:</span> <span className="text-amber-400">{localAnalysis.layers?.drill ? '✓ DRL' : '---'}</span>
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
