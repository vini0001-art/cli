import { EventEmitter } from "events"
import path from "path"
import fs from "fs-extra"

export interface Route {
  path: string
  component: string
  exact?: boolean
  children?: Route[]
  meta?: Record<string, any>
  guards?: RouteGuard[]
}

export interface RouteGuard {
  name: string
  handler: (to: Route, from?: Route) => boolean | Promise<boolean>
}

export interface RouteContext {
  params: Record<string, string>
  query: Record<string, string>
  hash: string
  fullPath: string
}

export class Router extends EventEmitter {
  private routes: Route[] = []
  private currentRoute: Route | null = null
  private guards: Map<string, RouteGuard> = new Map()
  private history: string[] = []

  constructor() {
    super()
    this.setupBrowserHistory()
  }

  // Add route
  addRoute(route: Route): void {
    this.routes.push(route)
  }

  // Add multiple routes
  addRoutes(routes: Route[]): void {
    this.routes.push(...routes)
  }

  // Add route guard
  addGuard(guard: RouteGuard): void {
    this.guards.set(guard.name, guard)
  }

  // Navigate to route
  async navigate(path: string): Promise<void> {
    const route = this.matchRoute(path)

    if (!route) {
      throw new Error(`Route not found: ${path}`)
    }

    // Run guards
    const canNavigate = await this.runGuards(route, this.currentRoute)

    if (!canNavigate) {
      return
    }

    // Update history
    this.history.push(path)
    this.currentRoute = route

    // Update browser URL
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", path)
    }

    // Emit navigation event
    this.emit("navigate", {
      to: route,
      from: this.currentRoute,
      context: this.createRouteContext(path, route),
    })
  }

  // Go back in history
  back(): void {
    if (this.history.length > 1) {
      this.history.pop()
      const previousPath = this.history[this.history.length - 1]
      this.navigate(previousPath)
    }
  }

  // Get current route
  getCurrentRoute(): Route | null {
    return this.currentRoute
  }

  // Match route by path
  private matchRoute(path: string): Route | null {
    for (const route of this.routes) {
      if (this.isRouteMatch(route, path)) {
        return route
      }
    }
    return null
  }

  // Check if route matches path
  private isRouteMatch(route: Route, path: string): boolean {
    if (route.exact) {
      return route.path === path
    }

    // Handle dynamic routes
    const routeSegments = route.path.split("/")
    const pathSegments = path.split("/")

    if (routeSegments.length !== pathSegments.length) {
      return false
    }

    for (let i = 0; i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i]
      const pathSegment = pathSegments[i]

      // Dynamic segment
      if (routeSegment.startsWith(":")) {
        continue
      }

      // Exact match required
      if (routeSegment !== pathSegment) {
        return false
      }
    }

    return true
  }

  // Run route guards
  private async runGuards(to: Route, from?: Route | null): Promise<boolean> {
    const routeGuards = to.guards || []

    for (const guardRef of routeGuards) {
      const guard = this.guards.get(guardRef.name)

      if (guard) {
        const canProceed = await guard.handler(to, from || undefined)
        if (!canProceed) {
          return false
        }
      }
    }

    return true
  }

  // Create route context
  private createRouteContext(path: string, route: Route): RouteContext {
    const url = new URL(path, "http://localhost")
    const params = this.extractParams(route.path, path)

    return {
      params,
      query: Object.fromEntries(url.searchParams),
      hash: url.hash,
      fullPath: path,
    }
  }

  // Extract route parameters
  private extractParams(routePath: string, actualPath: string): Record<string, string> {
    const params: Record<string, string> = {}
    const routeSegments = routePath.split("/")
    const pathSegments = actualPath.split("/")

    for (let i = 0; i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i]

      if (routeSegment.startsWith(":")) {
        const paramName = routeSegment.slice(1)
        params[paramName] = pathSegments[i]
      }
    }

    return params
  }

  // Setup browser history handling
  private setupBrowserHistory(): void {
    if (typeof window !== "undefined") {
      window.addEventListener("popstate", () => {
        const path = window.location.pathname
        this.navigate(path)
      })
    }
  }
}

// File-based routing
export class FileBasedRouter extends Router {
  private pagesDir: string

  constructor(pagesDir = "app") {
    super()
    this.pagesDir = pagesDir
  }

  // Auto-generate routes from file system
  async generateRoutes(): Promise<void> {
    const routes = await this.scanDirectory(this.pagesDir)
    this.addRoutes(routes)
  }

  // Scan directory for pages
  private async scanDirectory(dir: string, basePath = ""): Promise<Route[]> {
    const routes: Route[] = []

    if (!(await fs.pathExists(dir))) {
      return routes
    }

    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        // Nested routes
        const nestedRoutes = await this.scanDirectory(fullPath, path.join(basePath, entry.name))
        routes.push(...nestedRoutes)
      } else if (entry.name.endsWith(".s4ft")) {
        // Page file
        const routePath = this.filePathToRoute(basePath, entry.name)
        const componentPath = fullPath

        routes.push({
          path: routePath,
          component: componentPath,
          exact: true,
        })
      }
    }

    return routes
  }

  // Convert file path to route path
  private filePathToRoute(basePath: string, fileName: string): string {
    const routePath = basePath

    // Remove .s4ft extension
    const nameWithoutExt = fileName.replace(".s4ft", "")

    // Handle special files
    if (nameWithoutExt === "page" || nameWithoutExt === "index") {
      // index.s4ft or page.s4ft becomes the directory route
      return routePath || "/"
    }

    // Handle dynamic routes
    if (nameWithoutExt.startsWith("[") && nameWithoutExt.endsWith("]")) {
      const paramName = nameWithoutExt.slice(1, -1)
      return path.join(routePath, `:${paramName}`)
    }

    // Regular file
    return path.join(routePath, nameWithoutExt)
  }
}

// Route guards
export const authGuard: RouteGuard = {
  name: "auth",
  handler: async (to, from) => {
    // Check if user is authenticated
    const isAuthenticated = checkAuth() // Implement your auth logic
    return isAuthenticated
  },
}

export const adminGuard: RouteGuard = {
  name: "admin",
  handler: async (to, from) => {
    // Check if user has admin privileges
    const isAdmin = checkAdminRole() // Implement your role logic
    return isAdmin
  },
}

// Helper functions (implement based on your auth system)
function checkAuth(): boolean {
  // Implement authentication check
  return true
}

function checkAdminRole(): boolean {
  // Implement admin role check
  return true
}

// Export default router instance
export const router = new FileBasedRouter()
