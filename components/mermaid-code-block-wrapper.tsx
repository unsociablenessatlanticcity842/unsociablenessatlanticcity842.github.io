import dynamic from 'next/dynamic'

// Loading component while Mermaid loads
const LoadingMermaid = () => (
  <div className="group relative my-6 overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-sm">
    {/* Header */}
    <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-4 py-2">
      <div className="flex items-center gap-3">
        {/* Language Badge */}
        <span className="text-xs font-medium text-muted-foreground">
          mermaid
        </span>
      </div>
    </div>
    
    {/* Loading Content */}
    <div className="p-6">
      <div className="flex items-center justify-center py-8">
        <svg className="animate-spin h-5 w-5 mr-3 text-muted-foreground" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-muted-foreground">다이어그램 로딩 중...</span>
      </div>
    </div>
  </div>
)

// Dynamically import MermaidCodeBlock with no SSR
export const MermaidCodeBlockWrapper = dynamic(
  () => import('./mermaid-code-block').then(mod => mod.MermaidCodeBlock),
  {
    ssr: false,
    loading: () => <LoadingMermaid />
  }
)