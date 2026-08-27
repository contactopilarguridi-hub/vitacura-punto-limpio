import { Fragment, useState } from "react";

// ─── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  teal: "#00A99D", tealLight: "#E6F7F6", tealDark: "#007F75",
  lime: "#8DC63F", limeLight: "#F2F9E8",
  fucsia: "#C6217A", fucsiaLight: "#FAE8F2",
  amber: "#F59E0B", amberLight: "#FFFBEB",
  orange: "#F97316", orangeLight: "#FFF7ED",
  gray900: "#3D3D3D", gray600: "#6B7280", gray400: "#9CA3AF",
  gray200: "#E5E7EB", gray100: "#F3F4F6", white: "#FFFFFF",
};

// ─── Datos iniciales ──────────────────────────────────────────────────────────
const MATERIALES_INIT = [
  { id: "papel_carton", label: "Papel y cartón", activo: true },
  { id: "vidrio", label: "Vidrio", activo: true },
  { id: "latas", label: "Latas de aluminio", activo: true },
  { id: "plastico_envases", label: "Envases plásticos", activo: true },
  { id: "plastico_botellas", label: "Botellas plásticas", activo: true },
  { id: "tetrapak", label: "Tetra pak", activo: true },
  { id: "metal", label: "Metal y chatarra", activo: true },
  { id: "ropa", label: "Ropa", activo: true },
  { id: "electrodomesticos", label: "Electrónicos", activo: true },
  { id: "pilas", label: "Pilas y baterías", activo: true },
  { id: "medicamentos", label: "Medicamentos vencidos", activo: true },
  { id: "cartridge", label: "Cartridge y tóner", activo: true },
  { id: "residuos_organicos", label: "Residuos orgánicos", activo: true },
];

// Color institucional por tipo de material (ícono del contenedor).
const MATERIAL_COLORS = {
  papel_carton: "#3B82F6",
  vidrio: "#22C55E",
  latas: "#9CA3AF",
  plastico_envases: "#F59E0B",
  plastico_botellas: "#F59E0B",
  tetrapak: "#F59E0B",
  metal: "#6B7280",
  ropa: "#A855F7",
  electrodomesticos: "#00A99D",
  pilas: "#EF4444",
  medicamentos: "#EC4899",
  cartridge: "#F97316",
  residuos_organicos: "#8DC63F",
};
const MATERIAL_COLOR_DEFAULT = "#6B7280";
function colorMaterial(id) { return MATERIAL_COLORS[id] || MATERIAL_COLOR_DEFAULT; }

const GESTORES_INIT = [
  { id: "coaniquem", nombre: "Coaniquem", activo: true },
  { id: "triciclo", nombre: "Triciclo", activo: true },
  { id: "gerdau", nombre: "Gerdau", activo: true },
  { id: "otro", nombre: "Otro", activo: true },
];

const USUARIOS = [
  { id: "admin_recinto", nombre: "Carlos Fuentes", rol: "recinto", email: "carlos@vitacura.cl", pass: "1234" },
  { id: "subdir", nombre: "María González", rol: "subdireccion", email: "maria@vitacura.cl", pass: "1234" },
  { id: "sysadmin", nombre: "Administrador", rol: "sysadmin", email: "admin@vitacura.cl", pass: "1234" },
];

// ─── Sesión persistida ────────────────────────────────────────────────────────
const USUARIO_STORAGE_KEY = "puntoLimpio_usuarioId";

function cargarUsuarioGuardado() {
  try {
    const id = localStorage.getItem(USUARIO_STORAGE_KEY);
    return id ? USUARIOS.find(u => u.id === id) ?? null : null;
  } catch {
    return null;
  }
}

function guardarUsuarioSesion(usuario) {
  try { localStorage.setItem(USUARIO_STORAGE_KEY, usuario.id); } catch { /* localStorage no disponible */ }
}

function borrarUsuarioSesion() {
  try { localStorage.removeItem(USUARIO_STORAGE_KEY); } catch { /* localStorage no disponible */ }
}

const NIVELES = [
  { valor: 1, label: "Vacío",  color: C.lime,   bg: C.limeLight },
  { valor: 2, label: "Bajo",   color: C.teal,   bg: C.tealLight },
  { valor: 3, label: "Medio",  color: C.amber,  bg: C.amberLight },
  { valor: 4, label: "Alto",   color: C.orange, bg: C.orangeLight },
  { valor: 5, label: "Lleno",  color: C.fucsia, bg: C.fucsiaLight },
];

function nivelInfo(v) { return NIVELES.find(n => n.valor === v) || NIVELES[1]; }
function fechaHoy() { return new Date().toISOString().split("T")[0]; }
function pct(v) { return ((v - 1) / 4) * 100; }

// ─── Períodos del dashboard ───────────────────────────────────────────────────
function toISO(d) { return d.toISOString().split("T")[0]; }
function addDias(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }
function inicioDeMes(date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function finDeMesAnterior(date) { return new Date(date.getFullYear(), date.getMonth(), 0); }

function calcularRangoPeriodo(periodo) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  let inicio, fin, inicioAnt, finAnt, label;

  switch (periodo) {
    case "semana_anterior":
      fin = addDias(hoy, -7);
      inicio = addDias(fin, -6);
      finAnt = addDias(inicio, -1);
      inicioAnt = addDias(finAnt, -6);
      label = "semana anterior";
      break;
    case "mes_actual":
      inicio = inicioDeMes(hoy);
      fin = hoy;
      finAnt = addDias(inicio, -1);
      inicioAnt = inicioDeMes(finAnt);
      label = "este mes";
      break;
    case "mes_anterior":
      fin = finDeMesAnterior(hoy);
      inicio = inicioDeMes(fin);
      finAnt = addDias(inicio, -1);
      inicioAnt = inicioDeMes(finAnt);
      label = "mes anterior";
      break;
    case "ultimos_30":
      fin = hoy;
      inicio = addDias(hoy, -29);
      finAnt = addDias(inicio, -1);
      inicioAnt = addDias(finAnt, -29);
      label = "últimos 30 días";
      break;
    case "semana_actual":
    default:
      fin = hoy;
      inicio = addDias(hoy, -6);
      finAnt = addDias(inicio, -1);
      inicioAnt = addDias(finAnt, -6);
      label = "esta semana";
      break;
  }

  const dias = Math.round((fin - inicio) / 86400000) + 1;
  return { inicio, fin, inicioAnt, finAnt, dias, label };
}

function diasDelPeriodo(inicio, fin) {
  const dias = [];
  for (let d = new Date(inicio); d <= fin; d = addDias(d, 1)) {
    dias.push(toISO(d));
  }
  return dias;
}

