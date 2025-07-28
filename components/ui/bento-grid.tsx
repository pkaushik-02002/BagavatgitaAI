import type { ReactNode } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return <div className={cn("grid w-full auto-rows-[22rem] grid-cols-3 gap-4", className)}>{children}</div>
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string
  className: string
  background: ReactNode
  Icon: any
  description: string
  href: string
  cta: string
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-gradient-to-br from-amber-50 to-orange-50 [box-shadow:0_0_0_1px_rgba(245,158,11,.1),0_2px_4px_rgba(245,158,11,.05),0_12px_24px_rgba(245,158,11,.05)]",
      // dark styles
      "transform-gpu dark:bg-gradient-to-br dark:from-amber-950/20 dark:to-orange-950/20 dark:[border:1px_solid_rgba(245,158,11,.2)] dark:[box-shadow:0_-20px_80px_-20px_#f59e0b1f_inset]",
      className,
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <Icon className="h-12 w-12 origin-left transform-gpu text-amber-600 transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="text-xl font-semibold text-gray-800 dark:text-amber-100">{name}</h3>
      <p className="max-w-lg text-gray-600 dark:text-amber-200/80">{description}</p>
    </div>
    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button
        variant="ghost"
        asChild
        size="sm"
        className="pointer-events-auto text-amber-700 hover:text-amber-800 hover:bg-amber-100"
      >
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-amber-500/[.03] group-hover:dark:bg-amber-400/10" />
  </div>
)

export { BentoCard, BentoGrid }
