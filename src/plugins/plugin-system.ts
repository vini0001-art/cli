import { EventEmitter } from "events"
import type { Store } from "../state/store.js"
import type { Router } from "../router/router.js"

// Plugin types
export interface Plugin {
  name: string
  version: string
  install: (context: PluginContext) => void | Promise<void>
  uninstall?: (context: PluginContext) => void | Promise<void>
  dependencies?: string[]
  config?: Record<string, any>
}

export interface PluginContext {
  store: Store
  router: Router
  hooks: HookSystem
  config: Record<string, any>
  utils: PluginUtils
}

export interface Hook {
  name: string
  handler: (...args: any[]) => any
  priority?: number
}

export interface PluginUtils {
  addComponent: (name: string, component: any) => void
  addDirective: (name: string, directive: any) => void
  addFilter: (name: string, filter: Function) => void
  addMiddleware: (middleware: any) => void
}

// Hook system for plugin extensibility
export class HookSystem extends EventEmitter {
  private hooks: Map<string, Hook[]> = new Map()

  // Register a hook
  addHook(name: string, handler: Function, priority = 10): void {
    if (!this.hooks.has(name)) {
      this.hooks.set(name, [])
    }

    const hooks = this.hooks.get(name)!
    hooks.push({ name, handler, priority })

    // Sort by priority (lower number = higher priority)
    hooks.sort((a, b) => (a.priority || 10) - (b.priority || 10))
  }

  // Execute hooks
  async executeHook(name: string, ...args: any[]): Promise<any[]> {
    const hooks = this.hooks.get(name) || []
    const results: any[] = []

    for (const hook of hooks) {
      try {
        const result = await hook.handler(...args)
        results.push(result)
      } catch (error) {
        console.error(`Hook ${name} failed:`, error)
      }
    }

    return results
  }

  // Execute hooks with data transformation
  async applyFilters(name: string, data: any, ...args: any[]): Promise<any> {
    const hooks = this.hooks.get(name) || []
    let result = data

    for (const hook of hooks) {
      try {
        result = await hook.handler(result, ...args)
      } catch (error) {
        console.error(`Filter ${name} failed:`, error)
      }
    }

    return result
  }

  // Remove hook
  removeHook(name: string, handler: Function): void {
    const hooks = this.hooks.get(name)
    if (hooks) {
      const index = hooks.findIndex((h) => h.handler === handler)
      if (index !== -1) {
        hooks.splice(index, 1)
      }
    }
  }

  // Get all hooks for a name
  getHooks(name: string): Hook[] {
    return this.hooks.get(name) || []
  }
}

// Main plugin manager
export class PluginManager extends EventEmitter {
  private plugins: Map<string, Plugin> = new Map()
  private installedPlugins: Set<string> = new Set()
  private context: PluginContext
  private hooks: HookSystem

  constructor(store: Store, router: Router) {
    super()
    this.hooks = new HookSystem()

    this.context = {
      store,
      router,
      hooks: this.hooks,
      config: {},
      utils: {
        addComponent: this.addComponent.bind(this),
        addDirective: this.addDirective.bind(this),
        addFilter: this.addFilter.bind(this),
        addMiddleware: this.addMiddleware.bind(this),
      },
    }
  }