// ─── Exportar Excel (CSV) ─────────────────────────────────────────────────────
function csvEscape(valor) {
  const s = String(valor ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function exportarExcel(regs, materiales, gestores, nombreArchivo) {
  const matsActivos = materiales.filter(m => m.activo);
  const headers = [
    "Fecha", "Usuario", "Material", "Nivel", "Nivel texto",
    "Rechazado", "Tipo rechazado", "Retiro", "Material retirado", "Gestor", "Observaciones",
  ];
  const filas = [];
  regs.forEach(r => {
    const materialRetiradoLabel = materiales.find(m => m.id === r.materialRetirado)?.label || "";
    const gestorNombre = gestores.find(g => g.id === r.gestor)?.nombre || "";
    matsActivos.forEach(m => {
      const nivel = r.ocupacion?.[m.id];
      if (nivel == null) return;
      filas.push([
        r.fecha,
        r.usuario,
        m.label,
        nivel,
        nivelInfo(nivel).label,
        r.rechazado ? "Sí" : "No",
        r.tipoRechazado || "",
        r.retiro ? "Sí" : "No",
        materialRetiradoLabel,
        gestorNombre,
        r.observaciones || "",
      ]);
    });
  });
  const csv = [headers, ...filas].map(fila => fila.map(csvEscape).join(",")).join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Exportar reporte PDF ─────────────────────────────────────────────────────
function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Dibuja el mismo ícono de contenedor/tacho de la UI (tapa + cuerpo redondeado),
// en miniatura, dentro de una tabla del PDF.
function dibujarIconoContenedorPDF(doc, x, y, size, colorRgb) {
  const bodyH = size * 0.7;
  const lidH = size * 0.22;
  const bodyY = y + size - bodyH;
  doc.setFillColor(...colorRgb);
  doc.roundedRect(x, bodyY, size, bodyH, 0.5, 0.5, "F");
  doc.roundedRect(x - 0.4, bodyY - lidH, size + 0.8, lidH, 0.4, 0.4, "F");
}

async function cargarImagenComoDataURL(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo cargar ${url}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function exportarPDF({ rango, statsFiltrados, alertas, retiros, retirosPorGestor, rechazados, diasRegistrados, cumplimiento }) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginX = 14;

  const teal = hexToRgb(C.teal);
  const fucsia = hexToRgb(C.fucsia);
  const orange = hexToRgb(C.orange);
  const amber = hexToRgb(C.amber);
  const gray900 = hexToRgb(C.gray900);
  const gray600 = hexToRgb(C.gray600);
  const gray200 = hexToRgb(C.gray200);
  const white = [255, 255, 255];

  const ahora = new Date();
  const fechaGeneracion = `${ahora.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" })} ${ahora.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`;

  function ensureSpace(alto) {
    if (y + alto > pageH - 22) { doc.addPage(); y = 20; }
  }

  // ── Encabezado institucional ──
  doc.setFillColor(...teal);
  doc.rect(0, 0, pageW, 36, "F");

  const logoSize = 20;
  const logoX = marginX;
  const logoY = (36 - logoSize) / 2;
  try {
    const logoDataUrl = await cargarImagenComoDataURL("/icons/icon-192.png");
    doc.addImage(logoDataUrl, "PNG", logoX, logoY, logoSize, logoSize);
  } catch {
    // Sin conexión al ícono: se deja un badge circular como respaldo.
    doc.setFillColor(...white);
    doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, "F");
  }

  doc.setTextColor(...white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("Punto Limpio Inteligente", 40, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Municipalidad de Vitacura", 40, 22.5);

  doc.setFontSize(9);
  doc.text(`Período: ${rango.label}`, pageW - marginX, 14, { align: "right" });
  doc.text(`Generado: ${fechaGeneracion}`, pageW - marginX, 20, { align: "right" });

  let y = 48;

  // ── Métricas ──
  doc.setTextColor(...gray900);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("MÉTRICAS DEL PERÍODO", marginX, y);
  y += 6;

  const metricas = [
    { label: "Días registrados", valor: `${diasRegistrados}/${rango.dias}`, color: teal },
    { label: "% Cumplimiento", valor: `${cumplimiento}%`, color: cumplimiento >= 80 ? teal : cumplimiento >= 50 ? amber : fucsia },
    { label: "Alertas activas", valor: `${alertas.length}`, color: alertas.length > 0 ? orange : teal },
    { label: "Retiros", valor: `${retiros.length}`, color: teal },
  ];
  const boxW = (pageW - marginX * 2 - 3 * 4) / 4;
  metricas.forEach((m, i) => {
    const x = marginX + i * (boxW + 4);
    doc.setDrawColor(...gray200);
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(x, y, boxW, 20, 2, 2, "FD");
    doc.setTextColor(...m.color);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(m.valor, x + boxW / 2, y + 10, { align: "center" });
    doc.setTextColor(...gray600);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(m.label, x + boxW / 2, y + 16, { align: "center" });
  });
  y += 28;

  // ── Ocupación promedio por material ──
  doc.setTextColor(...gray900);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("OCUPACIÓN PROMEDIO POR MATERIAL", marginX, y);
  y += 3;

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    head: [["Material", "Promedio", "Nivel"]],
    body: statsFiltrados.map(m => [m.label, `${m.promActual}/5`, nivelInfo(Math.round(m.promActual) || 1).label]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: teal, textColor: white, fontStyle: "bold" },
    columnStyles: { 0: { cellPadding: { top: 2.5, right: 3, bottom: 2.5, left: 9 } } },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 2) {
        const m = statsFiltrados[data.row.index];
        const nivel = nivelInfo(Math.round(m.promActual) || 1);
        data.cell.styles.textColor = hexToRgb(nivel.color);
        data.cell.styles.fontStyle = "bold";
      }
    },
    didDrawCell: (data) => {
      if (data.section === "body" && data.column.index === 0) {
        const m = statsFiltrados[data.row.index];
        const iconSize = 4;
        const iconX = data.cell.x + 1.8;
        const iconY = data.cell.y + (data.cell.height - iconSize) / 2;
        dibujarIconoContenedorPDF(doc, iconX, iconY, iconSize, hexToRgb(colorMaterial(m.id)));
      }
    },
  });
  y = doc.lastAutoTable.finalY + 10;

  // ── Alertas activas ──
  ensureSpace(16);
  doc.setTextColor(...gray900);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("ALERTAS ACTIVAS", marginX, y);
  y += 6;
  if (alertas.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...gray600);
    doc.text("Sin alertas activas en el período.", marginX, y);
    y += 8;
  } else {
    alertas.forEach(a => {
      ensureSpace(7);
      doc.setFillColor(...hexToRgb(a.color));
      doc.circle(marginX + 1.2, y - 1.2, 1.2, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...gray900);
      doc.text(a.msg, marginX + 5, y);
      y += 6.5;
    });
    y += 2;
  }

  // ── Retiros por gestor ──
  ensureSpace(16);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...gray900);
  doc.text("RETIROS POR GESTOR", marginX, y);
  y += 3;
  if (retirosPorGestor.length === 0) {
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...gray600);
    doc.text("Sin retiros registrados en el período.", marginX, y);
    y += 8;
  } else {
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      head: [["Gestor", "Retiros en el período"]],
      body: retirosPorGestor.map(g => [g.nombre, String(g.count)]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: teal, textColor: white, fontStyle: "bold" },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // ── Material rechazado ──
  ensureSpace(16);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...gray900);
  doc.text("MATERIAL RECHAZADO", marginX, y);
  y += 3;
  if (rechazados.length === 0) {
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...gray600);
    doc.text("Sin rechazos registrados en el período.", marginX, y);
  } else {
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      head: [["Fecha", "Tipo de material rechazado"]],
      body: rechazados.map(r => [r.fecha, r.tipoRechazado || "—"]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: fucsia, textColor: white, fontStyle: "bold" },
    });
  }

  // ── Pie de página ──
  const totalPaginas = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    doc.setDrawColor(...gray200);
    doc.line(marginX, pageH - 15, pageW - marginX, pageH - 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...gray600);
    doc.text("Generado automáticamente por Punto Limpio Inteligente — Vitacura", marginX, pageH - 10);
    doc.text(`Página ${i}/${totalPaginas}`, pageW - marginX, pageH - 10, { align: "right" });
  }

  doc.save(`reporte-punto-limpio_${rango.label.replace(/\s+/g, "-")}_${fechaHoy()}.pdf`);
}

