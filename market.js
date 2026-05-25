// City Venture Stock Market Simulator
// 100% Deterministic real-time stock simulation using time-synced pseudo-random walking.
// Adapted for physical gameplay (cash and cards in hand) - Acts as price oracle, cash calculator, and event injector.
// SECTOR ÚNICO: Tecnología / IA

const STOCKS = {
  "NVDA": { name: "NVDA Core", sector: "Tecnología / IA", initialPrice: 165.50, volatility: 0.18, drift: 0.02 },
  "AETH": { name: "AetherAI", sector: "Tecnología / IA", initialPrice: 85.00, volatility: 0.20, drift: 0.04 },
  "QBYT": { name: "Quantum Byte", sector: "Tecnología / IA", initialPrice: 42.20, volatility: 0.22, drift: 0.01 },
  "CMND": { name: "CyberMind Industries", sector: "Tecnología / IA", initialPrice: 110.00, volatility: 0.16, drift: 0.03 },
  "NLNK": { name: "NeuroLink Systems", sector: "Tecnología / IA", initialPrice: 95.80, volatility: 0.24, drift: 0.05 },
  "TITN": { name: "Titan Compute", sector: "Tecnología / IA", initialPrice: 135.00, volatility: 0.15, drift: 0.02 }
};

const NEWS_TEMPLATES = [
  { sector: "Tecnología / IA", title: "¡Récord mundial en rendimiento de procesadores de nueva generación!", impact: 0.22, type: "up" },
  { sector: "Tecnología / IA", title: "Escasez masiva de semiconductores paraliza la producción global.", impact: -0.15, type: "down" },
  { sector: "Tecnología / IA", title: "Aprobación histórica de implantes neuronales para uso civil.", impact: 0.18, type: "up" },
  { sector: "Tecnología / IA", title: "Un ciberataque masivo compromete centros de datos en tres continentes.", impact: -0.20, type: "down" },
  { sector: "Tecnología / IA", title: "La IA supera a científicos humanos en descubrimiento de fármacos.", impact: 0.25, type: "up" },
  { sector: "Tecnología / IA", title: "Gobiernos del G7 imponen restricciones temporales al desarrollo de IA.", impact: -0.12, type: "down" },
  { sector: "Tecnología / IA", title: "¡Nuevo hito en computación cuántica: 10.000 qubits estables!", impact: 0.28, type: "up" },
  { sector: "Tecnología / IA", title: "Fallo crítico en sistemas autónomos provoca recall masivo de robots.", impact: -0.18, type: "down" },
  { sector: "Tecnología / IA", title: "Demanda récord de GPUs dispara los ingresos del sector tech.", impact: 0.20, type: "up" },
  { sector: "Tecnología / IA", title: "Filtración masiva de datos de IA expone vulnerabilidades del sector.", impact: -0.14, type: "down" },
  { sector: "Tecnología / IA", title: "Contrato militar billonario acelera la carrera de supercomputación.", impact: 0.16, type: "up" },
  { sector: "Tecnología / IA", title: "Apagón global de servidores cloud afecta a millones de usuarios.", impact: -0.22, type: "down" },
  { sector: "Tecnología / IA", title: "¡Primera ciudad 100% autónoma gestionada por inteligencia artificial!", impact: 0.24, type: "up" },
  { sector: "Tecnología / IA", title: "Investigación revela que modelos de IA generan sesgos peligrosos.", impact: -0.10, type: "down" },
  { sector: "Tecnología / IA", title: "Alianza global de empresas tech anuncia estándar abierto de IA.", impact: 0.15, type: "up" }
];

