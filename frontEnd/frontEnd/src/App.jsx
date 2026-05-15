import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5106/api";
const POLL_INTERVAL = 5000;

// ── KaTeX ─────────────────────────────────────────────────────────────────────
function useKaTeX() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.katex) { setReady(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);
  return ready;
}

function Formula({ tex }) {
  const ready = useKaTeX();
  if (!ready) return <code className="formula-fallback">{tex}</code>;
  try {
    const html = window.katex.renderToString(tex, { throwOnError: false });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <code className="formula-fallback">{tex}</code>;
  }
}

// ── API calls ─────────────────────────────────────────────────────────────────
// POST /api/Jobs — crear job
async function apiCrearJob(payload) {
  const res = await fetch(`${API_BASE}/Jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json();
}

// GET /api/Jobs/{id} — consultar estado
async function apiGetJob(id) {
  const res = await fetch(`${API_BASE}/Jobs/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

// GET /api/Jobs/{id}/iterations — iteraciones
async function apiGetIteraciones(id) {
  try {
    const res = await fetch(`${API_BASE}/Jobs/${id}/iterations`);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

// GET /api/Jobs — historial
async function apiGetJobs() {
  try {
    const res = await fetch(`${API_BASE}/Jobs`);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

// ── Constantes ────────────────────────────────────────────────────────────────
// nombres exactos que espera la API (campo "metodo")
const METHODS = {
  "Newton-Raphson": { label: "Newton-Raphson", cat: "raices",   color: "#60a5fa", tex: "x_{n+1} = x_n - \\dfrac{f(x_n)}{f'(x_n)}" },
  "Secante":        { label: "Secante",         cat: "raices",   color: "#34d399", tex: "x_{n+1} = x_n - f(x_n)\\,\\dfrac{x_n - x_{n-1}}{f(x_n)-f(x_{n-1})}" },
  "Muller":         { label: "Müller",           cat: "raices",   color: "#f472b6", tex: "x_{n+1} = x_n - \\dfrac{2f(x_n)}{b \\pm \\sqrt{b^2-4f(x_n)\\,c}}" },
  "Gauss":          { label: "Gauss",            cat: "lineales", color: "#fb923c", tex: "A\\vec{x}=\\vec{b}\\xrightarrow{\\text{elim}}U\\vec{x}=\\vec{c}" },
  "Gauss-Seidel":   { label: "Gauss-Seidel",    cat: "lineales", color: "#a78bfa", tex: "x_i^{(k+1)}=\\dfrac{1}{a_{ii}}\\!\\left(b_i-\\!\\sum_{j\\neq i}\\!a_{ij}x_j^{(k)}\\right)" },
  "Gauss-Jordan":   { label: "Gauss-Jordan",    cat: "lineales", color: "#facc15", tex: "A\\vec{x}=\\vec{b}\\xrightarrow{\\text{RREF}}I\\vec{x}=\\vec{x}^*" },
};

const STATUS_INFO = {
  PENDING:  { label: "Pendiente",  color: "#f59e0b" },
  RUNNING:  { label: "Ejecutando", color: "#60a5fa" },
  DONE:     { label: "Completado", color: "#34d399" },
  FAILED:   { label: "Fallido",    color: "#f87171" },
};

function getStatus(s = "") {
  return STATUS_INFO[s.toUpperCase()] ?? { label: s, color: "#9ca3af" };
}

function StatusPill({ status }) {
  const s = getStatus(status);
  const running = (status || "").toUpperCase() === "RUNNING";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
      background: s.color + "22", color: s.color, border: `1px solid ${s.color}44`
    }}>
      {running && <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, animation: "pulse 1.2s infinite" }} />}
      {s.label}
    </span>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
// Construye el JSON de parámetros que espera el worker
function buildParametros(method, { x0, x1, x2, iters, tol }) {
  const base = { tolerancia: +tol, maxIteraciones: +iters };
  if (method === "Newton-Raphson") return { ...base, x0: +x0 };
  if (method === "Secante")        return { ...base, x0: +x0, x1: +x1 };
  if (method === "Muller")         return { ...base, x0: +x0, x1: +x1, x2: +x2 };
  // lineales: la matriz va directo en expresion
  return { ...base };
}

// ═════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [view,    setView]    = useState("form");
  const [method,  setMethod]  = useState("Newton-Raphson");
  const [func,    setFunc]    = useState("");
  const [x0,      setX0]      = useState("");
  const [x1,      setX1]      = useState("");
  const [x2,      setX2]      = useState("");
  const [iters,   setIters]   = useState("");
  const [tol,     setTol]     = useState("0.0001");
  const [matrix,  setMatrix]  = useState("");
  const [errors,  setErrors]  = useState({});

  const [activeJob,   setActiveJob]   = useState(null);
  const [jobResult,   setJobResult]   = useState(null);
  const [iterData,    setIterData]    = useState([]);
  const [pollCount,   setPollCount]   = useState(0);
  const [historyList, setHistoryList] = useState([]);
  const [apiHistory,  setApiHistory]  = useState([]);
  const [activeTab,   setActiveTab]   = useState("tabla");
  const [apiStatus,   setApiStatus]   = useState("unknown");

  const pollRef = useRef(null);

  const isLineal = METHODS[method]?.cat === "lineales";
  const showX1   = method === "Secante" || method === "Muller";
  const showX2   = method === "Muller";
  const color    = METHODS[method]?.color ?? "#60a5fa";

  // check API
  useEffect(() => {
    fetch(`${API_BASE}/Jobs`)
      .then(() => setApiStatus("ok"))
      .catch(() => setApiStatus("error"));
  }, []);

  // ── polling ──────────────────────────────────────────────────────────────
  function stopPolling() {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }

  function startPolling(jobId) {
    stopPolling(); setPollCount(0);
    pollRef.current = setInterval(async () => {
      try {
        const job = await apiGetJob(jobId);
        setPollCount(c => c + 1);
        const st = (job.estado ?? "").toUpperCase();
        if (st === "DONE" || st === "FAILED") {
          stopPolling();
          // pedir iteraciones
          const iters = await apiGetIteraciones(jobId);
          const record = { ...job, iterationsData: iters.length ? iters : [] };
          setJobResult(record);
          setIterData(record.iterationsData);
          setActiveJob(null);
          setHistoryList(h => [record, ...h].slice(0, 30));
        } else {
          setActiveJob(job);
        }
      } catch (err) {
        stopPolling(); setActiveJob(null);
        setJobResult({ estado: "FAILED", mensajeError: err.message });
      }
    }, POLL_INTERVAL);
  }

  useEffect(() => () => stopPolling(), []);

  // ── validación ───────────────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (isLineal) {
      if (!matrix.trim()) e.matrix = true;
    } else {
      if (!func.trim()) e.func = true;
      if (x0.trim() === "" || isNaN(+x0)) e.x0 = true;
      if (showX1 && (x1.trim() === "" || isNaN(+x1))) e.x1 = true;
      if (showX2 && (x2.trim() === "" || isNaN(+x2))) e.x2 = true;
      if (!iters || isNaN(+iters) || +iters < 1) e.iters = true;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── resolver ─────────────────────────────────────────────────────────────
  async function solve() {
    if (!validate()) return;
    stopPolling();
    setJobResult(null); setIterData([]); setActiveJob(null);
    setActiveTab("tabla");
    setView("result");

    // payload exacto que espera la API
    const parametros = buildParametros(method, { x0, x1, x2, iters, tol });
    const payload = {
      metodo:     method,
      expresion:  isLineal ? matrix : func,
      parametros: JSON.stringify(parametros),
    };

    try {
      const job = await apiCrearJob(payload);
      setActiveJob({ ...job, estado: "PENDING" });
      startPolling(job.id);
    } catch (err) {
      setJobResult({ estado: "FAILED", mensajeError: err.message });
    }
  }

  async function openHistory() {
    setView("history");
    const data = await apiGetJobs();
    setApiHistory(Array.isArray(data) ? data : []);
  }

  // ── chart data ────────────────────────────────────────────────────────────
  // iteraciones tienen: numero, valorX, error
  const chartData = iterData.map(r => ({
    iter:  r.numero ?? r.iteration ?? r.iteracion ?? 0,
    error: Math.max(+(r.error ?? 0), 1e-16),
    fx:    Math.abs(+(r.fx ?? r.f_value ?? 0)),
  }));

  const inp    = (key) => errors[key] ? "error" : "";
  const isDone = jobResult && (jobResult.estado ?? "").toUpperCase() === "DONE";
  const isFailed = jobResult && (jobResult.estado ?? "").toUpperCase() === "FAILED";

  // ════════════════════════════════════════════════════════════════════════════
  // VISTA: FORMULARIO
  // ════════════════════════════════════════════════════════════════════════════
  if (view === "form") return (
    <div className="page">
      <nav className="topnav">
        <span className="brand">Métodos Numéricos</span>
        <div className="nav-links">
          <span className="api-dot" style={{ background: apiStatus === "ok" ? "#34d399" : apiStatus === "error" ? "#f87171" : "#f59e0b" }} />
          <button className="nav-btn" onClick={openHistory}>Historial</button>
          <button className="nav-btn" onClick={() => setView("compare")}>Comparación</button>
        </div>
      </nav>

      <div className="form-page">
        <div className="form-hero">
          <h1>Plataforma de Métodos Numéricos</h1>
          <p>Selecciona un método, ingresa los parámetros y ejecuta el cálculo asíncrono</p>
        </div>

        <div className="form-card">

          {/* Selector métodos */}
          <div className="form-section">
            <label className="section-label">Método numérico</label>
            <div className="categories">
              {[["raices", "Búsqueda de Raíces"], ["lineales", "Sistemas Lineales Ax=b"]].map(([cat, catLabel]) => (
                <div key={cat}>
                  <p className="cat-label">{catLabel}</p>
                  <div className="method-grid">
                    {Object.entries(METHODS).filter(([, v]) => v.cat === cat).map(([key, val]) => (
                      <button key={key}
                        className={`method-chip ${method === key ? "active" : ""}`}
                        style={method === key
                          ? { background: val.color, borderColor: val.color, color: "#000", fontWeight: 800 }
                          : { borderColor: val.color + "44", color: val.color }}
                        onClick={() => { setMethod(key); setErrors({}); }}>
                        {val.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fórmula */}
          <div className="formula-preview" style={{ borderColor: color + "55" }}>
            <span className="formula-label">Fórmula</span>
            <Formula tex={METHODS[method].tex} />
          </div>

          {/* Inputs sistemas lineales */}
          {isLineal && (
            <div className="form-section">
              <label className="section-label">Matriz aumentada [A|b]</label>
              <p className="hint">Filas con <code>;</code> · columnas con <code>,</code> · Ej: <code>2,1,-1,8; -3,-1,2,-11; -2,1,2,-3</code></p>
              <textarea rows={3} placeholder="2,1,-1,8; -3,-1,2,-11; -2,1,2,-3"
                value={matrix} className={`field ${inp("matrix")}`}
                onChange={e => { setMatrix(e.target.value); setErrors(er => ({ ...er, matrix: false })); }} />
              {errors.matrix && <p className="err">Ingresa la matriz aumentada</p>}
              <div className="row2" style={{ marginTop: 12 }}>
                <div>
                  <label className="section-label">Iteraciones máx.</label>
                  <input type="number" placeholder="100" value={iters} className={`field ${inp("iters")}`}
                    onChange={e => { setIters(e.target.value); setErrors(er => ({ ...er, iters: false })); }} />
                </div>
                <div>
                  <label className="section-label">Tolerancia</label>
                  <input type="text" placeholder="0.0001" value={tol} className="field"
                    onChange={e => setTol(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Inputs raíces */}
          {!isLineal && (
            <div className="form-section">
              <label className="section-label">Función f(x)</label>
              <input type="text" placeholder="Ej: x**3 - x - 2" value={func}
                className={`field ${inp("func")}`}
                onChange={e => { setFunc(e.target.value); setErrors(er => ({ ...er, func: false })); }} />
              {errors.func && <p className="err">Ingresa una función válida</p>}
              <p className="hint">Usa <code>**</code> para potencias · <code>sqrt()</code> · <code>sin()</code> · <code>exp()</code></p>

              <div className="row2" style={{ marginTop: 14 }}>
                <div>
                  <label className="section-label">{method === "Newton-Raphson" ? "x₀ — Valor inicial" : "x₀ — Primer valor"}</label>
                  <input type="number" placeholder="x₀" value={x0} className={`field ${inp("x0")}`}
                    onChange={e => { setX0(e.target.value); setErrors(er => ({ ...er, x0: false })); }} />
                  {errors.x0 && <p className="err">Requerido</p>}
                </div>
                {showX1 && (
                  <div>
                    <label className="section-label">x₁ — Segundo valor</label>
                    <input type="number" placeholder="x₁" value={x1} className={`field ${inp("x1")}`}
                      onChange={e => { setX1(e.target.value); setErrors(er => ({ ...er, x1: false })); }} />
                    {errors.x1 && <p className="err">Requerido</p>}
                  </div>
                )}
                {showX2 && (
                  <div>
                    <label className="section-label">x₂ — Tercer valor</label>
                    <input type="number" placeholder="x₂" value={x2} className={`field ${inp("x2")}`}
                      onChange={e => { setX2(e.target.value); setErrors(er => ({ ...er, x2: false })); }} />
                    {errors.x2 && <p className="err">Requerido</p>}
                  </div>
                )}
              </div>

              <div className="row2" style={{ marginTop: 14 }}>
                <div>
                  <label className="section-label">Iteraciones máximas</label>
                  <input type="number" placeholder="50" value={iters} className={`field ${inp("iters")}`}
                    onChange={e => { setIters(e.target.value); setErrors(er => ({ ...er, iters: false })); }} />
                  {errors.iters && <p className="err">Requerido</p>}
                </div>
                <div>
                  <label className="section-label">Tolerancia</label>
                  <input type="text" placeholder="0.0001" value={tol} className="field"
                    onChange={e => setTol(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          <button className="btn-resolve" style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
            onClick={solve}>
            Resolver →
          </button>
        </div>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // VISTA: RESULTADO
  // ════════════════════════════════════════════════════════════════════════════
  if (view === "result") return (
    <div className="page">
      <nav className="topnav">
        <button className="back-btn" onClick={() => { stopPolling(); setView("form"); }}>← Volver</button>
        <span className="brand">Resultado</span>
        <div className="nav-links">
          <button className="nav-btn" onClick={openHistory}>Historial</button>
          <button className="nav-btn" onClick={() => setView("compare")}>Comparación</button>
        </div>
      </nav>

      <div className="result-page">

        {/* Procesando */}
        {activeJob && (
          <div className="processing-card" style={{ borderColor: color + "44" }}>
            <div className="spinner" style={{ borderTopColor: color }} />
            <div>
              <p className="proc-title" style={{ color }}>Ejecutando job de forma asíncrona…</p>
              <p className="proc-sub">
                Consultando API cada {POLL_INTERVAL / 1000}s · Consulta #{pollCount} · Job ID: <code>{activeJob.id ?? "—"}</code>
              </p>
            </div>
            <button className="cancel-sm" onClick={() => { stopPolling(); setActiveJob(null); }}>✕</button>
          </div>
        )}

        {/* Error */}
        {isFailed && !activeJob && (
          <div className="error-card">
            <strong>⚠️ Job fallido</strong>
            <p>{jobResult.mensajeError ?? "Revisa los parámetros o el backend."}</p>
          </div>
        )}

        {!jobResult && !activeJob && (
          <div className="waiting-card">Enviando job a la API…</div>
        )}

        {/* RESULTADO COMPLETO */}
        {isDone && (
          <>
            <div className="res-header" style={{ borderColor: color + "55" }}>
              <div>
                <span className="res-method" style={{ color }}>{METHODS[jobResult.metodo]?.label ?? jobResult.metodo}</span>
                <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                  <StatusPill status={jobResult.estado} />
                  {jobResult.converged === true  && <span className="badge green">Convergió ✓</span>}
                  {jobResult.converged === false && <span className="badge red">No convergió</span>}
                </div>
              </div>
              <div className="formula-sm" style={{ borderColor: color + "33" }}>
                <Formula tex={METHODS[jobResult.metodo]?.tex ?? ""} />
              </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              {[
                { label: "Resultado / Raíz", value: jobResult.resultado ?? "—", color },
                { label: "Error final",      value: jobResult.errorFinal != null ? Number(jobResult.errorFinal).toExponential(4) : "—", color: "#94a3b8" },
                { label: "Iteraciones",      value: jobResult.iteracionesTotal ?? iterData.length ?? "—", color: "#94a3b8" },
                { label: "Convergió",        value: jobResult.converged === true ? "Sí" : jobResult.converged === false ? "No" : "—",
                  color: jobResult.converged ? "#34d399" : jobResult.converged === false ? "#f87171" : "#94a3b8" },
                { label: "Tolerancia",       value: tol, color: "#94a3b8" },
                { label: "Expresión",        value: jobResult.expresion ?? "—", color: "#94a3b8" },
              ].map(s => (
                <div className="stat-card" key={s.label}>
                  <span className="stat-label">{s.label}</span>
                  <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Tabs tabla / gráfica */}
            {iterData.length > 0 && (
              <div className="content-card">
                <div className="tabs">
                  <button className={`tab ${activeTab === "tabla" ? "active" : ""}`}
                    style={activeTab === "tabla" ? { borderColor: color, color } : {}}
                    onClick={() => setActiveTab("tabla")}>📋 Tabla de iteraciones</button>
                  <button className={`tab ${activeTab === "grafica" ? "active" : ""}`}
                    style={activeTab === "grafica" ? { borderColor: color, color } : {}}
                    onClick={() => setActiveTab("grafica")}>📈 Gráfica de convergencia</button>
                </div>

                {/* Tabla — campos: numero, valorX, error */}
                {activeTab === "tabla" && (
                  <div className="tbl-wrap">
                    <table className="iter-table">
                      <thead>
                        <tr>
                          <th>Iteración</th>
                          <th>x (valorX)</th>
                          <th>Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {iterData.map((r, i) => (
                          <tr key={i}>
                            <td>{r.numero ?? i + 1}</td>
                            <td><code>{r.valorX != null ? Number(r.valorX).toPrecision(10) : "—"}</code></td>
                            <td><code>{r.error != null ? Number(r.error).toExponential(4) : "—"}</code></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Gráfica */}
                {activeTab === "grafica" && (
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="iter" tick={{ fill: "#64748b", fontSize: 11 }}
                          label={{ value: "Iteración", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 11 }} />
                        <YAxis scale="log" domain={["auto", "auto"]} tick={{ fill: "#64748b", fontSize: 11 }} />
                        <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 11 }}
                          formatter={v => v.toExponential(4)} />
                        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                        <Line type="monotone" dataKey="error" name="Error abs."
                          stroke={color} dot={false} strokeWidth={2.5} />
                      </LineChart>
                    </ResponsiveContainer>
                    <p style={{ textAlign: "center", color: "#475569", fontSize: 11, marginTop: 4 }}>
                      Escala logarítmica — error vs. iteración
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // VISTA: HISTORIAL
  // ════════════════════════════════════════════════════════════════════════════
  if (view === "history") {
    const all = apiHistory.length ? apiHistory : historyList;
    return (
      <div className="page">
        <nav className="topnav">
          <button className="back-btn" onClick={() => setView("form")}>← Volver</button>
          <span className="brand">Historial de Jobs</span>
          <div className="nav-links">
            <button className="nav-btn" onClick={() => setView("compare")}>Comparación</button>
          </div>
        </nav>

        <div className="list-page">
          {all.length === 0 && (
            <div className="empty-state"><p>Sin historial aún. Resuelve un job primero.</p></div>
          )}
          {all.map((item, i) => {
            const m = METHODS[item.metodo];
            const c = m?.color ?? "#60a5fa";
            return (
              <div className="hist-card" key={i} style={{ borderColor: c + "33" }}>
                <div className="hist-top">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span className="hist-method" style={{ color: c, background: c + "18" }}>{m?.label ?? item.metodo}</span>
                    <StatusPill status={item.estado} />
                    {item.converged === true  && <span className="badge green">Convergió ✓</span>}
                    {item.converged === false && <span className="badge red">No convergió</span>}
                  </div>
                  <span className="hist-date">{item.fechaCreacion ? new Date(item.fechaCreacion).toLocaleString() : ""}</span>
                </div>
                <p className="hist-func"><code>{item.expresion ?? "—"}</code></p>
                <div className="hist-stats">
                  {item.resultado && <span>Resultado: <strong style={{ color: c }}>{item.resultado}</strong></span>}
                  <span>Iteraciones: <strong>{item.iteracionesTotal ?? "—"}</strong></span>
                  {item.errorFinal != null && <span>Error final: <strong>{Number(item.errorFinal).toExponential(4)}</strong></span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // VISTA: COMPARACIÓN
  // ════════════════════════════════════════════════════════════════════════════
  if (view === "compare") return (
    <div className="page">
      <nav className="topnav">
        <button className="back-btn" onClick={() => setView("form")}>← Volver</button>
        <span className="brand">Comparación de Métodos</span>
        <div className="nav-links">
          <button className="nav-btn" onClick={openHistory}>Historial</button>
        </div>
      </nav>

      <div className="list-page">
        {historyList.length === 0 && (
          <div className="empty-state"><p>Resuelve jobs con distintos métodos para compararlos aquí.</p></div>
        )}

        {historyList.length > 0 && (
          <>
            <div className="content-card" style={{ marginBottom: 24 }}>
              <h3 className="card-title">Resumen comparativo</h3>
              <div className="tbl-wrap">
                <table className="iter-table">
                  <thead>
                    <tr>
                      <th>Método</th>
                      <th>Expresión</th>
                      <th>Resultado</th>
                      <th>Iteraciones</th>
                      <th>Error final</th>
                      <th>Convergió</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyList.map((h, i) => {
                      const m = METHODS[h.metodo];
                      const c = m?.color ?? "#60a5fa";
                      return (
                        <tr key={i}>
                          <td><span style={{ color: c, fontWeight: 700 }}>{m?.label ?? h.metodo}</span></td>
                          <td><code style={{ fontSize: 11 }}>{h.expresion ?? "—"}</code></td>
                          <td><code>{h.resultado ?? "—"}</code></td>
                          <td>{h.iteracionesTotal ?? "—"}</td>
                          <td><code>{h.errorFinal != null ? Number(h.errorFinal).toExponential(4) : "—"}</code></td>
                          <td>
                            {h.converged === true  ? <span className="badge green">Sí</span>
                             : h.converged === false ? <span className="badge red">No</span> : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gráfica superpuesta */}
            {historyList.some(h => h.iterationsData?.length > 0) && (
              <div className="content-card">
                <h3 className="card-title">Curvas de convergencia superpuestas</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart margin={{ top: 10, right: 24, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="iter" type="number"
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      label={{ value: "Iteración", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 11 }} />
                    <YAxis scale="log" domain={["auto", "auto"]} tick={{ fill: "#64748b", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 11 }}
                      formatter={v => v.toExponential(4)} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                    {historyList.filter(h => h.iterationsData?.length > 0).map((h, i) => {
                      const data = h.iterationsData.map(r => ({
                        iter:  r.numero ?? 0,
                        error: Math.max(+(r.error ?? 0), 1e-16),
                      }));
                      return (
                        <Line key={i} data={data} type="monotone" dataKey="error"
                          name={METHODS[h.metodo]?.label ?? h.metodo}
                          stroke={METHODS[h.metodo]?.color ?? "#60a5fa"}
                          dot={false} strokeWidth={2} />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
                <p style={{ textAlign: "center", color: "#475569", fontSize: 11, marginTop: 4 }}>
                  Escala logarítmica — error vs. iteración por método
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return null;
}
