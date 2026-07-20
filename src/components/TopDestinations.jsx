import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getCachedDestinations, setCachedDestinations } from "../utils/dataCache"
import { apiEndpoints } from "../config/api"

const indianKeywords = [
  "india", "kerala", "goa", "kashmir", "manali", "rajasthan", "himachal",
  "uttarakhand", "sikkim", "andaman", "ladakh", "darjeeling", "meghalaya",
  "mumbai", "delhi", "gujarat", "karnataka", "tamil nadu", "munnar",
  "wayanad", "ooty", "coorg", "agra", "jaipur", "udaipur", "jaisalmer",
  "rishikesh", "shimla", "dalhousie", "dharamshala", "north east",
  "northeast", "assam", "arunachal"
]

const isDomestic = (name) => {
  if (!name) return false
  const lower = name.toLowerCase()
  return indianKeywords.some(k => lower.includes(k))
}

const accents = [
  { text: "#e85d26", bg: "#fff3ee", border: "#ffd4bc", glow: "rgba(232, 93, 38, 0.12)" },
  { text: "#4361ee", bg: "#eff2ff", border: "#c5ceff", glow: "rgba(67, 97, 238, 0.12)" },
  { text: "#059669", bg: "#ecfdf5", border: "#a7f3d0", glow: "rgba(5, 150, 105, 0.12)" },
  { text: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", glow: "rgba(124, 58, 237, 0.12)" },
  { text: "#d97706", bg: "#fffbeb", border: "#fde68a", glow: "rgba(217, 119, 6, 0.12)" },
  { text: "#dc2626", bg: "#fef2f2", border: "#fecaca", glow: "rgba(220, 38, 38, 0.12)" },
  { text: "#0891b2", bg: "#ecfeff", border: "#a5f3fc", glow: "rgba(8, 145, 178, 0.12)" },
  { text: "#db2777", bg: "#fdf2f8", border: "#fbcfe8", glow: "rgba(219, 39, 119, 0.12)" },
]

const destMeta = {
  "kerala":      { icon: "fa-water",           tag: "God's Own Country" },
  "goa":         { icon: "fa-umbrella-beach",  tag: "Beach Paradise" },
  "kashmir":     { icon: "fa-mountain",        tag: "Heaven on Earth" },
  "manali":      { icon: "fa-snowflake",       tag: "Snow Valley" },
  "rajasthan":   { icon: "fa-chess-rook",      tag: "Royal Heritage" },
  "sikkim":      { icon: "fa-mountain",        tag: "Mountain Paradise" },
  "andaman":     { icon: "fa-water",           tag: "Island Escape" },
  "ladakh":      { icon: "fa-mountain",        tag: "Land of High Passes" },
  "shimla":      { icon: "fa-tree",            tag: "Queen of Hills" },
  "himachal":    { icon: "fa-mountain",        tag: "Dev Bhoomi" },
  "uttarakhand": { icon: "fa-mountain",        tag: "Land of Gods" },
  "darjeeling":  { icon: "fa-mug-hot",         tag: "Tea Gardens" },
  "meghalaya":   { icon: "fa-cloud",           tag: "Abode of Clouds" },
  "north east":  { icon: "fa-leaf",            tag: "Unexplored Beauty" },
  "northeast":   { icon: "fa-leaf",            tag: "Unexplored Beauty" },
  "bhutan":      { icon: "fa-landmark",        tag: "Thunder Dragon" },
  "vietnam":     { icon: "fa-torii-gate",      tag: "Timeless Charm" },
  "bali":        { icon: "fa-sun",             tag: "Island of Gods" },
  "dubai":       { icon: "fa-city",            tag: "City of Gold" },
  "europe":      { icon: "fa-globe-europe",    tag: "Cultural Wonders" },
  "thailand":    { icon: "fa-umbrella-beach",  tag: "Land of Smiles" },
  "singapore":   { icon: "fa-city",            tag: "Garden City" },
  "maldives":    { icon: "fa-water",           tag: "Tropical Paradise" },
  "sri lanka":   { icon: "fa-water",           tag: "Pearl of Indian Ocean" },
  "nepal":       { icon: "fa-mountain",        tag: "Roof of the World" },
  "japan":       { icon: "fa-torii-gate",      tag: "Land of Rising Sun" },
  "australia":   { icon: "fa-globe-asia",      tag: "Down Under" },
  "usa":         { icon: "fa-flag-usa",        tag: "Dream Destination" },
  "uk":          { icon: "fa-landmark",        tag: "Royal Kingdom" },
}

const getMeta = (name) => {
  if (!name) return { icon: "fa-map-marker-alt", tag: null }
  const lower = name.toLowerCase()
  for (const [key, meta] of Object.entries(destMeta)) {
    if (lower.includes(key)) return meta
  }
  if (!isDomestic(name)) return { icon: "fa-plane", tag: null }
  return { icon: "fa-map-marker-alt", tag: null }
}

const styles = `
  .tdest-section {
    padding: 80px 0 90px;
    background-color: #f8f9fc;
    background-image:
      linear-gradient(135deg, rgba(248,249,252,0.95) 0%, rgba(255,255,255,0.92) 100%),
      url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
  }
  .tdest-section::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent);
  }
  @keyframes tdestPulse {
    0% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 0.6; }
  }
  .tdest-blob {
    position: absolute;
    top: -150px; left: -100px;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(67,97,238,0.04) 0%, transparent 70%);
    pointer-events: none;
    animation: tdestPulse 8s infinite alternate ease-in-out;
    z-index: 0;
  }
  .tdest-card {
    background: #fff;
    border-radius: 18px;
    padding: 24px 22px 20px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  @keyframes tdestShine {
    from { left: -100%; }
    to { left: 200%; }
  }
  .tdest-card::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transform: skewX(-15deg);
    pointer-events: none;
    z-index: 1;
  }
  .tdest-card:hover {
    transform: translateY(-10px) scale(1.02);
  }
  .tdest-card:hover::after {
    animation: tdestShine 0.6s ease forwards;
  }
  .tdest-icon-box {
    width: 54px; height: 54px;
    border-radius: 15px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.35rem;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative; z-index: 2;
    flex-shrink: 0;
  }
  .tdest-card:hover .tdest-icon-box {
    transform: scale(1.18) rotate(6deg);
    border-radius: 11px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  }
  .tdest-badge {
    font-size: 0.58rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    padding: 4px 10px;
    border-radius: 20px;
    background: #f8fafc;
    color: #64748b;
    border: 1px solid #e2e8f0;
    position: relative; z-index: 2;
    white-space: nowrap;
  }
  .tdest-explore {
    width: 30px; height: 30px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative; z-index: 2;
    font-size: 0.65rem;
  }
  .tdest-card:hover .tdest-explore {
    transform: scale(1.18) translateX(2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
  @media (max-width: 768px) { .tdest-section { padding: 56px 0 64px; } }
  @media (max-width: 480px) { .tdest-section { padding: 44px 0 52px; } }
`

function TopDestinations() {
  const navigate = useNavigate()
  const [tab, setTab] = useState("all")
  const cachedDestinations = getCachedDestinations()
  const [destinations, setDestinations] = useState(cachedDestinations || [])
  const [loading, setLoading] = useState(!cachedDestinations)

  useEffect(() => {
    if (cachedDestinations) return
    let active = true
    const fetchData = async () => {
      try {
        const res = await fetch(apiEndpoints.getDestinations)
        const json = await res.json()
        const dests = json.data?.destinations || []
        if (active) {
          setCachedDestinations(dests)
          setDestinations(dests)
          setLoading(false)
        }
      } catch (err) {
        console.error("Error fetching destinations:", err)
        if (active) setTimeout(fetchData, 3000)
      }
    }
    fetchData()
    return () => { active = false }
  }, [cachedDestinations])

  const filtered = tab === "all"
    ? destinations.slice(0, 8)
    : tab === "domestic"
      ? destinations.filter(d => isDomestic(d.name)).slice(0, 8)
      : destinations.filter(d => !isDomestic(d.name)).slice(0, 8)

  const totalTours = destinations.reduce((sum, d) => sum + (d.count || 0), 0)
  const domesticCount = destinations.filter(d => isDomestic(d.name)).length
  const internationalCount = destinations.filter(d => !isDomestic(d.name)).length

  const handleClick = (dest) => {
    const words = dest.name.toLowerCase()
      .split(/[\s,&-]+/)
      .filter(w => w.length > 2 && !["india","the","and","tours","tour","travel","package","packages"].includes(w))
    const query = words.slice(0, 2).join(" ")
    navigate(`/packages?destination=${encodeURIComponent(query)}#package-list`)
  }

  const pillClass = (active) =>
    `px-6 py-2.5 rounded-xl border-none text-sm font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap ${
      active ? "bg-white text-slate-900 shadow-sm" : "bg-transparent text-slate-500 hover:text-slate-900"
    }`

  if (loading) {
    return (
      <section className="tdest-section">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="max-w-5xl mx-auto px-5 relative z-10 text-center py-16">
          <p className="text-slate-400">Loading destinations...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="tdest-section">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="tdest-blob"></div>

      <div className="max-w-5xl mx-auto px-5 relative z-10">

        {/* Header */}
        <div className="text-center mb-11">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-500 mb-3.5">
            <i className="fas fa-compass"></i>
            Popular Destinations
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-3 leading-tight tracking-tight">
            Explore Top Destinations
          </h2>
          <p className="text-sm text-slate-500 mx-auto mb-7 leading-relaxed max-w-lg">
            Handpicked destinations loved by thousands of happy travellers — discover your perfect getaway
          </p>

          {/* Filter Pills */}
          <div className="inline-flex gap-1 bg-slate-100 rounded-xl p-1">
            <button className={pillClass(tab === "all")} onClick={() => setTab("all")}>All Places</button>
            <button className={pillClass(tab === "domestic")} onClick={() => setTab("domestic")}>🇮🇳 India</button>
            <button className={pillClass(tab === "international")} onClick={() => setTab("international")}>✈️ International</button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((dest, i) => {
            const accent = accents[i % accents.length]
            const meta = getMeta(dest.name)
            const domestic = isDomestic(dest.name)
            return (
              <div
                key={dest.id || dest._id || i}
                className="tdest-card"
                onClick={() => handleClick(dest)}
                style={{
                  borderTop: `3px solid ${accent.border}`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 40px -8px ${accent.glow}, 0 8px 16px -4px rgba(0,0,0,0.06)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04)"
                }}
              >
                <div className="relative z-10 flex flex-col h-full">

                  {/* Top: Icon + Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="tdest-icon-box" style={{ backgroundColor: accent.bg, color: accent.text }}>
                      <i className={`fas ${meta.icon}`}></i>
                    </div>
                    <span className="tdest-badge">{domestic ? "🇮🇳 Domestic" : "✈️ Int'l"}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 mb-5">
                    <h3 className="text-lg font-extrabold text-slate-900 mb-1 leading-tight">{dest.name}</h3>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                      <i className="fas fa-map-pin text-xs" style={{ color: accent.text }}></i>
                      {meta.tag || dest.description || "Popular Destination"}
                    </p>
                  </div>

                  {/* Footer */}
                  <div
                    className="flex items-center justify-between pt-4"
                    style={{ borderTop: `1.5px dashed ${accent.border}` }}
                  >
                    <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: accent.text }}>
                      <i className="fas fa-suitcase-rolling"></i>
                      {dest.count} {dest.count === 1 ? "Package" : "Packages"}
                    </span>
                    <div
                      className="tdest-explore"
                      style={{
                        backgroundColor: accent.bg,
                        color: accent.text,
                        border: `1.5px solid ${accent.border}`,
                      }}
                    >
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>

        {/* Stats Bar */}
        <div className="flex justify-center gap-12 mt-12 pt-10 border-t border-slate-200 flex-wrap">
          {[
            { num: `${destinations.length}+`, label: "Destinations" },
            { num: `${totalTours}+`, label: "Tour Packages" },
            { num: domesticCount, label: "Indian Destinations" },
            { num: internationalCount, label: "International" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <span className="text-2xl font-extrabold text-slate-900 block leading-none mb-1.5">{stat.num}</span>
              <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TopDestinations
