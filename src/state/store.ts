"use client"

import { EventEmitter } from "events"

// Store types
export interface Action {
  type: string
  payload?: any
  meta?: Record<string, any>
}

export type Reducer<T = any> = (state: T, action: Action) => T

export type Middleware = (store: Store) => (next: (action: Action) => any) => (action: Action) => any

export interface StoreOptions {
  initialState?: Record<string, any>
  middleware?: Middleware[]
  devTools?: boolean
}

// Main Store class
export class Store extends EventEmitter {
  private state: Record<string, any> = {}
  private reducers: Map<string, Reducer> = new Map()
  private middleware: Middleware[] = []
  private isDispatching = false

  constructor(options: StoreOptions = {}) {
    super()
    this.state = options.initialState || {}
    this.middleware = options.middleware || []

    // Enable Redux DevTools if available
    if (options.devTools && typeof window !== "undefined" && (window as any).__REDUX_DEVTOOLS_EXTENSION__) {
      this.setupDevTools()
    }
  }

  // Add reducer
  addReducer<T>(name: string, reducer: Reducer<T>, initialState?: T): void {
    this.reducers.set(name, reducer)

    if (initialState !== undefined) {
      this.state[name] = initialState
    }

    this.emit("reducerAdded", { name, reducer })
  }

  // Remove reducer
  removeReducer(name: string): void {
    this.reducers.delete(name)
    delete this.state[name]
    this.emit("reducerRemoved", { name })
  }

  // Get current state
  getState(): Record<string, any> {
    return { ...this.state }
  }

  // Get state slice
  getStateSlice<T>(name: string): T {
    return this.state[name] as T
  }

  // Dispatch action
  dispatch(action: Action): any {
    if (this.isDispatching) {
      throw new Error("Cannot dispatch while already dispatching")
    }

    this.isDispatching = true

    try {
      // Apply middleware
      let dispatch = this.baseDispatch.bind(this)

      for (let i = this.middleware.length - 1; i >= 0; i--) {
        dispatch = this.middleware[i](this)(dispatch)
      }

      const result = dispatch(action)
      this.emit("actionDispatched", action, this.state)

      return result
    } finally {
      this.isDispatching = false
    }
  }

  // Base dispatch without middleware
  private baseDispatch(action: Action): any {
    const previousState = { ...this.state }

    // Apply reducers
    for (const [name, reducer] of this.reducers) {
      const currentSliceState = this.state[name]
      const newSliceState = reducer(currentSliceState, action)

      if (newSliceState !== currentSliceState) {
        this.state[name] = newSliceState
      }
    }

    // Emit state change if state actually changed
    if (!this.isStateEqual(previousState, this.state)) {
      this.emit("stateChanged", this.state, previousState, action)
    }

    return action
  }

  // Subscribe to state changes
  subscribe(
    listener: (state: Record<string, any>, previousState: Record<string, any>, action: Action) => void,
  ): () => void {
    this.on("stateChanged", listener)

    return () => {
      this.off("stateChanged", listener)
    }
  }

  // Subscribe to specific state slice
  subscribeToSlice<T>(name: string, listener: (state: T, previousState: T, action: Action) => void): () => void {
    const wrappedListener = (state: Record<string, any>, previousState: Record<string, any>, action: Action) => {
      const currentSlice = state[name] as T
      const previousSlice = previousState[name] as T

      if (currentSlice !== previousSlice) {
        listener(currentSlice, previousSlice, action)
      }
    }

    return this.subscribe(wrappedListener)
  }

  // Add middleware
  addMiddleware(middleware: Middleware): void {
    this.middleware.push(middleware)
  }

  // Clear all state
  clear(): void {
    this.state = {}
    this.emit("stateCleared")
  }

  // Reset to initial state
  reset(initialState?: Record<string, any>): void {
    this.state = initialState || {}
    this.emit("stateReset", this.state)
  }

  // Check if states are equal (shallow comparison)
  private isStateEqual(state1: Record<string, any>, state2: Record<string, any>): boolean {
    const keys1 = Object.keys(state1)
    const keys2 = Object.keys(state2)

    if (keys1.length !== keys2.length) {
      return false
    }

    for (const key of keys1) {
      if (state1[key] !== state2[key]) {
        return false
      }
    }

    return true
  }

  // Setup Redux DevTools
  private setupDevTools(): void {
    const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__

    if (devTools) {
      const devToolsInstance = devTools.connect({
        name: "S4FT Store",
        features: {
          pause: true,
          lock: true,
          persist: true,
          export: true,
          import: "custom",
          jump: true,
          skip: true,
          reorder: true,
          dispatch: true,
          test: true,
        },
      })

      this.on("actionDispatched", (action, state) => {
        devToolsInstance.send(action, state)
      })

      devToolsInstance.subscribe((message: any) => {
        if (message.type === "DISPATCH" && message.state) {
          this.state = JSON.parse(message.state)
          this.emit("stateChanged", this.state, {}, { type: "@@DEVTOOLS" })
        }
      })
    }
  }
}

// Built-in middleware
export const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  console.group(`🔄 Action: ${action.type}`)
  console.log("Previous State:", store.getState())
  console.log("Action:", action)

  const result = next(action)

  console.log("Next State:", store.getState())
  console.groupEnd()

  return result
}

export const thunkMiddleware: Middleware = (store) => (next) => (action) => {
  if (typeof action === "function") {
    return action(store.dispatch.bind(store), store.getState.bind(store))
  }

  return next(action)
}