// Physical event cards with 3-digit injection codes (13 cartas de noticias físicas)
// Códigos 1xx = SUBIDA (+), Códigos 2xx = BAJADA (-)
const PHYSICAL_EVENTS = {
  // 🔺 CARTAS DE SUBIDA
  "101": { title: "¡Burbuja de Inteligencia Artificial!", sector: "Tecnología / IA", impact: 0.30, desc: "La euforia por la IA dispara todas las cotizaciones un +30%." },
  "102": { title: "¡Nuevo Avance en Computación Cuántica!", sector: "Tecnología / IA", impact: 0.35, desc: "Un descubrimiento cuántico histórico impulsa el sector un +35%." },
  "103": { title: "¡Revolución en Microprocesadores de Nueva Generación!", sector: "Tecnología / IA", impact: 0.40, desc: "Los nuevos chips rompen récords mundiales. Las acciones suben un +40%." },
  "104": { title: "¡Aprobación Global de Implantes Neuronales!", sector: "Tecnología / IA", impact: 0.25, desc: "La tecnología neuronal obtiene aprobación mundial. Alza de +25%." },
  "105": { title: "¡Contrato Gubernamental Billonario para el Sector Tech!", sector: "Tecnología / IA", impact: 0.30, desc: "Un megacontrato gubernamental inyecta confianza. Subida de +30%." },
  "106": { title: "¡La IA Supera al Humano en Investigación Científica!", sector: "Tecnología / IA", impact: 0.35, desc: "La IA logra un hito científico sin precedentes. Impulso de +35%." },
  "107": { title: "¡Boom de Demanda Global en Centros de Datos!", sector: "Tecnología / IA", impact: 0.45, desc: "La demanda de infraestructura tech explota globalmente. Subida masiva de +45%." },
  // 🔻 CARTAS DE BAJADA
  "201": { title: "¡Fallo Cuántico Global!", sector: "Tecnología / IA", impact: -0.25, desc: "Un error cuántico en cadena destruye sistemas críticos. Caída de -25%." },
  "202": { title: "¡Escasez Mundial de Semiconductores!", sector: "Tecnología / IA", impact: -0.30, desc: "Las fábricas de chips se detienen por falta de materiales. Desplome de -30%." },
  "203": { title: "¡Ciberataque Masivo a la Infraestructura Tech!", sector: "Tecnología / IA", impact: -0.35, desc: "Hackers comprometen los servidores centrales del sector. Colapso de -35%." },
  "204": { title: "¡Nueva Ley Prohíbe el Desarrollo de IA Autónoma!", sector: "Tecnología / IA", impact: -0.20, desc: "Una ley drástica frena la innovación en IA. Caída de -20%." },
  "205": { title: "¡Escándalo: La IA Presenta Fallas Críticas de Seguridad!", sector: "Tecnología / IA", impact: -0.40, desc: "Un escándalo de seguridad sacude la confianza en la IA. Desplome de -40%." },
  "206": { title: "¡Apagón Global en los Centros de Datos!", sector: "Tecnología / IA", impact: -0.25, desc: "Los data centers del mundo se apagan en cadena. Caída de -25%." }
};

// Local storage active injected events state
let activeEvents = {};

function loadActiveEvents() {
  const stored = localStorage.getItem("city_venture_active_events");
  if (stored) {
    try {
      activeEvents = JSON.parse(stored);
    } catch (e) {
      activeEvents = {};
    }
  }
}

function saveActiveEvents() {
  localStorage.setItem("city_venture_active_events", JSON.stringify(activeEvents));
}

function injectEventCode(code) {
  loadActiveEvents();
  if (PHYSICAL_EVENTS[code]) {
    activeEvents[code] = Date.now();
    saveActiveEvents();
    return { success: true, event: PHYSICAL_EVENTS[code] };
  }
  return { success: false, msg: "Código no reconocido. Ingresa un número de 3 dígitos de tus cartas." };
}