function generarDemo(materiales) {
  const hoy = new Date();
  const regs = [];

  // Días sin registro dentro de los últimos 30 días (huecos deliberados para demo)
  const diasSinRegistro = new Set([5, 10, 17, 23]);

  const retirosPorDia = {
    6: { material: "papel_carton", gestor: "coaniquem" },
    14: { material: "vidrio", gestor: "triciclo" },
    20: { material: "metal", gestor: "gerdau" },
    27: { material: "plastico_botellas", gestor: "triciclo" },
  };
  const rechazosPorDia = {
    3: "Escombros",
    19: "Restos de poda",
  };
  const observacionesPorDia = {
    3: "Se rechazó material de construcción. Usuario informado.",
    7: "Alta afluencia. Cartón saturado antes del cierre.",
    20: "Retiro coordinado con Gerdau, chatarra despachada sin incidentes.",
  };

  for (let i = 29; i >= 1; i--) {
    if (diasSinRegistro.has(i)) continue;
    const f = new Date(hoy);
    f.setDate(hoy.getDate() - i);
    const ocupacion = {};
    materiales.filter(m => m.activo).forEach(m => {
      ocupacion[m.id] = Math.ceil(Math.random() * 5);
    });
    const retiroInfo = retirosPorDia[i];
    regs.push({
      id: `reg_${i}`,
      fecha: f.toISOString().split("T")[0],
      usuario: "Carlos Fuentes",
      ocupacion,
      rechazado: !!rechazosPorDia[i],
      tipoRechazado: rechazosPorDia[i] || "",
      retiro: !!retiroInfo,
      materialRetirado: retiroInfo?.material || "",
      gestor: retiroInfo?.gestor || "",
      observaciones: observacionesPorDia[i] || "",
      estado: "completo",
    });
  }
  return regs;
}

// ─── Componentes base ─────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: `1px solid ${C.gray200}`, ...style }}>{children}</div>;
}

function Btn({ children, onClick, variant = "primary", size = "md", style = {} }) {
  const base = { border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontFamily: "inherit", transition: "opacity 0.15s" };
  const sizes = { sm: { padding: "6px 12px", fontSize: 12 }, md: { padding: "10px 18px", fontSize: 13 }, lg: { padding: "14px 24px", fontSize: 15, borderRadius: 10, width: "100%" } };
  const variants = {
    primary: { background: C.teal, color: C.white },
    secondary: { background: C.gray100, color: C.gray900 },
    danger: { background: C.fucsiaLight, color: C.fucsia },
    ghost: { background: "none", color: C.gray600 },
  };
  return <button onClick={onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...style }} onMouseOver={e => e.currentTarget.style.opacity = "0.85"} onMouseOut={e => e.currentTarget.style.opacity = "1"}>{children}</button>;
}

function Tag({ label, color, bg, style = {} }) {
  return <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20, color, background: bg, letterSpacing: 0.3, ...style }}>{label}</span>;
}