export const crashReporterMiddleware: Middleware = (store) => (next) => (action) => {
  try {
    return next(action)
  } catch (error) {
    console.error("💥 Store Error:", error)
    console.error("Action:", action)
    console.error("State:", store.getState())

    // Report to error tracking service
    if (typeof window !== "undefined" && (window as any).Sentry) {
      ;(window as any).Sentry.captureException(error, {
        extra: {
          action,
          state: store.getState(),
        },
      })
    }

    throw error
  }
}

// Action creators helpers
export function createAction<T = any>(type: string) {
  return (payload?: T, meta?: Record<string, any>): Action => ({
    type,
    payload,
    meta,
  })
}

export function createAsyncAction(type: string) {
  return {
    request: createAction(`${type}_REQUEST`),
    success: createAction(`${type}_SUCCESS`),
    failure: createAction(`${type}_FAILURE`),
  }
}

// Reducer helpers
export function combineReducers(reducers: Record<string, Reducer>): Reducer {
  return (state = {}, action) => {
    const nextState: Record<string, any> = {}
    let hasChanged = false

    for (const [key, reducer] of Object.entries(reducers)) {
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)

      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }

    return hasChanged ? nextState : state
  }
}

export function createReducer<T>(
  initialState: T,
  handlers: Record<string, (state: T, action: Action) => T>,
): Reducer<T> {
  return (state = initialState, action) => {
    const handler = handlers[action.type]
    return handler ? handler(state, action) : state
  }
}

// Selectors
export function createSelector<T, R>(
  selector: (state: Record<string, any>) => T,
  transform: (selected: T) => R,
): (state: Record<string, any>) => R {
  let lastSelected: T
  let lastResult: R

  return (state) => {
    const selected = selector(state)

    if (selected !== lastSelected) {
      lastSelected = selected
      lastResult = transform(selected)
    }

    return lastResult
  }
}

// React hooks for store
export function useStore(): Store {
  // This would be implemented with React context
  throw new Error("useStore must be used within a StoreProvider")
}

export function useSelector<T>(selector: (state: Record<string, any>) => T): T {
  // This would be implemented with React hooks
  throw new Error("useSelector must be used within a StoreProvider")
}

export function useDispatch(): (action: Action) => any {
  // This would be implemented with React hooks
  throw new Error("useDispatch must be used within a StoreProvider")
}

// Store provider component (would be implemented in React)
// import React, { createContext, useContext, useEffect, useState } from 'react'
// import { Store } from './store'

// const StoreContext = createContext<Store | null>(null)

// export function StoreProvider({ store, children }: { store: Store; children: React.ReactNode }) {
//   return (
//     <StoreContext.Provider value={store}>
//       {children}
//     </StoreContext.Provider>
//   )
// }

// export function useStore(): Store {
//   const store = useContext(StoreContext)
//   if (!store) {
//     throw new Error('useStore must be used within a StoreProvider')
//   }
//   return store
// }

// export function useSelector<T>(selector: (state: Record<string, any>) => T): T {
//   const store = useStore()
//   const [selectedState, setSelectedState] = useState(() => selector(store.getState()))

//   useEffect(() => {
//     const unsubscribe = store.subscribe((state) => {
//       const newSelectedState = selector(state)
//       setSelectedState(newSelectedState)
//     })

//     return unsubscribe
//   }, [store, selector])

//   return selectedState
// }

// export function useDispatch(): (action: any) => any {
//   const store = useStore()
//   return store.dispatch.bind(store)
// }

// Create default store
export function createStore(options: StoreOptions = {}): Store {
  return new Store({
    middleware: [loggerMiddleware, thunkMiddleware, crashReporterMiddleware],
    devTools: process.env.NODE_ENV === "development",
    ...options,
  })
}

// Default store instance
export const store = createStore()

// Built-in reducers
export const authReducer = createReducer(
  { user: null, token: null, isAuthenticated: false, loading: false },
  {
    AUTH_LOGIN_REQUEST: (state) => ({ ...state, loading: true }),
    AUTH_LOGIN_SUCCESS: (state, action) => ({
      ...state,
      user: action.payload.user,
      token: action.payload.token,
      isAuthenticated: true,
      loading: false,
    }),
    AUTH_LOGIN_FAILURE: (state) => ({ ...state, loading: false }),
    AUTH_LOGOUT: () => ({ user: null, token: null, isAuthenticated: false, loading: false }),
  },
)

export const uiReducer = createReducer(
  { theme: "light", sidebarOpen: false, loading: false, notifications: [] },
  {
    UI_SET_THEME: (state, action) => ({ ...state, theme: action.payload }),
    UI_TOGGLE_SIDEBAR: (state) => ({ ...state, sidebarOpen: !state.sidebarOpen }),
    UI_SET_LOADING: (state, action) => ({ ...state, loading: action.payload }),
    UI_ADD_NOTIFICATION: (state, action) => ({
      ...state,
      notifications: [...state.notifications, action.payload],
    }),
    UI_REMOVE_NOTIFICATION: (state, action) => ({
      ...state,
      notifications: state.notifications.filter((n: any) => n.id !== action.payload),
    }),
  },
)

// Action creators
export const authActions = {
  login: createAsyncAction("AUTH_LOGIN"),
  logout: createAction("AUTH_LOGOUT"),
}

export const uiActions = {
  setTheme: createAction<string>("UI_SET_THEME"),
  toggleSidebar: createAction("UI_TOGGLE_SIDEBAR"),
  setLoading: createAction<boolean>("UI_SET_LOADING"),
  addNotification: createAction("UI_ADD_NOTIFICATION"),
  removeNotification: createAction<string>("UI_REMOVE_NOTIFICATION"),
}
