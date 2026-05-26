import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

<<<<<<< HEAD
const API_BASE = "http://localhost:5000/api";
const POLL_INTERVAL = 5000;

=======
// ── CONFIG ────────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5000/api";
const POLL_INTERVAL = 5000;

// ── KaTeX ─────────────────────────────────────────────────────────────────────
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
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

<<<<<<< HEAD
async function apiCrearJob(payload) {
  const res = await fetch(`${API_BASE}/Jobs`, {
    method: "POST", headers: { "Content-Type": "application/json" },
=======
// ── API calls ─────────────────────────────────────────────────────────────────
// POST /api/Jobs — crear job
async function apiCrearJob(payload) {
  const res = await fetch(`${API_BASE}/Jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json();
}
<<<<<<< HEAD
=======

// GET /api/Jobs/{id} — consultar estado
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
async function apiGetJob(id) {
  const res = await fetch(`${API_BASE}/Jobs/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
<<<<<<< HEAD
=======

// GET /api/Jobs/{id}/iterations — iteraciones
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
async function apiGetIteraciones(id) {
  try {
    const res = await fetch(`${API_BASE}/Jobs/${id}/iterations`);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}
<<<<<<< HEAD
=======

// GET /api/Jobs — historial
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
async function apiGetJobs() {
  try {
    const res = await fetch(`${API_BASE}/Jobs`);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

<<<<<<< HEAD
const METHOD_KEYS = ["Newton-Raphson","Secante","Muller","Gauss","Gauss-Seidel","Gauss-Jordan"];

=======
// ── Constantes ────────────────────────────────────────────────────────────────
// nombres exactos que espera la API (campo "metodo")
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
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

<<<<<<< HEAD
function getStatus(s = "") { return STATUS_INFO[s.toUpperCase()] ?? { label: s, color: "#9ca3af" }; }
=======
function getStatus(s = "") {
  return STATUS_INFO[s.toUpperCase()] ?? { label: s, color: "#9ca3af" };
}
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9

function StatusPill({ status }) {
  const s = getStatus(status);
  const running = (status || "").toUpperCase() === "RUNNING";
  return (
    <span style={{
<<<<<<< HEAD
      display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",
      borderRadius:999,fontSize:11,fontWeight:700,
      background:s.color+"22",color:s.color,border:`1px solid ${s.color}44`
    }}>
      {running && <span style={{width:6,height:6,borderRadius:"50%",background:s.color,animation:"pulse 1.2s infinite"}}/>}
=======
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
      background: s.color + "22", color: s.color, border: `1px solid ${s.color}44`
    }}>
      {running && <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, animation: "pulse 1.2s infinite" }} />}
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
      {s.label}
    </span>
  );
}

<<<<<<< HEAD
function parseDatosAdicionales(row) {
  if (!row?.datosAdicionales) return {};
  try {
    return typeof row.datosAdicionales === "string"
      ? JSON.parse(row.datosAdicionales)
      : row.datosAdicionales;
  } catch {
    return {};
  }
}

function cleanValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  const text = String(value)
    .replace("+0j", "")
    .replace("(", "")
    .replace(")", "");
  return text;
}

function formatNumber(value, digits = 6) {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return cleanValue(value);
  return Math.abs(num) >= 1000 || Math.abs(num) < 0.0001
    ? num.toExponential(4)
    : num.toPrecision(digits);
}

function formatPercent(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const num = Number(value);

  if (Number.isNaN(num)) {
    return cleanValue(value);
  }

  return `${num.toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6
  })}%`;
}
function IterationTable({ rows, metodo, lineColor }) {
  const methodName = (metodo || "").toLowerCase();

  if (methodName.includes("muller")) {
    return (
      <div className="tbl-wrap">
        <table className="iter-table">
          <thead>
            <tr>
              <th>#</th>
              <th>x0</th>
              <th>x1</th>
              <th>x2</th>
              <th>Error relativo</th>
              <th>Error porcentual</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const d = parseDatosAdicionales(r);
              return (
                <tr key={i}>
                  <td style={{color:"#64748b"}}>{r.numeroIteracion ?? r.numero ?? i + 1}</td>
                  <td><code style={{color:lineColor}}>{formatNumber(cleanValue(d.x0), 10)}</code></td>
                  <td><code style={{color:lineColor}}>{formatNumber(cleanValue(d.x1), 10)}</code></td>
                  <td><code style={{color:lineColor}}>{formatNumber(cleanValue(d.x2), 10)}</code></td>
                  <td><code style={{color:"#f59e0b"}}>{formatNumber(d.errorRelativo, 6)}</code></td>
                  <td><code style={{color:"#f59e0b"}}>{formatPercent(d.errorPorcentual ?? r.error)}</code></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  if (methodName.includes("newton") || methodName.includes("secante")) {
    return (
      <div className="tbl-wrap">
        <table className="iter-table">
          <thead>
            <tr>
              <th>#</th>
              <th>x anterior</th>
              <th>x nuevo</th>
              <th>Error relativo</th>
              <th>Error porcentual</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const d = parseDatosAdicionales(r);
              return (
                <tr key={i}>
                  <td style={{color:"#64748b"}}>{r.numeroIteracion ?? r.numero ?? i + 1}</td>
                  <td><code style={{color:lineColor}}>{formatNumber(d.xAnterior, 10)}</code></td>
                  <td><code style={{color:lineColor}}>{formatNumber(d.xNuevo ?? r.valorX, 10)}</code></td>
                  <td><code style={{color:"#f59e0b"}}>{formatNumber(d.errorRelativo, 6)}</code></td>
                  <td><code style={{color:"#f59e0b"}}>{formatPercent(d.errorPorcentual ?? r.error)}</code></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="tbl-wrap">
      <table className="iter-table">
        <thead><tr><th>#</th><th>x</th><th>Error</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={{color:"#64748b"}}>{r.numeroIteracion ?? r.numero ?? i + 1}</td>
              <td><code style={{color:lineColor}}>{cleanValue(r.valorX)}</code></td>
              <td><code style={{color:"#f59e0b"}}>{r.error != null ? Number(r.error).toExponential(4) : "—"}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

=======
// ── Helpers ───────────────────────────────────────────────────────────────────
// Construye el JSON de parámetros que espera el worker
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
function buildParametros(method, { x0, x1, x2, iters, tol }) {
  const base = { tolerancia: +tol, maxIteraciones: +iters };
  if (method === "Newton-Raphson") return { ...base, x0: +x0 };
  if (method === "Secante")        return { ...base, x0: +x0, x1: +x1 };
  if (method === "Muller")         return { ...base, x0: +x0, x1: +x1, x2: +x2 };
<<<<<<< HEAD
  return { ...base };
}

=======
  // lineales: la matriz va directo en expresion
  return { ...base };
}

// ═════════════════════════════════════════════════════════════════════════════
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
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
<<<<<<< HEAD
  const [matrixCells, setMatrixCells] = useState({});
  const [errors,  setErrors]  = useState({});
=======
  const [errors,  setErrors]  = useState({});

>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
  const [activeJob,   setActiveJob]   = useState(null);
  const [jobResult,   setJobResult]   = useState(null);
  const [iterData,    setIterData]    = useState([]);
  const [pollCount,   setPollCount]   = useState(0);
  const [historyList, setHistoryList] = useState([]);
  const [apiHistory,  setApiHistory]  = useState([]);
<<<<<<< HEAD
  const [selectedJob, setSelectedJob] = useState(null); // job seleccionado del historial
  const [activeTab,   setActiveTab]   = useState("tabla");
  const [apiStatus,   setApiStatus]   = useState("unknown");
  const [elapsedTime, setElapsedTime] = useState(null);

  const pollRef     = useRef(null);
  const startTimeRef = useRef(null);
  const refFunc   = useRef(null);
  const refX0     = useRef(null);
  const refX1     = useRef(null);
  const refX2     = useRef(null);
  const refIters  = useRef(null);
  const refTol    = useRef(null);
  const refResolve = useRef(null);
  const refMatrix = useRef(null);
=======
  const [activeTab,   setActiveTab]   = useState("tabla");
  const [apiStatus,   setApiStatus]   = useState("unknown");

  const pollRef = useRef(null);
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9

  const isLineal = METHODS[method]?.cat === "lineales";
  const showX1   = method === "Secante" || method === "Muller";
  const showX2   = method === "Muller";
  const color    = METHODS[method]?.color ?? "#60a5fa";

<<<<<<< HEAD
  // secuencia de refs según método activo
  const fieldSeq = isLineal
    ? [refMatrix, refIters, refTol]
    : showX2  ? [refFunc, refX0, refX1, refX2, refIters, refTol]
    : showX1  ? [refFunc, refX0, refX1, refIters, refTol]
    :           [refFunc, refX0, refIters, refTol];

  // Enter avanza al siguiente campo, en el último resuelve
  const onKey = (ref) => (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const idx = fieldSeq.indexOf(ref);
    if (idx < fieldSeq.length - 1) {
      fieldSeq[idx + 1]?.current?.focus();
    } else {
      solve();
    }
  };

  // ← → cambia método cuando no hay foco en un input
  useEffect(() => {
    if (view !== "form") return;
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setMethod(m => { const i = METHOD_KEYS.indexOf(m); return METHOD_KEYS[(i+1)%METHOD_KEYS.length]; });
        setErrors({});
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setMethod(m => { const i = METHOD_KEYS.indexOf(m); return METHOD_KEYS[(i-1+METHOD_KEYS.length)%METHOD_KEYS.length]; });
        setErrors({});
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view]);

  useEffect(() => {
    fetch(`${API_BASE}/Jobs`).then(() => setApiStatus("ok")).catch(() => setApiStatus("error"));
  }, []);

=======
  // check API
  useEffect(() => {
    fetch(`${API_BASE}/Jobs`)
      .then(() => setApiStatus("ok"))
      .catch(() => setApiStatus("error"));
  }, []);

  // ── polling ──────────────────────────────────────────────────────────────
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
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
<<<<<<< HEAD
          const iters = await apiGetIteraciones(jobId);
          const elapsed = startTimeRef.current ? ((performance.now() - startTimeRef.current) / 1000).toFixed(3) + " s" : null;
          const record = { ...job, iterationsData: iters.length ? iters : [] };
          setElapsedTime(elapsed);
          setJobResult(record); setIterData(record.iterationsData); setActiveJob(null);
          setHistoryList(h => [record, ...h].slice(0, 30));
        } else { setActiveJob(job); }
=======
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
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
      } catch (err) {
        stopPolling(); setActiveJob(null);
        setJobResult({ estado: "FAILED", mensajeError: err.message });
      }
    }, POLL_INTERVAL);
  }

  useEffect(() => () => stopPolling(), []);

<<<<<<< HEAD
  function validate() {
    const e = {};
    if (isLineal) {
      let allFilled = true;
      for(let i=0;i<3;i++) for(let j=0;j<4;j++){
        const v = matrixCells[`m${i}${j}`];
        if(v===undefined||v===""||isNaN(+v)) { allFilled=false; break; }
      }
      if(!allFilled) e.matrix = true;
=======
  // ── validación ───────────────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (isLineal) {
      if (!matrix.trim()) e.matrix = true;
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
    } else {
      if (!func.trim()) e.func = true;
      if (x0.trim() === "" || isNaN(+x0)) e.x0 = true;
      if (showX1 && (x1.trim() === "" || isNaN(+x1))) e.x1 = true;
      if (showX2 && (x2.trim() === "" || isNaN(+x2))) e.x2 = true;
<<<<<<< HEAD
      if (method === "Secante" && !e.x0 && !e.x1 && +x0 === +x1) e.x1Same = true;
      if (method === "Muller" && !e.x0 && !e.x1 && !e.x2 && (+x0 === +x1 || +x1 === +x2 || +x0 === +x2)) e.mullerSame = true;
      if (!iters || isNaN(+iters) || +iters < 1) e.iters = true;
      if (+iters > 1000) e.itersMax = true;
      if (!tol || isNaN(+tol) || +tol <= 0) e.tol = true;
=======
      if (!iters || isNaN(+iters) || +iters < 1) e.iters = true;
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

<<<<<<< HEAD
  async function solve() {
    if (!validate()) return;
    stopPolling(); setJobResult(null); setIterData([]); setActiveJob(null); setElapsedTime(null);
    startTimeRef.current = performance.now();
    setActiveTab("tabla"); setView("result");
    const parametros = buildParametros(method, { x0, x1, x2, iters, tol });
    const payload = { metodo: method, expresion: isLineal ? matrix : func.toLowerCase(), parametros: JSON.stringify(parametros) };
=======
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

>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
    try {
      const job = await apiCrearJob(payload);
      setActiveJob({ ...job, estado: "PENDING" });
      startPolling(job.id);
<<<<<<< HEAD
    } catch (err) { setJobResult({ estado: "FAILED", mensajeError: err.message }); }
  }

  async function openJobDetail(job) {
    // si ya tiene iterationsData usarlo, si no pedirlo a la API
    if (job.iterationsData && job.iterationsData.length > 0) {
      setSelectedJob(job);
      setIterData(job.iterationsData);
    } else {
      const iters = await apiGetIteraciones(job.id);
      const record = { ...job, iterationsData: iters };
      setSelectedJob(record);
      setIterData(iters);
    }
    setJobResult(null);
    setActiveJob(null);
    setActiveTab("tabla");
    setView("jobdetail");
=======
    } catch (err) {
      setJobResult({ estado: "FAILED", mensajeError: err.message });
    }
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
  }

  async function openHistory() {
    setView("history");
    const data = await apiGetJobs();
    setApiHistory(Array.isArray(data) ? data : []);
  }

<<<<<<< HEAD
  const chartData = iterData.map(r => ({
    iter:  r.numeroIteracion ?? r.numero ?? r.iteration ?? r.iteracion ?? 0,
    error: Math.max(+(r.error ?? 0), 1e-16),
  }));

  const inp      = (key) => errors[key] ? "error" : "";
  const isDone   = jobResult && (jobResult.estado ?? "").toUpperCase() === "DONE";
  const isFailed = jobResult && (jobResult.estado ?? "").toUpperCase() === "FAILED";

  // ══ FORMULARIO ══════════════════════════════════════════════════════════════
  if (view === "form") return (
    <div className="page">
      <nav className="topnav">
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span className="brand">⚡ Métodos Numéricos</span>
          <span className="api-indicator" style={{
            background: apiStatus==="ok"?"#34d39918":"#f8717118",
            color: apiStatus==="ok"?"#34d399":"#f87171",
            border:`1px solid ${apiStatus==="ok"?"#34d39940":"#f8717140"}`,
          }}>
            <span className="api-dot" style={{background: apiStatus==="ok"?"#34d399":"#f87171"}}/>
            {apiStatus==="ok"?"API online":apiStatus==="error"?"API offline":"Conectando…"}
          </span>
        </div>
        <div className="nav-links">
          {jobResult && (jobResult.estado ?? "").toUpperCase() === "DONE" && (
            <button className="nav-btn nav-btn-result" onClick={() => setView("result")}>⚡ Último resultado</button>
          )}
          <button className="nav-btn" onClick={openHistory}>📋 Historial</button>
          <button className="nav-btn" onClick={()=>{setView("compare");apiGetJobs().then(d=>setApiHistory(Array.isArray(d)?d:[]));}} >📊 Comparación</button>
=======
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
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
        </div>
      </nav>

      <div className="form-page">
        <div className="form-hero">
          <h1>Plataforma de Métodos Numéricos</h1>
<<<<<<< HEAD
          <p>Usa <kbd>←</kbd><kbd>→</kbd> para cambiar método · <kbd>Enter</kbd> para avanzar entre campos</p>
=======
          <p>Selecciona un método, ingresa los parámetros y ejecuta el cálculo asíncrono</p>
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
        </div>

        <div className="form-card">

<<<<<<< HEAD
          {/* Selector de método */}
          <div className="form-section">
            <label className="section-label">
              Método numérico
              <span className="kbd-hint">← → para navegar</span>
            </label>
            {[["raices","Búsqueda de Raíces"],["lineales","Sistemas Lineales Ax=b"]].map(([cat,catLabel]) => (
              <div key={cat} style={{marginBottom:12}}>
                <p className="cat-label">{catLabel}</p>
                <div className="method-grid">
                  {Object.entries(METHODS).filter(([,v])=>v.cat===cat).map(([key,val])=>(
                    <button key={key}
                      className={`method-chip ${method===key?"active":""}`}
                      style={method===key
                        ?{background:val.color,borderColor:val.color,color:"#000",fontWeight:800,boxShadow:`0 0 18px ${val.color}55`}
                        :{borderColor:val.color+"44",color:val.color}}
                      onClick={()=>{setMethod(key);setErrors({});}}>
                      {val.label}
                      {method===key&&<span style={{marginLeft:4}}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Fórmula */}
          <div className="formula-preview" style={{borderColor:color+"55",background:color+"08"}}>
            <span className="formula-label">{METHODS[method].label}</span>
            <div style={{textAlign:"center",padding:"6px 0"}}>
              <Formula tex={METHODS[method].tex}/>
            </div>
          </div>

          {/* Inputs lineales — cuadrícula 3x4 */}
          {isLineal && (
            <div className="form-section">
              <label className="section-label">Matriz aumentada [A|b]</label>
              <p className="hint">Ingresa los coeficientes de cada ecuación · la última columna es el vector b</p>
              <div className="matrix-grid">
                <div className="matrix-header-row">
                  <span className="matrix-corner"></span>
                  {["x₁","x₂","x₃","b"].map((h,j)=>(
                    <span key={j} className="matrix-col-header">{h}</span>
                  ))}
                </div>
                {[0,1,2].map(i=>(
                  <div key={i} className="matrix-row">
                    <span className="matrix-row-label">f{i+1}</span>
                    {[0,1,2,3].map(j=>{
                      const cellKey = `m${i}${j}`;
                      const isB = j === 3;
                      return (
                        <input
                          key={j}
                          type="number"
                          placeholder="0"
                          className={`matrix-cell ${isB?"matrix-cell-b":""} ${errors[cellKey]?"error":""}`}
                          value={matrixCells[cellKey]??""}
                          onChange={e=>{
                            const val = e.target.value;
                            setMatrixCells(prev=>{
                              const next = {...prev, [cellKey]: val};
                              const rows = [0,1,2].map(r=>
                                [0,1,2,3].map(c=>next[`m${r}${c}`]||"0").join(",")
                              ).join(";");
                              setMatrix(rows);
                              return next;
                            });
                            setErrors(er=>({...er,[cellKey]:false,matrix:false}));
                          }}
                          onKeyDown={e=>{
                            if(e.key==="Enter"){
                              e.preventDefault();
                              const ni = j===3?i+1:i, nj = j===3?0:j+1;
                              if(ni<3){
                                const next = document.querySelector(`[data-cell="m${ni}${nj}"]`);
                                if(next) next.focus();
                                else if(refIters.current) refIters.current.focus();
                              } else {
                                if(refIters.current) refIters.current.focus();
                              }
                            }
                          }}
                          data-cell={cellKey}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              {errors.matrix&&<p className="err">⚠ Completa todos los campos de la matriz</p>}
              {method === "Gauss-Seidel" && (
                <div className="row2" style={{marginTop:12}}>
                  <div>
                    <label className="section-label">Iteraciones máx.</label>
                    <input ref={refIters} type="number" placeholder="100" value={iters}
                      className={`field ${inp("iters")}`} onKeyDown={onKey(refIters)}
                      onChange={e=>{setIters(e.target.value);setErrors(er=>({...er,iters:false}));}}/>
                  </div>
                  <div>
                    <label className="section-label">Tolerancia</label>
                    <input ref={refTol} type="text" placeholder="0.0001" value={tol}
                      className={`field ${errors.tol?"error":""}`} onKeyDown={onKey(refTol)}
                      onChange={e=>setTol(e.target.value)}/>
                    {errors.tol&&<p className="err">⚠ Tolerancia inválida</p>}
                  </div>
                </div>
              )}
=======
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
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
            </div>
          )}

          {/* Inputs raíces */}
          {!isLineal && (
            <div className="form-section">
              <label className="section-label">Función f(x)</label>
<<<<<<< HEAD
              <input ref={refFunc} type="text" placeholder="Ej: x**3 - x - 2" value={func}
                className={`field ${inp("func")}`} onKeyDown={onKey(refFunc)}
                onChange={e=>{setFunc(e.target.value);setErrors(er=>({...er,func:false}));}}/>
              {errors.func&&<p className="err">⚠ Ingresa una función válida</p>}
              <p className="hint">Usa <code>**</code> para potencias · <code>sqrt()</code> · <code>sin()</code> · <code>exp()</code></p>

              <div className={showX2?"row3":showX1?"row2":"row1"} style={{marginTop:14}}>
                <div>
                  <label className="section-label">{method==="Newton-Raphson"?"x₀ — Valor inicial":"x₀ — Primer valor"}</label>
                  <input ref={refX0} type="number" placeholder="x₀" value={x0}
                    className={`field ${inp("x0")}`} onKeyDown={onKey(refX0)}
                    onChange={e=>{setX0(e.target.value);setErrors(er=>({...er,x0:false}));}}/>
                  {errors.x0&&<p className="err">⚠ Requerido</p>}
                </div>
                {showX1&&(
                  <div>
                    <label className="section-label">x₁ — Segundo valor</label>
                    <input ref={refX1} type="number" placeholder="x₁" value={x1}
                      className={`field ${inp("x1")}`} onKeyDown={onKey(refX1)}
                      onChange={e=>{setX1(e.target.value);setErrors(er=>({...er,x1:false}));}}/>
                    {errors.x1&&<p className="err">⚠ Requerido</p>}
                    {errors.x1Same&&<p className="err">⚠ Error: x₀ y x₁ no pueden ser iguales (división por cero en Secante)</p>}
                  </div>
                )}
                {showX2&&(
                  <div>
                    <label className="section-label">x₂ — Tercer valor</label>
                    <input ref={refX2} type="number" placeholder="x₂" value={x2}
                      className={`field ${inp("x2")}`} onKeyDown={onKey(refX2)}
                      onChange={e=>{setX2(e.target.value);setErrors(er=>({...er,x2:false}));}}/>
                    {errors.x2&&<p className="err">⚠ Requerido</p>}
                    {errors.mullerSame&&<p className="err">⚠ Error: x₀, x₁ y x₂ deben ser distintos entre sí</p>}
=======
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
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
                  </div>
                )}
              </div>

<<<<<<< HEAD
              <div className="row2" style={{marginTop:14}}>
                <div>
                  <label className="section-label">Iteraciones máximas</label>
                  <input ref={refIters} type="number" placeholder="50" value={iters}
                    className={`field ${inp("iters")}`} onKeyDown={onKey(refIters)}
                    onChange={e=>{setIters(e.target.value);setErrors(er=>({...er,iters:false}));}}/>
                  {errors.iters&&<p className="err">⚠ Requerido (mínimo 1)</p>}
                  {errors.itersMax&&<p className="err">⚠ Máximo 1000 iteraciones permitidas</p>}
                </div>
                <div>
                  <label className="section-label">Tolerancia</label>
                  <input ref={refTol} type="text" placeholder="0.0001" value={tol}
                    className={`field ${errors.tol?"error":""}`} onKeyDown={onKey(refTol)}
                    onChange={e=>setTol(e.target.value)}/>
                  {errors.tol&&<p className="err">⚠ Ingresa una tolerancia válida (número positivo)</p>}
=======
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
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
                </div>
              </div>
            </div>
          )}

<<<<<<< HEAD
          <button ref={refResolve} className="btn-resolve"
            style={{background:`linear-gradient(135deg, ${color}, ${color}bb)`,color:"#000"}}
            onClick={solve}>
            Resolver →
          </button>
          <p style={{textAlign:"center",color:"#334155",fontSize:11,marginTop:8}}>
            <kbd>Enter</kbd> en el último campo también resuelve
          </p>
=======
          <button className="btn-resolve" style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
            onClick={solve}>
            Resolver →
          </button>
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
        </div>
      </div>
    </div>
  );

<<<<<<< HEAD
  // ══ RESULTADO ═══════════════════════════════════════════════════════════════
  if (view === "result") return (
    <div className="page">
      <nav className="topnav">
        <button className="back-btn" onClick={()=>{stopPolling();setView("form");}}>← Volver</button>
        <span className="brand">Resultado</span>
        <div className="nav-links">
          <button className="nav-btn" onClick={openHistory}>📋 Historial</button>
          <button className="nav-btn" onClick={()=>{setView("compare");apiGetJobs().then(d=>setApiHistory(Array.isArray(d)?d:[]));}} >📊 Comparación</button>
=======
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
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
        </div>
      </nav>

      <div className="result-page">
<<<<<<< HEAD
        {activeJob&&(
          <div className="processing-card" style={{borderColor:color+"44"}}>
            <div className="spinner" style={{borderTopColor:color}}/>
            <div>
              <p className="proc-title" style={{color}}>Ejecutando job de forma asíncrona…</p>
              <p className="proc-sub">Consultando API cada {POLL_INTERVAL/1000}s · Consulta #{pollCount} · Job ID: <code>{activeJob.id??"—"}</code></p>
            </div>
            <button className="cancel-sm" onClick={()=>{stopPolling();setActiveJob(null);}}>✕</button>
          </div>
        )}

        {isFailed&&!activeJob&&(
          <div className="error-card">
            <strong>⚠️ Job fallido</strong>
            <p>{jobResult.mensajeError??"Revisa los parámetros o el backend."}</p>
            <button className="btn-retry" onClick={()=>setView("form")}>← Volver al formulario</button>
          </div>
        )}

        {!jobResult&&!activeJob&&(
          <div className="waiting-card">
            <div className="spinner" style={{margin:"0 auto 16px",borderTopColor:color}}/>
            Enviando job a la API…
          </div>
        )}

        {isDone&&(
          <>
            <div className="res-header" style={{borderColor:color+"55",background:color+"06"}}>
              <div>
                <span className="res-method" style={{color}}>{METHODS[jobResult.metodo]?.label??jobResult.metodo}</span>
                <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap",alignItems:"center"}}>
                  <StatusPill status={jobResult.estado}/>
                  {jobResult.converged===true&&<span className="badge green">✓ Convergió</span>}
                  {jobResult.converged===false&&<span className="badge red">✗ No convergió</span>}
                </div>
              </div>
              <div className="formula-sm" style={{borderColor:color+"33",background:color+"08"}}>
                <Formula tex={METHODS[jobResult.metodo]?.tex??""}/>
              </div>
            </div>

            {/* Resultado x1/x2/x3 para Gauss y Gauss-Jordan */}
            {(jobResult.metodo==="Gauss"||jobResult.metodo==="Gauss-Jordan")&&(()=>{
              let sol = null;
              try { sol = typeof jobResult.resultado==="string" ? JSON.parse(jobResult.resultado) : jobResult.resultado; } catch {}
              return (
                <div className="content-card" style={{marginBottom:0}}>
                  <h3 className="card-title">Solución del sistema</h3>
                  <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:8}}>
                    {Array.isArray(sol) ? sol.map((v,i)=>(
                      <div className="stat-card" key={i} style={{minWidth:120,borderColor:color+"44",background:color+"08"}}>
                        <span className="stat-label">x{i+1}</span>
                        <span className="stat-value" style={{color,fontSize:18}}>{Number(v).toPrecision(8)}</span>
                      </div>
                    )) : <code style={{color}}>{jobResult.resultado??"—"}</code>}
                  </div>
                  <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:16}}>
                    <div className="stat-card" style={{flex:1,minWidth:140}}>
                      <span className="stat-label">Tiempo de ejecución</span>
                      <span className="stat-value" style={{color:"#34d399"}}>{elapsedTime??jobResult.elapsed_time??jobResult.executionTime??"—"}</span>
                    </div>
                    <div className="stat-card" style={{flex:1,minWidth:140}}>
                      <span className="stat-label">Expresión</span>
                      <span className="stat-value" style={{color:"#94a3b8",fontSize:12}}>{jobResult.expresion??"—"}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Stats grid para raíces y Gauss-Seidel */}
            {(jobResult.metodo!=="Gauss"&&jobResult.metodo!=="Gauss-Jordan")&&(
            <div className="stats-grid">
              {[
                {label:"Resultado / Raíz", value:jobResult.resultado??"—", color, big:true},
                {label:"Error final",      value:jobResult.errorFinal!=null?Number(jobResult.errorFinal).toExponential(4):"—", color:"#94a3b8"},
                {label:"Iteraciones",      value:jobResult.iteracionesTotal??iterData.length??"—", color:"#94a3b8"},
                {label:"Convergió",        value:jobResult.converged===true?"Sí ✓":jobResult.converged===false?"No ✗":"—",
                  color:jobResult.converged?"#34d399":jobResult.converged===false?"#f87171":"#94a3b8"},
                {label:"Tolerancia",       value:tol, color:"#94a3b8"},
                {label:"Tiempo de ejecución", value:elapsedTime??jobResult.elapsed_time??jobResult.executionTime??jobResult.time??"—", color:"#34d399"},
                {label:"Expresión",        value:jobResult.expresion??"—", color:"#94a3b8"},
              ].map(s=>(
                <div className="stat-card" key={s.label}
                  style={s.big?{borderColor:color+"33",background:color+"06"}:{}}>
                  <span className="stat-label">{s.label}</span>
                  <span className="stat-value" style={{color:s.color,fontSize:s.big?17:15}}>{s.value}</span>
                </div>
              ))}
            </div>
            )}

            {/* Iteraciones solo para Gauss-Seidel y métodos de raíces */}
            {iterData.length>0&&(jobResult.metodo==="Gauss-Seidel"||METHODS[jobResult.metodo]?.cat==="raices")&&(
              <div className="content-card">
                <div className="tabs">
                  <button className={`tab ${activeTab==="tabla"?"active":""}`}
                    style={activeTab==="tabla"?{borderColor:color,color,background:color+"12"}:{}}
                    onClick={()=>setActiveTab("tabla")}>📋 Tabla de iteraciones</button>
                  <button className={`tab ${activeTab==="grafica"?"active":""}`}
                    style={activeTab==="grafica"?{borderColor:color,color,background:color+"12"}:{}}
                    onClick={()=>setActiveTab("grafica")}>📈 Gráfica de convergencia</button>
                </div>

                {activeTab==="tabla"&&(
                  <IterationTable
                    rows={iterData}
                    metodo={jobResult.metodo}
                    lineColor={color}
                  />
                )}

                {activeTab==="grafica"&&(
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData} margin={{top:10,right:24,left:0,bottom:24}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                        <XAxis dataKey="iter" tick={{fill:"#64748b",fontSize:11}}
                          label={{value:"Iteración",position:"insideBottom",offset:-12,fill:"#64748b",fontSize:11}}/>
                        <YAxis scale="log" domain={["auto","auto"]} tick={{fill:"#64748b",fontSize:11}}/>
                        <Tooltip contentStyle={{background:"#0f172a",border:"1px solid #334155",borderRadius:8,fontSize:11}}
                          formatter={v=>v.toExponential(4)}/>
                        <Legend wrapperStyle={{fontSize:11,paddingTop:10}}/>
                        <Line type="monotone" dataKey="error" name="Error abs."
                          stroke={color} dot={{fill:color,r:3}} strokeWidth={2.5}/>
                      </LineChart>
                    </ResponsiveContainer>
                    <p style={{textAlign:"center",color:"#475569",fontSize:11,marginTop:4}}>
=======

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
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
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

<<<<<<< HEAD
  // ══ HISTORIAL ═══════════════════════════════════════════════════════════════
=======
  // ════════════════════════════════════════════════════════════════════════════
  // VISTA: HISTORIAL
  // ════════════════════════════════════════════════════════════════════════════
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
  if (view === "history") {
    const all = apiHistory.length ? apiHistory : historyList;
    return (
      <div className="page">
        <nav className="topnav">
<<<<<<< HEAD
          <button className="back-btn" onClick={()=>setView("form")}>← Volver</button>
          <span className="brand">📋 Historial de Jobs</span>
          <div className="nav-links">
            <button className="nav-btn" onClick={()=>{setView("compare");apiGetJobs().then(d=>setApiHistory(Array.isArray(d)?d:[]));}} >📊 Comparación</button>
          </div>
        </nav>
        <div className="list-page">
          {all.length===0&&<div className="empty-state"><p style={{fontSize:40,marginBottom:12}}>📭</p><p>Sin historial aún.</p></div>}
          {all.map((item,i)=>{
            const m=METHODS[item.metodo]; const c=m?.color??"#60a5fa";
            const isClickable = (item.estado??"").toUpperCase() === "DONE";
            return (
              <div className="hist-card" key={i}
                style={{borderColor:c+"33", cursor: isClickable ? "pointer" : "default"}}
                onClick={() => isClickable && openJobDetail(item)}>
                <div className="hist-top">
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <span className="hist-method" style={{color:c,background:c+"18"}}>{m?.label??item.metodo}</span>
                    <StatusPill status={item.estado}/>
                    {item.converged===true&&<span className="badge green">✓ Convergió</span>}
                    {item.converged===false&&<span className="badge red">✗ No convergió</span>}
                  </div>
                  <span className="hist-date">{item.fechaCreacion?(() => {
                    const d = new Date(item.fechaCreacion);
                    d.setHours(d.getHours() - 6);
                    return d.toLocaleString("es-GT", {day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true});
                  })():""}</span>
                </div>
                <p className="hist-func"><code>{item.expresion??"—"}</code></p>
                <div className="hist-stats">
                  {item.resultado&&<span>Raíz: <strong style={{color:c}}>{item.resultado}</strong></span>}
                  <span>Iteraciones: <strong>{item.iteracionesTotal??"—"}</strong></span>
                  {item.errorFinal!=null&&<span>Error: <strong>{Number(item.errorFinal).toExponential(4)}</strong></span>}
                </div>
                {isClickable && <p style={{fontSize:11,color:"#334155",marginTop:8}}>👆 Clic para ver resultado completo</p>}
=======
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
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
              </div>
            );
          })}
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  // ══ COMPARACIÓN ═════════════════════════════════════════════════════════════
  if (view === "compare") {
    // Merge API history with session history (API takes precedence, dedup by id)
    const merged = apiHistory.length
      ? apiHistory.map(h => {
          const local = historyList.find(l => l.id === h.id);
          return local ? { ...h, iterationsData: local.iterationsData } : h;
        })
      : historyList;
    const compareList = merged.filter(h => METHODS[h.metodo]?.cat === "raices");
    return (
    <div className="page">
      <nav className="topnav">
        <button className="back-btn" onClick={()=>setView("form")}>← Volver</button>
        <span className="brand">📊 Comparación de Métodos</span>
        <div className="nav-links">
          <button className="nav-btn" onClick={openHistory}>📋 Historial</button>
        </div>
      </nav>
      <div className="list-page">
        {compareList.length===0&&(
          <div className="empty-state">
            <p style={{fontSize:40,marginBottom:12}}>📊</p>
            <p>No hay métodos de raíces para comparar aún.</p>
            <p style={{fontSize:13,color:"#475569",marginTop:8}}>Resuelve un problema con Newton-Raphson, Secante o Müller para ver la comparación aquí.</p>
          </div>
        )}
        {compareList.length>0&&(
          <>
            <div className="content-card" style={{marginBottom:24}}>
              <h3 className="card-title">Resumen comparativo</h3>
              <div className="tbl-wrap">
                <table className="iter-table">
                  <thead><tr><th>Método</th><th>Expresión</th><th>Resultado</th><th>Iteraciones</th><th>Error final</th><th>Convergió</th></tr></thead>
                  <tbody>
                    {compareList.map((h,i)=>{
                      const m=METHODS[h.metodo]; const c=m?.color??"#60a5fa";
                      // Formatear resultado: si es array JSON mostrar x1=v1, x2=v2...
                      const fmtResultado = (()=>{
                        if(!h.resultado) return "—";
                        try {
                          const parsed = typeof h.resultado==="string" ? JSON.parse(h.resultado) : h.resultado;
                          if(Array.isArray(parsed)) return parsed.map((v,i)=>`x${i+1}=${Number(v).toPrecision(6)}`).join("  ");
                        } catch {}
                        return h.resultado;
                      })();
                      return (
                        <tr key={i}>
                          <td><span style={{color:c,fontWeight:700}}>{m?.label??h.metodo}</span></td>
                          <td><code style={{fontSize:11}}>{h.expresion??"—"}</code></td>
                          <td><code style={{color:c,fontSize:11}}>{fmtResultado}</code></td>
                          <td style={{textAlign:"center"}}>{h.iteracionesTotal??"—"}</td>
                          <td><code>{h.errorFinal!=null?Number(h.errorFinal).toExponential(4):"—"}</code></td>
                          <td style={{textAlign:"center"}}>
                            {h.converged===true?<span className="badge green">✓ Sí</span>
                             :h.converged===false?<span className="badge red">✗ No</span>:"—"}
=======
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
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

<<<<<<< HEAD
            {compareList.some(h=>h.iterationsData?.length>0)&&(
              <div className="content-card">
                <h3 className="card-title">Curvas de convergencia superpuestas</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart margin={{top:10,right:24,left:0,bottom:24}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                    <XAxis dataKey="iter" type="number" tick={{fill:"#64748b",fontSize:11}}
                      label={{value:"Iteración",position:"insideBottom",offset:-12,fill:"#64748b",fontSize:11}}/>
                    <YAxis scale="log" domain={["auto","auto"]} tick={{fill:"#64748b",fontSize:11}}/>
                    <Tooltip contentStyle={{background:"#0f172a",border:"1px solid #334155",borderRadius:8,fontSize:11}}
                      formatter={v=>v.toExponential(4)}/>
                    <Legend wrapperStyle={{fontSize:11,paddingTop:10}}/>
                    {compareList.filter(h=>h.iterationsData?.length>0).map((h,i)=>{
                      const data=h.iterationsData.map(r=>({
                        iter:r.numeroIteracion??r.numero??0,
                        error:Math.max(+(r.error??0),1e-16),
                      }));
                      return (
                        <Line key={i} data={data} type="monotone" dataKey="error"
                          name={METHODS[h.metodo]?.label??h.metodo}
                          stroke={METHODS[h.metodo]?.color??"#60a5fa"}
                          dot={false} strokeWidth={2}/>
=======
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
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
<<<<<<< HEAD
                <p style={{textAlign:"center",color:"#475569",fontSize:11,marginTop:4}}>
=======
                <p style={{ textAlign: "center", color: "#475569", fontSize: 11, marginTop: 4 }}>
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
                  Escala logarítmica — error vs. iteración por método
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
<<<<<<< HEAD
    );
  }

  // ══ DETALLE DE JOB DEL HISTORIAL ══════════════════════════════════════════
  if (view === "jobdetail" && selectedJob) {
    const job = selectedJob;
    const jColor = METHODS[job.metodo]?.color ?? "#60a5fa";
    const jIsLineal = METHODS[job.metodo]?.cat === "lineales";
    const jChartData = (job.iterationsData ?? []).map(r => ({
      iter:  r.numeroIteracion ?? r.numero ?? r.iteration ?? 0,
      error: Math.max(+(r.error ?? 0), 1e-16),
    }));
    return (
      <div className="page">
        <nav className="topnav">
          <button className="back-btn" onClick={()=>setView("history")}>← Historial</button>
          <span className="brand">Detalle del Job</span>
          <div className="nav-links">
            <button className="nav-btn" onClick={()=>setView("form")}>🏠 Inicio</button>
            <button className="nav-btn" onClick={()=>{setView("compare");apiGetJobs().then(d=>setApiHistory(Array.isArray(d)?d:[]));}} >📊 Comparación</button>
          </div>
        </nav>

        <div className="result-page">
          <div className="res-header" style={{borderColor:jColor+"55",background:jColor+"06"}}>
            <div>
              <span className="res-method" style={{color:jColor}}>{METHODS[job.metodo]?.label??job.metodo}</span>
              <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap",alignItems:"center"}}>
                <span style={{fontSize:11,color:"#475569"}}>{job.fechaCreacion?(() => {
                  const d = new Date(job.fechaCreacion);
                  d.setHours(d.getHours() - 6);
                  return d.toLocaleString("es-GT",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true});
                })():""}</span>
                {job.converged===true&&<span className="badge green">✓ Convergió</span>}
                {job.converged===false&&<span className="badge red">✗ No convergió</span>}
              </div>
            </div>
            <div className="formula-sm" style={{borderColor:jColor+"33",background:jColor+"08"}}>
              <Formula tex={METHODS[job.metodo]?.tex??""}/>
            </div>
          </div>

          <div className="stats-grid">
            {[
              {label:"Resultado / Raíz", value:job.resultado??"—", color:jColor, big:true},
              {label:"Error final",      value:job.errorFinal!=null?Number(job.errorFinal).toExponential(4):"—", color:"#94a3b8"},
              {label:"Iteraciones",      value:job.iteracionesTotal??(job.iterationsData?.length)??"—", color:"#94a3b8"},
              {label:"Convergió",        value:job.converged===true?"Sí ✓":job.converged===false?"No ✗":"—",
                color:job.converged?"#34d399":job.converged===false?"#f87171":"#94a3b8"},
              {label:"Tiempo",           value:job.elapsed_time??job.executionTime??job.time??"—", color:"#94a3b8"},
              {label:"Expresión",        value:job.expresion??"—", color:"#94a3b8"},
              {label:"Job ID",           value:job.id??"—", color:"#475569"},
            ].map(s=>(
              <div className="stat-card" key={s.label} style={s.big?{borderColor:jColor+"33",background:jColor+"06"}:{}}>
                <span className="stat-label">{s.label}</span>
                <span className="stat-value" style={{color:s.color,fontSize:s.big?17:15}}>{s.value}</span>
              </div>
            ))}
          </div>

          {job.iterationsData?.length > 0 && (
            <div className="content-card">
              <div className="tabs">
                <button className={`tab ${activeTab==="tabla"?"active":""}`}
                  style={activeTab==="tabla"?{borderColor:jColor,color:jColor,background:jColor+"12"}:{}}
                  onClick={()=>setActiveTab("tabla")}>📋 Tabla de iteraciones</button>
                <button className={`tab ${activeTab==="grafica"?"active":""}`}
                  style={activeTab==="grafica"?{borderColor:jColor,color:jColor,background:jColor+"12"}:{}}
                  onClick={()=>setActiveTab("grafica")}>📈 Gráfica de convergencia</button>
              </div>

              {activeTab==="tabla"&&(
                <IterationTable
                  rows={job.iterationsData}
                  metodo={job.metodo}
                  lineColor={jColor}
                />
              )}

              {activeTab==="grafica"&&(
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={jChartData} margin={{top:10,right:24,left:0,bottom:24}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                      <XAxis dataKey="iter" tick={{fill:"#64748b",fontSize:11}}
                        label={{value:"Iteración",position:"insideBottom",offset:-12,fill:"#64748b",fontSize:11}}/>
                      <YAxis scale="log" domain={["auto","auto"]} tick={{fill:"#64748b",fontSize:11}}/>
                      <Tooltip contentStyle={{background:"#0f172a",border:"1px solid #334155",borderRadius:8,fontSize:11}}
                        formatter={v=>v.toExponential(4)}/>
                      <Legend wrapperStyle={{fontSize:11,paddingTop:10}}/>
                      <Line type="monotone" dataKey="error" name="Error abs."
                        stroke={jColor} dot={{fill:jColor,r:3}} strokeWidth={2.5}/>
                    </LineChart>
                  </ResponsiveContainer>
                  <p style={{textAlign:"center",color:"#475569",fontSize:11,marginTop:4}}>
                    Escala logarítmica — error vs. iteración
                  </p>
                </div>
              )}
            </div>
          )}

          {(!job.iterationsData || job.iterationsData.length === 0) && (
            <div className="content-card" style={{textAlign:"center",color:"#475569",padding:"40px"}}>
              <p>No hay iteraciones guardadas para este job.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
=======
  );
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9

  return null;
}