function BarraH({ valor }) {
  const p = pct(valor);
  const info = nivelInfo(valor);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 7, background: C.gray100, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${p}%`, height: "100%", background: info.color, borderRadius: 4 }} />
      </div>
      <Tag label={info.label} color={info.color} bg={info.bg} />
    </div>
  );
}

// Ícono de contenedor/tacho — reemplaza el emoji de cada material.
function IconoContenedor({ color = MATERIAL_COLOR_DEFAULT, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0, display: "block" }}>
      <rect x="9" y="2.5" width="6" height="2.5" rx="1.25" fill={color} />
      <rect x="4" y="6" width="16" height="3" rx="1.5" fill={color} />
      <rect x="5.5" y="10" width="13" height="12" rx="2.5" fill={color} />
      <rect x="9" y="13" width="1.6" height="6" rx="0.8" fill="#fff" opacity="0.55" />
      <rect x="13.4" y="13" width="1.6" height="6" rx="0.8" fill="#fff" opacity="0.55" />
    </svg>
  );
}

// Ícono institucional: contenedor de reciclaje teal con flecha curva lima
// encima. Flat design, sin sombras. Usado en el header y como base de los
// íconos PWA (ver scripts/generate-icons.js).
function IconoLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" style={{ flexShrink: 0, display: "block" }}>
      <rect x="6" y="11" width="20" height="3.2" rx="1.6" fill="#00A99D" />
      <rect x="8" y="13.5" width="16" height="15" rx="3" fill="#00A99D" />
      <rect x="13" y="17" width="1.8" height="8" rx="0.9" fill="#ffffff" opacity="0.5" />
      <rect x="18" y="17" width="1.8" height="8" rx="0.9" fill="#ffffff" opacity="0.5" />
      <path d="M6,8 C10,2 22,2 26,8" stroke="#8DC63F" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <polygon points="23,4.5 28.5,8 22.5,11" fill="#8DC63F" />
    </svg>
  );
}

// Etiqueta de material: ícono de contenedor + nombre.
function MaterialLabel({ material, style = {} }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, ...style }}>
      <IconoContenedor color={colorMaterial(material.id)} size={16} />
      {material.label}
    </span>
  );
}

// Barras diarias: una barra por día del período, coloreada según nivel de ocupación.
// Letra corta de día de semana (D L M M J V S), independiente del locale del navegador.
const DIA_LETRA = ["D", "L", "M", "M", "J", "V", "S"];
function formatoCortoDia(fechaISO) {
  const d = new Date(fechaISO + "T12:00:00");
  return `${DIA_LETRA[d.getDay()]} ${d.getDate()}`;
}

// Heatmap de tendencia: filas = materiales, columnas = días del período o día
// seleccionado. Cada celda es un cuadrado de 28x28 coloreado según nivel.
function HeatmapTendencia({ materiales, dias, registrosPorFecha }) {
  const CELL = 28;
  const LABEL_W = 132;
  return (
    <div style={{ overflowX: "auto", paddingBottom: 4 }}>
      <div style={{ display: "grid", gridTemplateColumns: `${LABEL_W}px repeat(${dias.length}, ${CELL}px)`, gap: 3, width: "max-content" }}>
        <div style={{ position: "sticky", left: 0, background: C.white }} />
        {dias.map(fecha => (
          <div key={fecha} style={{ fontSize: 9, fontWeight: 700, color: C.gray600, textAlign: "center", alignSelf: "end", paddingBottom: 4 }}>
            {formatoCortoDia(fecha)}
          </div>
        ))}
        {materiales.map(m => (
          <Fragment key={m.id}>
            <div style={{ position: "sticky", left: 0, background: C.white, display: "flex", alignItems: "center" }}>
              <MaterialLabel material={m} style={{ fontSize: 12, color: C.gray900 }} />
            </div>
            {dias.map(fecha => {
              const nivel = registrosPorFecha[fecha]?.ocupacion?.[m.id];
              const info = nivel != null ? nivelInfo(nivel) : null;
              return (
                <div key={fecha}
                  title={info ? `${fecha} — ${info.label} (${nivel}/5)` : `${fecha}: sin registro`}
                  style={{ width: CELL, height: CELL, borderRadius: 5, background: info ? info.color : C.gray200 }} />
              );
            })}
          </Fragment>
        ))}
      </div>

      {/* Leyenda de colores */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.gray200}` }}>
        {NIVELES.map((n, i) => (
          <span key={n.valor} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            {i > 0 && <span style={{ color: C.gray400, fontSize: 11 }}>·</span>}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: C.gray600 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: n.color, display: "inline-block", flexShrink: 0 }} />
              {n.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: C.gray600, letterSpacing: 1, textTransform: "uppercase" }}>{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ padding: "9px 12px", border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 13, color: C.gray900, outline: "none", fontFamily: "inherit", background: C.white }} />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: C.gray600, letterSpacing: 1, textTransform: "uppercase" }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ padding: "9px 12px", border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 13, color: C.gray900, outline: "none", fontFamily: "inherit", background: C.white }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 40, height: 22, borderRadius: 11, background: value ? C.teal : C.gray200, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
      <div style={{ position: "absolute", top: 3, left: value ? 21 : 3, width: 16, height: 16, borderRadius: 8, background: C.white, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </div>
  );
}

function SectionTitle({ children, color = C.teal }) {
  return <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{children}</div>;
}

// Ilustración del encabezado del dashboard: vista aérea de un barrio reciclando
// (flat design, sin sombras, sin personas).
const EDIFICIOS_ILUSTRACION = [
  { x: 48, y: 70, w: 40, h: 36, color: "#C6217A" },
  { x: 100, y: 54, w: 34, h: 30, color: "#00A99D" },
  { x: 230, y: 44, w: 38, h: 34, color: "#00A99D" },
  { x: 270, y: 78, w: 32, h: 30, color: "#C6217A" },
  { x: 430, y: 42, w: 36, h: 32, color: "#C6217A" },
  { x: 468, y: 76, w: 34, h: 30, color: "#00A99D" },
  { x: 610, y: 56, w: 38, h: 34, color: "#00A99D" },
  { x: 655, y: 90, w: 32, h: 28, color: "#C6217A" },
];
const ARBOLES_ILUSTRACION = [
  { cx: 20, cy: 45, r: 7 },
  { cx: 150, cy: 100, r: 10 },
  { cx: 200, cy: 122, r: 8 },
  { cx: 330, cy: 112, r: 9 },
  { cx: 380, cy: 50, r: 7 },
  { cx: 520, cy: 112, r: 10 },
  { cx: 570, cy: 44, r: 8 },
  { cx: 715, cy: 70, r: 9 },
];
const TACHOS_ILUSTRACION = [
  { x: 14, y: 118, color: "#00A99D" },
  { x: 178, y: 58, color: "#C6217A" },
  { x: 398, y: 96, color: "#8DC63F" },
  { x: 600, y: 112, color: "#00A99D" },
  { x: 744, y: 48, color: "#C6217A" },
];

