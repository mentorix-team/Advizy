import { Users, Search } from "lucide-react"

export default function NoExpertsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
          <Users className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-background border-2 border-background rounded-full flex items-center justify-center">
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">No experts found</h3>

      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't find any experts matching your criteria. Try adjusting your search or filters to discover more
        professionals.
      </p>
    </div>
  )
}
