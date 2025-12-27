import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import ExpertButton from "./ExpertButton"
import axios from "axios"

const ExpertFinder = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [crystals, setCrystals] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [experts, setExperts] = useState([])          // ⭐ NEW
  const [aiMessage, setAiMessage] = useState("")      // ⭐ NEW

  const containerRef = useRef(null)

  // Initialize crystals
  useEffect(() => {
    const initialCrystals = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.6 + 0.3,
    }))
    setCrystals(initialCrystals)
  }, [])

  // Track mouse
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Crystal animation toward mouse
  useEffect(() => {
    if (!crystals.length) return
    let animationId

    const animate = () => {
      setCrystals((prev) =>
        prev.map((c) => {
          const dx = mousePos.x - c.x
          const dy = mousePos.y - c.y
          const dist = Math.sqrt(dx*dx + dy*dy)
          const speed = 0.8 + (c.size / 6) * 0.5

          return {
            ...c,
            x: c.x + (dist > 10 ? (dx / dist) * speed : 0),
            y: c.y + (dist > 10 ? (dy / dist) * speed : 0),
          }
        })
      )
      animationId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationId)
  }, [mousePos, crystals.length])

  // ⭐ MAIN LOGIC: User Query → Backend → Show results
  const handleUserQuery = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true)
      setExperts([])
      setAiMessage("")

      const res = await axios.post("http://localhost:5030/api/v1/fastapi/search-experts", {
        query
      })

      const data = res.data

      console.log("data::",data)

      setExperts(data.experts || [])
      setAiMessage(data.aiRecommendation || "")
      setLoading(false)

    } catch (err) {
      console.error("Error:", err.message)
      setLoading(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-gradient-to-br from-black via-slate-950 to-black overflow-hidden flex items-center justify-center"
    >
      {/* Crystal Background */}
      {crystals.map(c => (
        <motion.div key={c.id} className="absolute pointer-events-none"
          style={{ left: c.x, top: c.y, width: c.size, height: c.size }}>
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${c.opacity}), rgba(147,197,253,${c.opacity*0.6}), transparent)`,
              boxShadow: `0 0 ${c.size * 2}px rgba(147,197,253,${c.opacity})`,
              filter: "blur(0.5px)",
            }}
          />
        </motion.div>
      ))}

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Find the Right Expert <span className="text-indigo-400">Instantly.</span>
        </h1>

        <p className="text-gray-400 text-lg mb-10">
          Describe your need — AI finds the perfect consultant, coach or mentor.
        </p>

        {/* Search bar */}
        <div className="flex gap-2 mb-10 backdrop-blur-sm bg-slate-900/30 p-2 rounded-lg border border-slate-800">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUserQuery()}
            placeholder='e.g. "I need a finance mentor for investment"'
            className="flex-1 bg-transparent text-white px-4 py-3 outline-none"
          />
          <ExpertButton onClick={handleUserQuery} />
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-indigo-400 mt-6 animate-pulse">Finding experts…</p>
        )}

        {/* AI Recommendation */}
        {!loading && aiMessage && (
          <div className="mt-10 text-left bg-slate-800/30 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-xl font-semibold text-indigo-300 mb-2">
              🔮 AI Recommendation
            </h3>
            <p className="text-gray-300 leading-relaxed">{aiMessage}</p>
          </div>
        )}

        {/* Expert Cards */}
        {!loading && experts.length > 0 && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {experts.map((ex, i) => (
              <div
                key={ex._id || i}
                className="p-5 rounded-xl bg-slate-900/40 border border-slate-700 shadow-lg hover:border-indigo-400 transition"
              >
                <h4 className="text-white text-xl font-semibold">
                  {ex.firstName} {ex.lastName}
                </h4>
                <p className="text-sm text-gray-400">
                  {ex.credentials?.domain} — {ex.credentials?.experienceYears} yrs
                </p>

                <p className="text-gray-300 mt-2 line-clamp-3">{ex.bio}</p>

                <button className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && query && experts.length === 0 && aiMessage === "" && (
          <p className="text-gray-400 mt-6">No experts found yet… try another query.</p>
        )}
      </div>
    </div>
  )
}

export default ExpertFinder