function IlustracionCiudad() {
  return (
    <svg width="100%" height="160" viewBox="0 0 800 160" role="img" aria-label="Ilustración de un barrio reciclando" style={{ display: "block" }}>
      <rect x="0" y="0" width="800" height="160" rx="16" fill="#F3F4F6" />

      {/* Calle */}
      <path d="M10,95 Q200,82 400,95 T790,90" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.9" />

      {/* Edificios con tejado verde */}
      {EDIFICIOS_ILUSTRACION.map((e, i) => (
        <g key={i}>
          <rect x={e.x} y={e.y} width={e.w} height={e.h} rx="6" fill={e.color} />
          <rect x={e.x + 3} y={e.y} width={e.w - 6} height={e.h * 0.45} rx="4" fill="#8DC63F" />
        </g>
      ))}

      {/* Árboles redondeados */}
      {ARBOLES_ILUSTRACION.map((t, i) => (
        <circle key={i} cx={t.cx} cy={t.cy} r={t.r} fill="#8DC63F" />
      ))}

      {/* Contenedores de colores en las calles */}
      {TACHOS_ILUSTRACION.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y + 3} width="10" height="10" rx="2" fill={b.color} />
          <rect x={b.x - 1} y={b.y} width="12" height="3.5" rx="1.5" fill={b.color} />
        </g>
      ))}

      {/* Flechas curvas de reciclaje conectando los barrios */}
      <path d="M40,62 C150,14 250,14 340,32 C430,50 530,50 620,22 C665,9 715,12 752,32"
        stroke="#00A99D" strokeWidth="4" strokeLinecap="round" fill="none" />
      <polygon points="746,22 764,33 747,46" fill="#00A99D" />

      <path d="M760,100 C650,150 550,150 460,130 C370,110 270,110 180,128 C130,138 92,133 58,113"
        stroke="#C6217A" strokeWidth="4" strokeLinecap="round" fill="none" />
      <polygon points="65,103 47,113 66,126" fill="#C6217A" />
    </svg>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    const u = USUARIOS.find(u => u.email === email && u.pass === pass);
    if (u) { onLogin(u); setError(""); }
    else setError("Credenciales incorrectas.");
  }

  return (
    <div style={{ minHeight: "100vh", background: C.gray100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <Card style={{ width: "100%", maxWidth: 380, padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>♻️</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.gray900 }}>Punto Limpio Inteligente</div>
          <div style={{ fontSize: 12, color: C.gray600, marginTop: 4 }}>Municipalidad de Vitacura</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Correo" value={email} onChange={setEmail} type="email" placeholder="usuario@vitacura.cl" />
          <Input label="Contraseña" value={pass} onChange={setPass} type="password" placeholder="••••••••" />
          {error && <div style={{ fontSize: 12, color: C.fucsia, background: C.fucsiaLight, padding: "8px 12px", borderRadius: 8 }}>{error}</div>}
          <Btn size="lg" onClick={handleLogin}>Ingresar</Btn>
        </div>
        <div style={{ marginTop: 20, padding: "12px", background: C.gray100, borderRadius: 8 }}>
          <div style={{ fontSize: 10, color: C.gray600, fontWeight: 600, marginBottom: 6 }}>ACCESOS DE DEMO</div>
          {USUARIOS.map(u => (
            <div key={u.id} style={{ fontSize: 11, color: C.gray600, marginBottom: 3 }}>
              <span style={{ color: C.teal, fontWeight: 600 }}>{u.email}</span> / {u.pass} — {u.rol}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Formulario diario ────────────────────────────────────────────────────────
function ViewFormulario({ registros, materiales, gestores, usuario, onGuardar }) {
  const hoy = fechaHoy();
  const regHoy = registros.find(r => r.fecha === hoy);
  const mats = materiales.filter(m => m.activo);

  const ocupInit = {};
  mats.forEach(m => { ocupInit[m.id] = regHoy?.ocupacion?.[m.id] ?? 2; });

  const [ocupacion, setOcupacion] = useState(ocupInit);
  const [rechazado, setRechazado] = useState(regHoy?.rechazado ?? false);
  const [tipoRechazado, setTipoRechazado] = useState(regHoy?.tipoRechazado ?? "");
  const [retiro, setRetiro] = useState(regHoy?.retiro ?? false);
  const [materialRetirado, setMaterialRetirado] = useState(regHoy?.materialRetirado ?? "");
  const [gestor, setGestor] = useState(regHoy?.gestor ?? "");
  const [obs, setObs] = useState(regHoy?.observaciones ?? "");
  const [enviado, setEnviado] = useState(false);

  const fechaDisplay = new Date().toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });

  function handleEnviar() {
    onGuardar({ id: regHoy?.id || `reg_${Date.now()}`, fecha: hoy, usuario: usuario.nombre, ocupacion: { ...ocupacion }, rechazado, tipoRechazado, retiro, materialRetirado, gestor, observaciones: obs, estado: "completo" });
    setEnviado(true);
  }

  if (enviado) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 24px", gap: 12 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.tealLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>✅</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.gray900 }}>Registro guardado</div>
      <div style={{ fontSize: 14, color: C.gray600, textTransform: "capitalize" }}>{fechaDisplay}</div>
      <Btn variant="secondary" onClick={() => setEnviado(false)}>Editar registro</Btn>
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 10, color: C.teal, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Registro diario</div>
        <div style={{ fontSize: 19, fontWeight: 700, color: C.gray900, textTransform: "capitalize" }}>{fechaDisplay}</div>
        <div style={{ fontSize: 12, color: C.gray600, marginTop: 2 }}>Registrado por {usuario.nombre}</div>
      </div>

      {/* Ocupación */}
      <Card style={{ padding: 20 }}>
        <SectionTitle>Nivel de ocupación por material</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {mats.map(m => {
            const info = nivelInfo(ocupacion[m.id]);
            return (
              <div key={m.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <MaterialLabel material={m} style={{ fontSize: 13, fontWeight: 600, color: C.gray900 }} />
                  <Tag label={info.label} color={info.color} bg={info.bg} />
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  {NIVELES.map(n => (
                    <button key={n.valor} onClick={() => setOcupacion(p => ({ ...p, [m.id]: n.valor }))}
                      style={{ flex: 1, padding: "8px 2px", borderRadius: 8, cursor: "pointer", border: ocupacion[m.id] === n.valor ? `2px solid ${n.color}` : `2px solid ${C.gray200}`, background: ocupacion[m.id] === n.valor ? n.bg : C.white, color: ocupacion[m.id] === n.valor ? n.color : C.gray400, fontSize: 11, fontWeight: ocupacion[m.id] === n.valor ? 700 : 400, transition: "all 0.15s" }}>
                      {n.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Material rechazado */}
      <Card style={{ padding: 20 }}>
        <SectionTitle>Material rechazado</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: rechazado ? 14 : 0 }}>
          <span style={{ fontSize: 13, color: C.gray900 }}>¿Se rechazó material hoy?</span>
          <Toggle value={rechazado} onChange={setRechazado} />
        </div>
        {rechazado && <Input label="Tipo de material rechazado" value={tipoRechazado} onChange={setTipoRechazado} placeholder="Ej: escombros, residuos orgánicos..." />}
      </Card>

      {/* Retiro */}
      <Card style={{ padding: 20 }}>
        <SectionTitle>Retiro de contenedor</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: retiro ? 14 : 0 }}>
          <span style={{ fontSize: 13, color: C.gray900 }}>¿Hubo retiro hoy?</span>
          <Toggle value={retiro} onChange={setRetiro} />
        </div>
        {retiro && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Select label="Material retirado" value={materialRetirado} onChange={setMaterialRetirado}
              options={[{ value: "", label: "Seleccionar..." }, ...mats.map(m => ({ value: m.id, label: m.label }))]} />
            <Select label="Gestor que retiró" value={gestor} onChange={setGestor}
              options={[{ value: "", label: "Seleccionar..." }, ...gestores.filter(g => g.activo).map(g => ({ value: g.id, label: g.nombre }))]} />
          </div>
        )}
      </Card>

      {/* Observaciones */}
      <Card style={{ padding: 20 }}>
        <SectionTitle>Observaciones</SectionTitle>
        <textarea value={obs} onChange={e => setObs(e.target.value)} placeholder="Incidentes, situaciones relevantes..."
          style={{ width: "100%", minHeight: 80, border: `1px solid ${C.gray200}`, borderRadius: 8, color: C.gray900, padding: "10px 12px", fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
      </Card>

      <Btn size="lg" onClick={handleEnviar}>Enviar registro del día</Btn>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function ViewDashboard({ registros, materiales, gestores }) {
  const [filtroPeriodo, setFiltroPeriodo] = useState("semana_actual");
  const [filtroMaterial, setFiltroMaterial] = useState("todos");
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  const mats = materiales.filter(m => m.activo);
  const rango = calcularRangoPeriodo(filtroPeriodo);
  const inicioISO = toISO(rango.inicio);
  const finISO = toISO(rango.fin);
  const inicioAntISO = toISO(rango.inicioAnt);
  const finAntISO = toISO(rango.finAnt);

  const registrosPeriodo = registros.filter(r => r.fecha >= inicioISO && r.fecha <= finISO);
  const registrosPeriodoAnterior = registros.filter(r => r.fecha >= inicioAntISO && r.fecha <= finAntISO);

  const diasPeriodo = diasDelPeriodo(rango.inicio, rango.fin);
  const registrosPorFechaGlobal = Object.fromEntries(registros.map(r => [r.fecha, r]));

  const regSeleccionado = diaSeleccionado ? registrosPorFechaGlobal[diaSeleccionado] : null;
  const diaAnteriorISO = diaSeleccionado ? toISO(addDias(new Date(`${diaSeleccionado}T00:00:00`), -1)) : null;
  const regDiaAnterior = diaAnteriorISO ? registrosPorFechaGlobal[diaAnteriorISO] : null;

  // "Vista" = lo que efectivamente se muestra en el dashboard: un día
  // puntual si hay uno seleccionado en el selector de arriba, o el período
  // del filtro si no hay ninguno.
  const registrosVista = diaSeleccionado ? (regSeleccionado ? [regSeleccionado] : []) : registrosPeriodo;
  const registrosVistaAnterior = diaSeleccionado ? (regDiaAnterior ? [regDiaAnterior] : []) : registrosPeriodoAnterior;
  const diasVista = diaSeleccionado ? 1 : rango.dias;
  const labelVista = diaSeleccionado
    ? new Date(`${diaSeleccionado}T12:00:00`).toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })
    : rango.label;
  const labelComparacion = diaSeleccionado ? "día anterior" : "período anterior";
  const diasHeatmap = diaSeleccionado ? [diaSeleccionado] : diasPeriodo;

  function prom(regs, id) {
    if (!regs.length) return 0;
    return parseFloat((regs.reduce((a, r) => a + (r.ocupacion?.[id] ?? 0), 0) / regs.length).toFixed(1));
  }

  const diasRegistrados = registrosVista.length;
  const diasSinRegistro = Math.max(diasVista - diasRegistrados, 0);
  const cumplimiento = diasVista > 0 ? Math.round((diasRegistrados / diasVista) * 100) : 0;

  const stats = mats.map(m => ({
    ...m,
    promActual: prom(registrosVista, m.id),
    variacion: +(prom(registrosVista, m.id) - prom(registrosVistaAnterior, m.id)).toFixed(1),
  })).sort((a, b) => b.promActual - a.promActual);

  const statsFiltrados = filtroMaterial === "todos" ? stats : stats.filter(s => s.id === filtroMaterial);

  const criticos = stats.filter(s => s.promActual >= 4);
  const retiros = registrosVista.filter(r => r.retiro && r.materialRetirado);
  const rechazados = registrosVista.filter(r => r.rechazado);

  const retirosPorGestor = gestores.filter(g => g.activo)
    .map(g => ({ ...g, count: retiros.filter(r => r.gestor === g.id).length }))
    .filter(g => g.count > 0)
    .sort((a, b) => b.count - a.count);

  // Alertas
  const alertas = [];
  if (diasSinRegistro > 0) {
    const msgSinRegistro = diaSeleccionado
      ? `Sin registro para el día seleccionado (${labelVista})`
      : `${diasSinRegistro} día(s) sin registro en ${labelVista}`;
    alertas.push({ tipo: "registro", msg: msgSinRegistro, color: C.fucsia, bg: C.fucsiaLight });
  }
  criticos.forEach(m => alertas.push({ tipo: "saturacion", msg: `Saturación: ${m.label} promedio ${m.promActual}/5`, color: C.orange, bg: C.orangeLight }));
  stats.filter(s => s.variacion >= 1.5).forEach(m => alertas.push({ tipo: "subida", msg: `Subida relevante: ${m.label} +${m.variacion} vs ${labelComparacion}`, color: C.amber, bg: C.amberLight }));
  stats.filter(s => s.variacion <= -1.5).forEach(m => alertas.push({ tipo: "caida", msg: `Caída relevante: ${m.label} ${m.variacion} vs ${labelComparacion}`, color: C.teal, bg: C.tealLight }));

  const selectStyle = { padding: "7px 10px", border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 12, color: C.gray900, fontFamily: "inherit", background: C.white };
  const nombreArchivo = diaSeleccionado || filtroPeriodo;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Selector de día (30 días) — siempre arriba del todo */}
      <Card style={{ padding: 20 }}>
        <SectionTitle>Selecciona un día (últimos 30) para ver su detalle</SectionTitle>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
          {Array.from({ length: 30 }).map((_, i) => {
            const f = new Date(); f.setDate(f.getDate() - (29 - i));
            const fs = toISO(f);
            const reg = registrosPorFechaGlobal[fs];
            const sel = diaSeleccionado === fs;
            return (
              <button key={i} onClick={() => setDiaSeleccionado(sel ? null : fs)}
                style={{ width: 42, height: 50, flexShrink: 0, borderRadius: 8, cursor: "pointer", border: sel ? `2px solid ${C.teal}` : `2px solid ${reg ? C.tealLight : C.gray200}`, background: sel ? C.tealLight : reg ? C.white : C.gray100, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: reg ? C.gray900 : C.gray400 }}>{f.getDate()}</div>
                <div style={{ fontSize: 9, color: reg ? C.gray600 : C.gray400 }}>{f.toLocaleDateString("es-CL", { month: "short" })}</div>
                <div style={{ fontSize: 10, color: reg ? C.teal : C.gray400 }}>{reg ? "✓" : "—"}</div>
              </button>
            );
          })}
        </div>
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: C.teal, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Panel en tiempo real</div>
          <div style={{ fontSize: 19, fontWeight: 700, color: C.gray900 }}>Punto Limpio — Vitacura</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select value={filtroPeriodo} onChange={e => setFiltroPeriodo(e.target.value)} style={selectStyle}>
            <option value="semana_actual">Esta semana</option>
            <option value="semana_anterior">Semana anterior</option>
            <option value="mes_actual">Este mes</option>
            <option value="mes_anterior">Mes anterior</option>
            <option value="ultimos_30">Últimos 30 días</option>
          </select>
          <select value={filtroMaterial} onChange={e => setFiltroMaterial(e.target.value)} style={selectStyle}>
            <option value="todos">Todos los materiales</option>
            {mats.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
          <Btn variant="secondary" size="sm" onClick={() => exportarExcel(registrosVista, materiales, gestores, `punto-limpio_${nombreArchivo}.csv`)}>
            📥 Exportar Excel
          </Btn>
          <Btn variant="secondary" size="sm" onClick={() => exportarPDF({ rango: { label: labelVista, dias: diasVista }, statsFiltrados, alertas, retiros, retirosPorGestor, rechazados, diasRegistrados, cumplimiento })}>
            📄 Exportar reporte PDF
          </Btn>
        </div>
      </div>

      <IlustracionCiudad />

      {/* Detalle del día seleccionado */}
      {diaSeleccionado && (
        <Card style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: regSeleccionado ? 10 : 0 }}>
            <div style={{ fontSize: 13, color: C.gray600 }}>
              Mostrando: <strong style={{ color: C.gray900, textTransform: "capitalize" }}>{labelVista}</strong>
              {regSeleccionado && <span style={{ marginLeft: 8, fontWeight: 400 }}>por {regSeleccionado.usuario}</span>}
            </div>
            <Btn variant="ghost" size="sm" onClick={() => setDiaSeleccionado(null)}>Ver período ✕</Btn>
          </div>
          {!regSeleccionado && <div style={{ fontSize: 12, color: C.gray400 }}>Sin registro para este día.</div>}
          {regSeleccionado?.retiro && (
            <div style={{ padding: "8px 12px", background: C.tealLight, borderRadius: 8, fontSize: 12, color: C.teal, fontWeight: 600, marginBottom: 8 }}>
              🚛 Retiro: {materiales.find(m => m.id === regSeleccionado.materialRetirado)?.label} · {gestores.find(g => g.id === regSeleccionado.gestor)?.nombre}
            </div>
          )}
          {regSeleccionado?.rechazado && (
            <div style={{ padding: "8px 12px", background: C.fucsiaLight, borderRadius: 8, fontSize: 12, color: C.fucsia, fontWeight: 600, marginBottom: 8 }}>
              ⛔ Material rechazado: {regSeleccionado.tipoRechazado}
            </div>
          )}
          {regSeleccionado?.observaciones && (
            <div style={{ background: C.gray100, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: C.gray600, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Observaciones</div>
              <div style={{ fontSize: 13, color: C.gray900, lineHeight: 1.5 }}>{regSeleccionado.observaciones}</div>
            </div>
          )}
        </Card>
      )}

      {/* Métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
        {[
          { label: "Cumplimiento", valor: `${cumplimiento}%`, sub: `${diasRegistrados}/${diasVista} días con registro`, color: cumplimiento >= 80 ? C.teal : cumplimiento >= 50 ? C.amber : C.fucsia, bg: cumplimiento >= 80 ? C.tealLight : cumplimiento >= 50 ? C.amberLight : C.fucsiaLight },
          { label: "Días registrados", valor: diasRegistrados, sub: `de ${diasVista} en ${labelVista}`, color: C.teal, bg: C.tealLight },
          { label: "Sin registro", valor: diasSinRegistro, sub: "requieren atención", color: diasSinRegistro > 0 ? C.fucsia : C.teal, bg: diasSinRegistro > 0 ? C.fucsiaLight : C.tealLight },
          { label: "Alertas activas", valor: alertas.length, sub: labelVista, color: alertas.length > 0 ? C.orange : C.teal, bg: alertas.length > 0 ? C.orangeLight : C.tealLight },
          { label: "Retiros", valor: retiros.length, sub: labelVista, color: C.teal, bg: C.tealLight },
        ].map(m => (
          <Card key={m.label} style={{ padding: 14 }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.valor}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.gray900, marginTop: 4 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: C.gray600, marginTop: 1 }}>{m.sub}</div>
          </Card>
        ))}
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <Card style={{ padding: 16 }}>
          <SectionTitle color={C.orange}>⚠ Alertas activas</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {alertas.map((a, i) => (
              <div key={i} style={{ padding: "8px 12px", borderRadius: 8, background: a.bg, color: a.color, fontSize: 12, fontWeight: 600 }}>{a.msg}</div>
            ))}
          </div>
        </Card>
      )}

      {/* Barras */}
      <Card style={{ padding: 20 }}>
        <SectionTitle>Ocupación promedio — {labelVista}</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {statsFiltrados.map(m => (
            <div key={m.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <MaterialLabel material={m} style={{ fontSize: 13, color: C.gray900 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: m.variacion > 0.5 ? C.orange : m.variacion < -0.5 ? C.fucsia : C.gray400 }}>
                  {m.variacion > 0 ? "↑" : m.variacion < 0 ? "↓" : "="} {Math.abs(m.variacion)} vs {labelComparacion}
                </span>
              </div>
              <BarraH valor={Math.round(m.promActual) || 1} />
            </div>
          ))}
        </div>
      </Card>

      {/* Tendencia */}
      <Card style={{ padding: 20 }}>
        <SectionTitle>Tendencia por material — {labelVista}</SectionTitle>
        {registrosVista.length === 0 ? (
          <div style={{ fontSize: 12, color: C.gray400 }}>No hay registros para graficar la tendencia.</div>
        ) : (
          <HeatmapTendencia materiales={statsFiltrados} dias={diasHeatmap} registrosPorFecha={registrosPorFechaGlobal} />
        )}
      </Card>

      {/* Retiros y rechazados */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card style={{ padding: 16 }}>
          <SectionTitle>Retiros — {labelVista}</SectionTitle>
          {retiros.length === 0 ? <div style={{ fontSize: 12, color: C.gray400 }}>Sin retiros.</div> : (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                {retirosPorGestor.map(g => <Tag key={g.id} label={`${g.nombre}: ${g.count}`} color={C.teal} bg={C.tealLight} />)}
              </div>
              {retiros.slice(-5).map((r, i) => {
                const mat = materiales.find(m => m.id === r.materialRetirado);
                const gest = gestores.find(g => g.id === r.gestor);
                return (
                  <div key={i} style={{ fontSize: 12, color: C.gray900, marginBottom: 6, padding: "6px 8px", background: C.gray100, borderRadius: 6 }}>
                    <div style={{ fontWeight: 600 }}>{mat && <MaterialLabel material={mat} />}</div>
                    <div style={{ color: C.gray600 }}>{gest?.nombre} · {r.fecha}</div>
                  </div>
                );
              })}
            </>
          )}
        </Card>
        <Card style={{ padding: 16 }}>
          <SectionTitle color={C.fucsia}>Material rechazado</SectionTitle>
          {rechazados.length === 0 ? <div style={{ fontSize: 12, color: C.gray400 }}>Sin rechazos.</div> :
            rechazados.slice(-5).map((r, i) => (
              <div key={i} style={{ fontSize: 12, color: C.gray900, marginBottom: 6, padding: "6px 8px", background: C.fucsiaLight, borderRadius: 6 }}>
                <div style={{ fontWeight: 600, color: C.fucsia }}>{r.tipoRechazado}</div>
                <div style={{ color: C.gray600 }}>{r.fecha}</div>
              </div>
            ))}
        </Card>
      </div>
    </div>
  );
}

// ─── Admin Sistema ────────────────────────────────────────────────────────────
function ViewAdmin({ materiales, setMateriales, gestores, setGestores }) {
  const [tab, setTab] = useState("materiales");
  const [nuevoMat, setNuevoMat] = useState("");
  const [nuevoGest, setNuevoGest] = useState("");

  function addMat() {
    if (!nuevoMat.trim()) return;
    setMateriales(p => [...p, { id: `mat_${Date.now()}`, label: nuevoMat, activo: true }]);
    setNuevoMat("");
  }

  function addGest() {
    if (!nuevoGest.trim()) return;
    setGestores(p => [...p, { id: `gest_${Date.now()}`, nombre: nuevoGest, activo: true }]);
    setNuevoGest("");
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 10, color: C.teal, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Administración</div>
        <div style={{ fontSize: 19, fontWeight: 700, color: C.gray900 }}>Configuración del sistema</div>
      </div>
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.gray200}` }}>
        {["materiales", "gestores"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "10px 20px", background: "none", border: "none", borderBottom: tab === t ? `2px solid ${C.teal}` : "2px solid transparent", color: tab === t ? C.teal : C.gray600, cursor: "pointer", fontSize: 13, fontWeight: tab === t ? 700 : 400, fontFamily: "inherit", textTransform: "capitalize" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "materiales" && (
        <Card style={{ padding: 20 }}>
          <SectionTitle>Catálogo de materiales</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {materiales.map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", border: `1px solid ${C.gray200}`, borderRadius: 8 }}>
                <IconoContenedor color={colorMaterial(m.id)} />
                <span style={{ flex: 1, fontSize: 13, color: m.activo ? C.gray900 : C.gray400 }}>{m.label}</span>
                <Toggle value={m.activo} onChange={v => setMateriales(p => p.map(x => x.id === m.id ? { ...x, activo: v } : x))} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={nuevoMat} onChange={e => setNuevoMat(e.target.value)} placeholder="Nombre del nuevo material"
              style={{ flex: 1, padding: "9px 12px", border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 13, color: C.gray900, outline: "none", fontFamily: "inherit" }} />
            <Btn onClick={addMat}>Agregar</Btn>
          </div>
        </Card>
      )}

      {tab === "gestores" && (
        <Card style={{ padding: 20 }}>
          <SectionTitle>Catálogo de gestores</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {gestores.map(g => (
              <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", border: `1px solid ${C.gray200}`, borderRadius: 8 }}>
                <span style={{ flex: 1, fontSize: 13, color: g.activo ? C.gray900 : C.gray400 }}>🏢 {g.nombre}</span>
                <Toggle value={g.activo} onChange={v => setGestores(p => p.map(x => x.id === g.id ? { ...x, activo: v } : x))} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={nuevoGest} onChange={e => setNuevoGest(e.target.value)} placeholder="Nombre del nuevo gestor"
              style={{ flex: 1, padding: "9px 12px", border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 13, color: C.gray900, outline: "none", fontFamily: "inherit" }} />
            <Btn onClick={addGest}>Agregar</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [usuario, setUsuario] = useState(() => cargarUsuarioGuardado());
  const [materiales, setMateriales] = useState(MATERIALES_INIT);
  const [gestores, setGestores] = useState(GESTORES_INIT);
  const [registros, setRegistros] = useState(() => generarDemo(MATERIALES_INIT));
  const [vista, setVista] = useState(() => {
    const recuperado = cargarUsuarioGuardado();
    if (!recuperado) return "formulario";
    return recuperado.email === "admin@vitacura.cl" ? "dashboard" : "formulario";
  });

  function handleGuardar(reg) {
    setRegistros(prev => [...prev.filter(r => r.fecha !== reg.fecha), reg].sort((a, b) => a.fecha.localeCompare(b.fecha)));
  }

  function handleLogin(u) {
    setUsuario(u);
    setVista(u.rol === "recinto" ? "formulario" : "dashboard");
    guardarUsuarioSesion(u);
  }

  function handleLogout() {
    setUsuario(null);
    borrarUsuarioSesion();
  }

  if (!usuario) return <Login onLogin={handleLogin} />;

  const tabs = [];
  if (usuario.rol === "recinto" || usuario.rol === "sysadmin") tabs.push({ id: "formulario", label: "Registro diario" });
  if (usuario.rol !== "recinto") tabs.push({ id: "dashboard", label: "Panel" });
  if (usuario.rol === "sysadmin") tabs.push({ id: "admin", label: "Administración" });

  return (
    <div style={{ minHeight: "100vh", background: C.gray100, fontFamily: "'Inter', system-ui, sans-serif", color: C.gray900 }}>
      <div style={{ background: C.white, borderBottom: `1px solid ${C.gray200}` }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IconoLogo size={32} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gray900 }}>Punto Limpio Inteligente</div>
              <div style={{ fontSize: 10, color: C.gray600 }}>Municipalidad de Vitacura</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.gray900 }}>{usuario.nombre}</div>
              <div style={{ fontSize: 10, color: C.gray600 }}>{usuario.rol}</div>
            </div>
            <Btn variant="ghost" size="sm" onClick={handleLogout}>Salir</Btn>
          </div>
        </div>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 16px", display: "flex" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setVista(t.id)}
              style={{ padding: "10px 16px", background: "none", border: "none", borderBottom: vista === t.id ? `2px solid ${C.teal}` : "2px solid transparent", color: vista === t.id ? C.teal : C.gray600, cursor: "pointer", fontSize: 12, fontWeight: vista === t.id ? 700 : 400, fontFamily: "inherit", transition: "all 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {vista === "formulario" && <ViewFormulario registros={registros} materiales={materiales} gestores={gestores} usuario={usuario} onGuardar={handleGuardar} />}
      {vista === "dashboard" && <ViewDashboard registros={registros} materiales={materiales} gestores={gestores} />}
      {vista === "admin" && <ViewAdmin materiales={materiales} setMateriales={setMateriales} gestores={gestores} setGestores={setGestores} />}
    </div>
  );
}
