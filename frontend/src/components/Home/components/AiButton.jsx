import { Sparkles } from "lucide-react"

export default function AiButton({handleClick}) {
    return (
        <button
            onClick={handleClick}
            className="relative px-8 py-3 top-1 text-white font-bold rounded-xl overflow-hidden transition-all duration-500 ease-out"
            style={{
                background: "linear-gradient(90deg, #1e40af, #2563eb, #0ea5e9, #06b6d4, #0ea5e9, #2563eb, #1e40af)",
                backgroundSize: "200% 100%",
                animation: "gradient-shift 3s ease infinite",
            }}
        >
            <span className="relative flex items-center gap-4">
                <Sparkles className="w-5 h-5" />
                Ask Our AI
            </span>
        </button>
    )
}