function getActiveEventsList(timestampMs) {
  loadActiveEvents();
  const list = [];

  for (const code in activeEvents) {
    const startTime = activeEvents[code];
    if (startTime <= timestampMs) {
      const event = PHYSICAL_EVENTS[code];
      if (event) {
        list.push({
          code: code,
          title: event.title,
          sector: event.sector,
          impact: event.impact,
          startTime: startTime,
          desc: event.desc
        });
      }
    }
  }

  // Ordenar de forma descendente para mostrar el más reciente arriba
  return list.sort((a, b) => b.startTime - a.startTime);
}

function clearAllActiveEvents() {
  activeEvents = {};
  saveActiveEvents();
}

// Linear Congruential Generator for reproducible pseudo-random numbers
function lcgRandom(seed) {
  const m = 0x80000000; // 2**31
  const a = 1103515245;
  const c = 12345;
  return ((a * seed + c) % m) / m;
}

function getSeedForSymbol(symbol) {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

// Deterministic News Sincronized Every 10 Minutes
function getActiveNewsAtTime(timestampMs) {
  const tenMinutesMs = 10 * 60 * 1000;
  const interval = Math.floor(timestampMs / tenMinutesMs);
  const seed = interval * 987654 + 137;
  const rand = lcgRandom(seed);
  const templateIndex = Math.floor(rand * NEWS_TEMPLATES.length);
  const news = NEWS_TEMPLATES[templateIndex];
  
  const startTime = interval * tenMinutesMs;
  return {
    ...news,
    startTime: startTime,
    endTime: startTime + tenMinutesMs
  };
}

// Core price simulator: 100% deterministic based on symbol and exact timestamp (accurate to 10s steps)
// Prices are only affected by physical event card injections, NOT by automatic cyclical news.
function getPriceAtTime(symbol, timestampMs) {
  const stock = STOCKS[symbol];
  if (!stock) return 0;

  const basePrice = stock.initialPrice;
  const vol = stock.volatility;
  const drift = stock.drift;
  const symbolSeed = getSeedForSymbol(symbol);

  // 1. Slow Macro-Trend (Waves spanning 3h, 8h, 24h)
  const hourScale = 3600000;
  const macroTrend = Math.sin(timestampMs / (hourScale * 2.5) + symbolSeed) * 0.12
                   + Math.cos(timestampMs / (hourScale * 8) - symbolSeed) * 0.18
                   + Math.sin(timestampMs / (hourScale * 24) + symbolSeed * 1.5) * 0.25;

  // 2. High Frequency micro-fluctuation (steps of 10s)
  const stepMs = 10000;
  const currentStep = Math.floor(timestampMs / stepMs);
  const microSeed = symbolSeed + currentStep;
  const microNoise = lcgRandom(microSeed) - 0.5; // -0.5 to 0.5

  // 3. Steady long-term drift based on time passage since baseline (Jan 1, 2026)
  const baselineMs = 1767225600000; // 2026-01-01 00:00:00 UTC
  const elapsedDays = (timestampMs - baselineMs) / (86400000);
  const driftTerm = elapsedDays * drift * 0.05; // tiny daily trend

  // 4. Combine deterministic components
  let calculatedPrice = basePrice * (1 + driftTerm + macroTrend * vol + microNoise * vol * 0.25);

  // 5. Apply manual custom active physical injected events only!
  let multiplier = 1.0;
  const activeEvts = getActiveEventsList(timestampMs);
  activeEvts.forEach(evt => {
    if (evt.sector === stock.sector) {
      // Apply the impact multiplicatively and permanently
      multiplier *= (1 + evt.impact);
    }
  });

  // Calculate final price factoring in physical event triggers only
  calculatedPrice = calculatedPrice * multiplier;

  const minPrice = 1.00;
  return Math.max(minPrice, parseFloat(calculatedPrice.toFixed(2)));
}

// Generate the historical price array to populate the chart
function getStockHistory(symbol, currentTimestampMs, pointsCount = 30, intervalMs = 10000) {
  const history = [];
  for (let i = pointsCount - 1; i >= 0; i--) {
    const t = currentTimestampMs - i * intervalMs;
    history.push({
      time: t,
      price: getPriceAtTime(symbol, t)
    });
  }
  return history;
}

// RENDERING DYNAMIC LINE CHARTS ON CANVAS
// ==========================================
function drawStockChart(canvasId, historyData, symbol) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  
  // Set scale for high DPI screens
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  if (!historyData || historyData.length === 0) return;

  // 1. Calculate boundaries
  const prices = historyData.map(d => d.price);
  const minPrice = Math.min(...prices) * 0.98; // add padding
  const maxPrice = Math.max(...prices) * 1.02; // add padding
  const priceRange = maxPrice - minPrice;

  const pointsCount = historyData.length;
  const paddingX = 40;
  const paddingY = 20;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Coordinate helper functions
  const getX = (index) => paddingX + (index / (pointsCount - 1)) * chartWidth;
  const getY = (price) => paddingY + chartHeight - ((price - minPrice) / priceRange) * chartHeight;

  // 2. Draw Gridlines
  ctx.strokeStyle = "rgba(0, 229, 255, 0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = paddingY + (i / 4) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(paddingX, y);
    ctx.lineTo(width - paddingX, y);
    ctx.stroke();

    // Right y-axis price labels
    const p = maxPrice - (i / 4) * priceRange;
    ctx.fillStyle = "#64748b";
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText(`$${p.toFixed(1)}`, width - paddingX + 6, y + 4);
  }

  // 3. Check trend (Bullish or Bearish relative to start of chart)
  const isUp = prices[prices.length - 1] >= prices[0];
  const glowColor = isUp ? "#00ff87" : "#ff3860";
  const shadowGlow = isUp ? "rgba(0, 255, 135, 0.4)" : "rgba(255, 56, 96, 0.4)";

  // 4. Draw horizontal dashed baseline (start price of chart)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(paddingX, getY(prices[0]));
  ctx.lineTo(width - paddingX, getY(prices[0]));
  ctx.stroke();
  ctx.setLineDash([]); // Reset

  // 5. Draw Glowing Path & Gradient Fill under the curve
  ctx.beginPath();
  ctx.moveTo(getX(0), getY(prices[0]));
  for (let i = 1; i < pointsCount; i++) {
    ctx.lineTo(getX(i), getY(prices[i]));
  }
  
  // Create gradient
  const grad = ctx.createLinearGradient(0, paddingY, 0, height - paddingY);
  if (isUp) {
    grad.addColorStop(0, "rgba(0, 255, 135, 0.15)");
    grad.addColorStop(1, "rgba(0, 255, 135, 0.0)");
  } else {
    grad.addColorStop(0, "rgba(255, 56, 96, 0.15)");
    grad.addColorStop(1, "rgba(255, 56, 96, 0.0)");
  }

  // Fill area under line
  const fillPath = new Path2D();
  fillPath.moveTo(getX(0), height - paddingY);
  fillPath.lineTo(getX(0), getY(prices[0]));
  for (let i = 1; i < pointsCount; i++) {
    fillPath.lineTo(getX(i), getY(prices[i]));
  }
  fillPath.lineTo(getX(pointsCount - 1), height - paddingY);
  fillPath.closePath();
  ctx.fillStyle = grad;
  ctx.fill(fillPath);

  // 6. Draw Glowing Trendline
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 2.5;
  ctx.shadowColor = shadowGlow;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(getX(0), getY(prices[0]));
  for (let i = 1; i < pointsCount; i++) {
    ctx.lineTo(getX(i), getY(prices[i]));
  }
  ctx.stroke();

  // Reset shadow effects
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";

  // 7. Draw Endpoint Indicator dot
  const lastX = getX(pointsCount - 1);
  const lastY = getY(prices[pointsCount - 1]);
  ctx.fillStyle = glowColor;
  ctx.beginPath();
  ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
  ctx.fill();

  // Outer pulse circle
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
  ctx.stroke();
}