  // Register a plugin
  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} is already registered`)
    }

    this.plugins.set(plugin.name, plugin)
    this.emit("pluginRegistered", plugin)
  }

  // Install a plugin
  async install(pluginName: string, config: Record<string, any> = {}): Promise<void> {
    const plugin = this.plugins.get(pluginName)

    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`)
    }

    if (this.installedPlugins.has(pluginName)) {
      console.warn(`Plugin ${pluginName} is already installed`)
      return
    }

    // Check dependencies
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!this.installedPlugins.has(dep)) {
          throw new Error(`Plugin ${pluginName} requires ${dep} to be installed first`)
        }
      }
    }

    try {
      // Merge config
      this.context.config = { ...plugin.config, ...config }

      // Install plugin
      await plugin.install(this.context)

      this.installedPlugins.add(pluginName)
      this.emit("pluginInstalled", plugin)

      console.log(`✅ Plugin ${pluginName} installed successfully`)
    } catch (error) {
      console.error(`❌ Failed to install plugin ${pluginName}:`, error)
      throw error
    }
  }

  // Uninstall a plugin
  async uninstall(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName)

    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`)
    }

    if (!this.installedPlugins.has(pluginName)) {
      console.warn(`Plugin ${pluginName} is not installed`)
      return
    }

    try {
      if (plugin.uninstall) {
        await plugin.uninstall(this.context)
      }

      this.installedPlugins.delete(pluginName)
      this.emit("pluginUninstalled", plugin)

      console.log(`✅ Plugin ${pluginName} uninstalled successfully`)
    } catch (error) {
      console.error(`❌ Failed to uninstall plugin ${pluginName}:`, error)
      throw error
    }
  }

  // Get installed plugins
  getInstalledPlugins(): string[] {
    return Array.from(this.installedPlugins)
  }

  // Get available plugins
  getAvailablePlugins(): string[] {
    return Array.from(this.plugins.keys())
  }

  // Get plugin info
  getPluginInfo(pluginName: string): Plugin | undefined {
    return this.plugins.get(pluginName)
  }

  // Plugin utility methods
  private addComponent(name: string, component: any): void {
    // Add component to global registry
    console.log(`Component ${name} registered by plugin`)
  }

  private addDirective(name: string, directive: any): void {
    // Add directive to global registry
    console.log(`Directive ${name} registered by plugin`)
  }

  private addFilter(name: string, filter: Function): void {
    // Add filter to global registry
    this.hooks.addHook(`filter:${name}`, filter)
  }

  private addMiddleware(middleware: any): void {
    // Add middleware to router or store
    console.log("Middleware registered by plugin")
  }

  // Get hooks system
  getHooks(): HookSystem {
    return this.hooks
  }
}

// Built-in plugins
export const authPlugin: Plugin = {
  name: "auth",
  version: "1.0.0",
  install: async (context) => {
    // Add auth state to store
    context.store.addReducer("auth", (state = { user: null, token: null }, action) => {
      switch (action.type) {
        case "AUTH_LOGIN":
          return { ...state, user: action.payload.user, token: action.payload.token }
        case "AUTH_LOGOUT":
          return { ...state, user: null, token: null }
        default:
          return state
      }
    })

    // Add auth guard to router
    context.router.addGuard({
      name: "requireAuth",
      handler: (to, from) => {
        const state = context.store.getState()
        return !!state.auth?.token
      },
    })

    console.log("🔐 Auth plugin installed")
  },
}

export const themePlugin: Plugin = {
  name: "theme",
  version: "1.0.0",
  install: async (context) => {
    // Add theme state
    context.store.addReducer("theme", (state = { current: "light", available: ["light", "dark"] }, action) => {
      switch (action.type) {
        case "THEME_SET":
          return { ...state, current: action.payload }
        default:
          return state
      }
    })

    // Add theme utilities
    context.utils.addFilter("theme", (value: string) => {
      const state = context.store.getState()
      return `${value} theme-${state.theme?.current || "light"}`
    })

    console.log("🎨 Theme plugin installed")
  },
}

export const analyticsPlugin: Plugin = {
  name: "analytics",
  version: "1.0.0",
  config: {
    trackingId: "",
    enablePageViews: true,
    enableEvents: true,
  },
  install: async (context) => {
    const { trackingId, enablePageViews, enableEvents } = context.config

    if (!trackingId) {
      console.warn("Analytics plugin: No tracking ID provided")
      return
    }

    // Track page views
    if (enablePageViews) {
      context.router.on("navigate", (event) => {
        // Track page view
        console.log(`📊 Page view: ${event.to.path}`)
      })
    }

    // Add event tracking hook
    if (enableEvents) {
      context.hooks.addHook("analytics:track", (event: string, data: any) => {
        console.log(`📊 Event: ${event}`, data)
      })
    }

    console.log("📊 Analytics plugin installed")
  },
}

// Create default plugin manager
export function createPluginManager(store: Store, router: Router): PluginManager {
  const manager = new PluginManager(store, router)

  // Register built-in plugins
  manager.register(authPlugin)
  manager.register(themePlugin)
  manager.register(analyticsPlugin)

  return manager
}
