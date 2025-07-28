import { Brain, BookOpen, Heart, Users, Star } from "lucide-react"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"

const features = [
  {
    Icon: Brain,
    name: "AI-Powered Insights",
    description:
      "Get personalized interpretations and explanations of Gita verses tailored to your life situations and spiritual questions.",
    href: "#ai-insights",
    cta: "Explore Wisdom",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-orange-100/50">
        <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-2xl opacity-60" />
        <div className="absolute bottom-8 left-8 w-24 h-24 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full blur-xl opacity-40" />
      </div>
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: BookOpen,
    name: "Sacred Text Explorer",
    description:
      "Navigate through the complete Bhagavad Gita with intelligent search, cross-references, and contextual understanding.",
    href: "#text-explorer",
    cta: "Start Reading",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 to-orange-50/80">
        <div className="absolute top-6 right-6 w-20 h-20 bg-amber-300/30 rounded-lg rotate-12 blur-sm" />
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-orange-300/30 rounded-lg -rotate-6 blur-sm" />
      </div>
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Heart,
    name: "Daily Wisdom",
    description:
      "Receive daily verses and reflections that resonate with your spiritual journey and current circumstances.",
    href: "#daily-wisdom",
    cta: "Get Inspired",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 to-amber-50/80">
        <div className="absolute top-8 left-8 w-12 h-12 bg-amber-400/20 rounded-full blur-md" />
        <div className="absolute bottom-6 right-6 w-16 h-16 bg-orange-400/20 rounded-full blur-lg" />
      </div>
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Star,
    name: "Meditation Guidance",
    description: "AI-curated meditation sessions and breathing exercises based on Gita teachings for inner peace.",
    href: "#meditation",
    cta: "Find Peace",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/60 to-orange-100/60">
        <div className="absolute top-4 left-4 w-8 h-8 bg-amber-500/20 rounded-full animate-pulse" />
        <div className="absolute bottom-8 right-8 w-6 h-6 bg-orange-500/20 rounded-full animate-pulse delay-1000" />
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Users,
    name: "Spiritual Community",
    description:
      "Connect with fellow seekers, share insights, and participate in meaningful discussions about spiritual growth and Gita wisdom.",
    href: "#community",
    cta: "Join Community",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 to-amber-50/80">
        <div className="absolute top-6 right-4 w-14 h-14 bg-gradient-to-br from-amber-200/40 to-orange-200/40 rounded-full blur-md" />
        <div className="absolute bottom-4 left-6 w-10 h-10 bg-gradient-to-br from-orange-200/40 to-amber-200/40 rounded-full blur-sm" />
        <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-amber-300/30 rounded-full blur-sm transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
]

function GitaAIFeatures() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  )
}

export { GitaAIFeatures }
