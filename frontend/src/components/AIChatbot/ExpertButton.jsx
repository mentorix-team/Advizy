import { useState } from "react"
import { ChevronRight, ArrowRight } from "lucide-react"

export default function ExpertButton({ onClick }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {isHovered ? <ArrowRight size={20} /> : <ChevronRight size={20} />}
    </button>
  )
}
