// This component is used to wrap the auth forms and a testimonial in
// a responsive split grid layout that only shows the right pane on larger
//  screens.
export function AuthSplitGrid({ children }: { children?: React.ReactNode }) {
  return (
    <div className="grid lg:grid-cols-2 min-h-screen bg-background">
      {/* Left pane - Auth form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">{children}</div>
      </div>

      {/* Right pane - Testimonial */}
      <div className="hidden lg:block bg-muted/10 w-full h-full">
        <div className="flex items-center justify-center h-full p-16">
          <blockquote className="space-y-2">
            <p className="text-2xl">
              "This is lit. It took me less than 10 minutes to setup, the DX is
              just amazing."
            </p>
            <footer className="text-sm">
              <div className="font-semibold">@saxxone</div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
