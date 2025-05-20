import { SeverityWidget } from "@/components/ui/severity-widget"

export default function SeverityDemo() {
  return (
    <div className="flex flex-wrap gap-8 p-8">
      <SeverityWidget score={2.3} severity="low" />
      <SeverityWidget score={5.7} severity="medium" />
      <SeverityWidget score={7.8} severity="high" />
      <SeverityWidget score={9.2} severity="critical" />
    </div>
  )
} 