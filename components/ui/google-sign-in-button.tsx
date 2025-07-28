import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { GoogleLogo } from "@/components/ui/google-logo"

interface GoogleSignInButtonProps {
  onClick: () => void
  isLoading: boolean
  label?: string
}

export function GoogleSignInButton({ 
  onClick, 
  isLoading, 
  label = "Continue with Google" 
}: GoogleSignInButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full border-amber-200 hover:bg-amber-50 bg-transparent relative h-11"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <div className="flex items-center justify-center gap-2">
            <GoogleLogo className="w-5 h-5" />
            <span>{label}</span>
          </div>
        </>
      )}
    </Button>
  )
}
