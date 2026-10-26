import { IconBox, IconCheck } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'

import LoginForm from '@/components/block/auth/login-form'
import ThemeToggle from '@/components/block/common/theme-toggle'
import { APP_NAME } from '@/lib/app-name'
import { redirectIfAuthenticated } from '@/lib/auth/handler'

export const Route = createFileRoute('/sign-in/')({
  beforeLoad: () => redirectIfAuthenticated('/dashboard'),
  component: RouteComponent,
})

const HIGHLIGHTS = [
  'Single-tenant by design — one workspace, no tenant switching.',
  'Go API and React SPA shipped as one binary.',
  'Role-aware navigation backed by a real session.',
]

function RouteComponent() {
  return (
    <div className="bg-background grid min-h-svh lg:grid-cols-[1.1fr_1fr]">
      <aside className="bg-sidebar border-sidebar-border relative hidden flex-col justify-between border-r p-10 lg:flex">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg">
            <IconBox className="size-6" />
          </div>
          <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
        </div>

        <div className="flex max-w-md flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance">
              A focused admin surface, ready on day one.
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sign in to manage master data and watch the API status in real time.
            </p>
          </div>

          <ul className="flex flex-col gap-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-muted-foreground text-xs">
          {APP_NAME} starter kit · Fiber · PostgreSQL · React
        </p>
      </aside>

      <main className="relative flex flex-col items-center justify-center p-6 md:p-10">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
