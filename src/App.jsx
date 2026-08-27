import { useState } from "react";

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
  { id: "papel_carton", label: "Papel y cartón", emoji: "📦", activo: true },
  { id: "vidrio", label: "Vidrio", emoji: "🍾", activo: true },
  { id: "latas", label: "Latas de aluminio", emoji: "🥫", activo: true },
  { id: "plastico_envases", label: "Envases plásticos", emoji: "🧴", activo: true },
  { id: "plastico_botellas", label: "Botellas plásticas", emoji: "🧃", activo: true },
  { id: "tetrapak", label: "Tetra pak", emoji: "🥛", activo: true },
  { id: "metal", label: "Metal y chatarra", emoji: "⚙️", activo: true },
  { id: "ropa", label: "Ropa", emoji: "👕", activo: true },
  { id: "electrodomesticos", label: "Electrónicos", emoji: "💻", activo: true },
  { id: "pilas", label: "Pilas y baterías", emoji: "🔋", activo: true },
  { id: "medicamentos", label: "Medicamentos vencidos", emoji: "💊", activo: true },
  { id: "cartridge", label: "Cartridge y tóner", emoji: "🖨️", activo: true },
];

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

function generarDemo(materiales) {
  const hoy = new Date();
  const regs = [];
  for (let i = 13; i >= 1; i--) {
    if (i === 5 || i === 10) continue;
    const f = new Date(hoy);
    f.setDate(hoy.getDate() - i);
    const ocupacion = {};
    materiales.filter(m => m.activo).forEach(m => {
      ocupacion[m.id] = Math.ceil(Math.random() * 5);
    });
    regs.push({
      id: `reg_${i}`,
      fecha: f.toISOString().split("T")[0],
      usuario: "Carlos Fuentes",
      ocupacion,
      rechazado: i === 3,
      tipoRechazado: i === 3 ? "Escombros" : "",
      retiro: i === 6,
      materialRetirado: i === 6 ? "papel_carton" : "",
      gestor: i === 6 ? "coaniquem" : "",
      observaciones: i === 3 ? "Se rechazó material de construcción. Usuario informado." : i === 7 ? "Alta afluencia. Cartón saturado antes del cierre." : "",
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
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.gray900 }}>{m.emoji} {m.label}</span>
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
  const [filtroSemana, setFiltroSemana] = useState("actual");
  const [filtroMaterial, setFiltroMaterial] = useState("todos");
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  const mats = materiales.filter(m => m.activo);

  const ultimos7 = registros.slice(-7);
  const anteriores7 = registros.slice(-14, -7);

  function prom(regs, id) {
    if (!regs.length) return 0;
    return parseFloat((regs.reduce((a, r) => a + (r.ocupacion?.[id] ?? 0), 0) / regs.length).toFixed(1));
  }

  const diasRegistrados = registros.slice(-14).length;
  const diasSinRegistro = 14 - diasRegistrados;

  const stats = mats.map(m => ({
    ...m,
    promActual: prom(ultimos7, m.id),
    variacion: +(prom(ultimos7, m.id) - prom(anteriores7, m.id)).toFixed(1),
  })).sort((a, b) => b.promActual - a.promActual);

  const statsFiltrados = filtroMaterial === "todos" ? stats : stats.filter(s => s.id === filtroMaterial);

  const criticos = stats.filter(s => s.promActual >= 4);
  const retiros = registros.filter(r => r.retiro && r.materialRetirado);
  const rechazados = registros.filter(r => r.rechazado);

  // Alertas
  const alertas = [];
  if (diasSinRegistro > 0) alertas.push({ tipo: "registro", msg: `${diasSinRegistro} día(s) sin registro en las últimas 2 semanas`, color: C.fucsia, bg: C.fucsiaLight });
  criticos.forEach(m => alertas.push({ tipo: "saturacion", msg: `Saturación: ${m.label} promedio ${m.promActual}/5`, color: C.orange, bg: C.orangeLight }));
  stats.filter(s => s.variacion >= 1.5).forEach(m => alertas.push({ tipo: "subida", msg: `Subida relevante: ${m.label} +${m.variacion} vs semana anterior`, color: C.amber, bg: C.amberLight }));
  stats.filter(s => s.variacion <= -1.5).forEach(m => alertas.push({ tipo: "caida", msg: `Caída relevante: ${m.label} ${m.variacion} vs semana anterior`, color: C.teal, bg: C.tealLight }));

  const regSeleccionado = diaSeleccionado ? registros.find(r => r.fecha === diaSeleccionado) : null;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: C.teal, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Panel en tiempo real</div>
          <div style={{ fontSize: 19, fontWeight: 700, color: C.gray900 }}>Punto Limpio — Vitacura</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={filtroSemana} onChange={e => setFiltroSemana(e.target.value)}
            style={{ padding: "7px 10px", border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 12, color: C.gray900, fontFamily: "inherit", background: C.white }}>
            <option value="actual">Esta semana</option>
            <option value="anterior">Semana anterior</option>
          </select>
          <select value={filtroMaterial} onChange={e => setFiltroMaterial(e.target.value)}
            style={{ padding: "7px 10px", border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 12, color: C.gray900, fontFamily: "inherit", background: C.white }}>
            <option value="todos">Todos los materiales</option>
            {mats.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>
      </div>

      {/* Métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
        {[
          { label: "Días registrados", valor: diasRegistrados, sub: "últimos 14", color: C.teal, bg: C.tealLight },
          { label: "Sin registro", valor: diasSinRegistro, sub: "requieren atención", color: diasSinRegistro > 0 ? C.fucsia : C.teal, bg: diasSinRegistro > 0 ? C.fucsiaLight : C.tealLight },
          { label: "Alertas activas", valor: alertas.length, sub: "esta semana", color: alertas.length > 0 ? C.orange : C.teal, bg: alertas.length > 0 ? C.orangeLight : C.tealLight },
          { label: "Retiros", valor: retiros.length, sub: "registrados", color: C.teal, bg: C.tealLight },
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
        <SectionTitle>Ocupación promedio — {filtroSemana === "actual" ? "esta semana" : "semana anterior"}</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {statsFiltrados.map(m => (
            <div key={m.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: C.gray900 }}>{m.emoji} {m.label}</span>
                {filtroSemana === "actual" && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: m.variacion > 0.5 ? C.orange : m.variacion < -0.5 ? C.fucsia : C.gray400 }}>
                    {m.variacion > 0 ? "↑" : m.variacion < 0 ? "↓" : "="} {Math.abs(m.variacion)} vs anterior
                  </span>
                )}
              </div>
              <BarraH valor={Math.round(m.promActual) || 1} />
            </div>
          ))}
        </div>
      </Card>

      {/* Retiros y rechazados */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card style={{ padding: 16 }}>
          <SectionTitle>Retiros registrados</SectionTitle>
          {retiros.length === 0 ? <div style={{ fontSize: 12, color: C.gray400 }}>Sin retiros este período.</div> :
            retiros.slice(-5).map((r, i) => {
              const mat = materiales.find(m => m.id === r.materialRetirado);
              const gest = gestores.find(g => g.id === r.gestor);
              return (
                <div key={i} style={{ fontSize: 12, color: C.gray900, marginBottom: 6, padding: "6px 8px", background: C.gray100, borderRadius: 6 }}>
                  <div style={{ fontWeight: 600 }}>{mat?.emoji} {mat?.label}</div>
                  <div style={{ color: C.gray600 }}>{gest?.nombre} · {r.fecha}</div>
                </div>
              );
            })}
        </Card>
        <Card style={{ padding: 16 }}>
          <SectionTitle color={C.fucsia}>Material rechazado</SectionTitle>
          {rechazados.length === 0 ? <div style={{ fontSize: 12, color: C.gray400 }}>Sin rechazos este período.</div> :
            rechazados.slice(-5).map((r, i) => (
              <div key={i} style={{ fontSize: 12, color: C.gray900, marginBottom: 6, padding: "6px 8px", background: C.fucsiaLight, borderRadius: 6 }}>
                <div style={{ fontWeight: 600, color: C.fucsia }}>{r.tipoRechazado}</div>
                <div style={{ color: C.gray600 }}>{r.fecha}</div>
              </div>
            ))}
        </Card>
      </div>

      {/* Historial */}
      <Card style={{ padding: 20 }}>
        <SectionTitle>Historial — selecciona un día para ver detalle</SectionTitle>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {Array.from({ length: 14 }).map((_, i) => {
            const f = new Date(); f.setDate(f.getDate() - (13 - i));
            const fs = f.toISOString().split("T")[0];
            const reg = registros.find(r => r.fecha === fs);
            const sel = diaSeleccionado === fs;
            return (
              <button key={i} onClick={() => reg && setDiaSeleccionado(sel ? null : fs)}
                style={{ width: 42, height: 50, borderRadius: 8, cursor: reg ? "pointer" : "default", border: sel ? `2px solid ${C.teal}` : `2px solid ${reg ? C.tealLight : C.gray200}`, background: sel ? C.tealLight : reg ? C.white : C.gray100, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: reg ? C.gray900 : C.gray200 }}>{f.getDate()}</div>
                <div style={{ fontSize: 9, color: reg ? C.gray600 : C.gray200 }}>{f.toLocaleDateString("es-CL", { month: "short" })}</div>
                <div style={{ fontSize: 10, color: reg ? C.teal : C.gray200 }}>{reg ? "✓" : "—"}</div>
              </button>
            );
          })}
        </div>

        {regSeleccionado && (
          <div style={{ paddingTop: 16, borderTop: `1px solid ${C.gray200}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.gray900, marginBottom: 12 }}>
              {new Date(diaSeleccionado + "T12:00:00").toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })}
              <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 400, color: C.gray600 }}>por {regSeleccionado.usuario}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              {mats.map(m => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, minWidth: 20 }}>{m.emoji}</span>
                  <span style={{ fontSize: 12, color: C.gray900, flex: 1 }}>{m.label}</span>
                  <div style={{ flex: 2 }}><BarraH valor={regSeleccionado.ocupacion?.[m.id] ?? 1} /></div>
                </div>
              ))}
            </div>
            {regSeleccionado.retiro && (
              <div style={{ padding: "8px 12px", background: C.tealLight, borderRadius: 8, fontSize: 12, color: C.teal, fontWeight: 600, marginBottom: 8 }}>
                🚛 Retiro: {materiales.find(m => m.id === regSeleccionado.materialRetirado)?.label} · {gestores.find(g => g.id === regSeleccionado.gestor)?.nombre}
              </div>
            )}
            {regSeleccionado.rechazado && (
              <div style={{ padding: "8px 12px", background: C.fucsiaLight, borderRadius: 8, fontSize: 12, color: C.fucsia, fontWeight: 600, marginBottom: 8 }}>
                ⛔ Material rechazado: {regSeleccionado.tipoRechazado}
              </div>
            )}
            {regSeleccionado.observaciones ? (
              <div style={{ background: C.gray100, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: C.gray600, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Observaciones</div>
                <div style={{ fontSize: 13, color: C.gray900, lineHeight: 1.5 }}>{regSeleccionado.observaciones}</div>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: C.gray400, fontStyle: "italic" }}>Sin observaciones.</div>
            )}
          </div>
        )}
      </Card>
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
    setMateriales(p => [...p, { id: `mat_${Date.now()}`, label: nuevoMat, emoji: "📦", activo: true }]);
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
                <span style={{ fontSize: 16 }}>{m.emoji}</span>
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
  const [usuario, setUsuario] = useState(null);
  const [materiales, setMateriales] = useState(MATERIALES_INIT);
  const [gestores, setGestores] = useState(GESTORES_INIT);
  const [registros, setRegistros] = useState(() => generarDemo(MATERIALES_INIT));
  const [vista, setVista] = useState("formulario");

  function handleGuardar(reg) {
    setRegistros(prev => [...prev.filter(r => r.fecha !== reg.fecha), reg].sort((a, b) => a.fecha.localeCompare(b.fecha)));
  }

  if (!usuario) return <Login onLogin={u => { setUsuario(u); setVista(u.rol === "recinto" ? "formulario" : "dashboard"); }} />;

  const tabs = [];
  if (usuario.rol === "recinto" || usuario.rol === "sysadmin") tabs.push({ id: "formulario", label: "Registro diario" });
  if (usuario.rol !== "recinto") tabs.push({ id: "dashboard", label: "Panel" });
  if (usuario.rol === "sysadmin") tabs.push({ id: "admin", label: "Administración" });

  return (
    <div style={{ minHeight: "100vh", background: C.gray100, fontFamily: "'Inter', system-ui, sans-serif", color: C.gray900 }}>
      <div style={{ background: C.white, borderBottom: `1px solid ${C.gray200}` }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>♻️</span>
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
            <Btn variant="ghost" size="sm" onClick={() => setUsuario(null)}>Salir</Btn>
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
