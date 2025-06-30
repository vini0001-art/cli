import { EventEmitter } from "events"

// Internationalization types
export interface I18nOptions {
  locale: string
  fallbackLocale?: string
  messages: Record<string, Record<string, string>>
  dateFormat?: string
  numberFormat?: Intl.NumberFormatOptions
}

export interface I18nMessage {
  key: string
  params?: Record<string, any>
}

// Main I18n class
export class I18n extends EventEmitter {
  private locale: string
  private fallbackLocale: string
  private messages: Record<string, Record<string, string>>
  private dateFormat: string
  private numberFormat: Intl.NumberFormatOptions

  constructor(options: I18nOptions) {
    super()
    this.locale = options.locale
    this.fallbackLocale = options.fallbackLocale || "en"
    this.messages = options.messages
    this.dateFormat = options.dateFormat || "YYYY-MM-DD"
    this.numberFormat = options.numberFormat || {}
  }

  // Get current locale
  getLocale(): string {
    return this.locale
  }

  // Set locale
  setLocale(locale: string): void {
    if (this.locale !== locale) {
      this.locale = locale
      this.emit("localeChanged", locale)
    }
  }

  // Add messages for a locale
  addMessages(locale: string, messages: Record<string, string>): void {
    if (!this.messages[locale]) {
      this.messages[locale] = {}
    }

    Object.assign(this.messages[locale], messages)
  }

  // Translate a key
  t(key: string, params?: Record<string, any>): string {
    let message = this.getMessage(key, this.locale)

    // Fallback to fallback locale
    if (!message && this.locale !== this.fallbackLocale) {
      message = this.getMessage(key, this.fallbackLocale)
    }

    // Fallback to key itself
    if (!message) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }

    // Replace parameters
    if (params) {
      message = this.interpolate(message, params)
    }

    return message
  }

  // Translate with pluralization
  tn(key: string, count: number, params?: Record<string, any>): string {
    const pluralKey = this.getPluralKey(key, count)
    return this.t(pluralKey, { ...params, count })
  }

  // Format date
  formatDate(date: Date | string | number, format?: string): string {
    const d = new Date(date)
    const fmt = format || this.dateFormat

    try {
      return new Intl.DateTimeFormat(this.locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d)
    } catch (error) {
      return d.toLocaleDateString()
    }
  }

  // Format number
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    try {
      return new Intl.NumberFormat(this.locale, { ...this.numberFormat, ...options }).format(number)
    } catch (error) {
      return number.toString()
    }
  }

  // Format currency
  formatCurrency(amount: number, currency = "USD"): string {
    return this.formatNumber(amount, {
      style: "currency",
      currency,
    })
  }

  // Format relative time
  formatRelativeTime(date: Date | string | number): string {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 1) {
      return this.t("time.now")
    } else if (diffMinutes < 60) {
      return this.tn("time.minutes_ago", diffMinutes)
    } else if (diffHours < 24) {
      return this.tn("time.hours_ago", diffHours)
    } else if (diffDays < 7) {
      return this.tn("time.days_ago", diffDays)
    } else {
      return this.formatDate(d)
    }
  }

  // Get available locales
  getAvailableLocales(): string[] {
    return Object.keys(this.messages)
  }

  // Check if locale is available
  hasLocale(locale: string): boolean {
    return locale in this.messages
  }

  // Private methods
  private getMessage(key: string, locale: string): string | undefined {
    const messages = this.messages[locale]
    if (!messages) return undefined

    // Support nested keys like 'user.profile.name'
    const keys = key.split(".")
    let value: any = messages

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        return undefined
      }
    }

    return typeof value === "string" ? value : undefined
  }

  private interpolate(message: string, params: Record<string, any>): string {
    return message.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match
    })
  }

  private getPluralKey(key: string, count: number): string {
    // Simple pluralization rules (extend for other languages)
    if (count === 0) {
      return `${key}.zero`
    } else if (count === 1) {
      return `${key}.one`
    } else {
      return `${key}.other`
    }
  }
}

// Default messages
const defaultMessages = {
  en: {
    common: {
      loading: "Loading...",
      error: "An error occurred",
      success: "Success!",
      cancel: "Cancel",
      confirm: "Confirm",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      update: "Update",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      next: "Next",
      previous: "Previous",
      close: "Close",
      open: "Open",
    },
    time: {
      now: "just now",
      minutes_ago: {
        one: "{count} minute ago",
        other: "{count} minutes ago",
      },
      hours_ago: {
        one: "{count} hour ago",
        other: "{count} hours ago",
      },
      days_ago: {
        one: "{count} day ago",
        other: "{count} days ago",
      },
    },
    validation: {
      required: "This field is required",
      email: "Please enter a valid email",
      min_length: "Minimum length is {min} characters",
      max_length: "Maximum length is {max} characters",
    },
  },
  "pt-BR": {
    common: {
      loading: "Carregando...",
      error: "Ocorreu um erro",
      success: "Sucesso!",
      cancel: "Cancelar",
      confirm: "Confirmar",
      save: "Salvar",
      delete: "Excluir",
      edit: "Editar",
      create: "Criar",
      update: "Atualizar",
      search: "Buscar",
      filter: "Filtrar",
      sort: "Ordenar",
      next: "Próximo",
      previous: "Anterior",
      close: "Fechar",
      open: "Abrir",
    },
    time: {
      now: "agora mesmo",
      minutes_ago: {
        one: "{count} minuto atrás",
        other: "{count} minutos atrás",
      },
      hours_ago: {
        one: "{count} hora atrás",
        other: "{count} horas atrás",
      },
      days_ago: {
        one: "{count} dia atrás",
        other: "{count} dias atrás",
      },
    },
    validation: {
      required: "Este campo é obrigatório",
      email: "Por favor, insira um email válido",
      min_length: "O comprimento mínimo é {min} caracteres",
      max_length: "O comprimento máximo é {max} caracteres",
    },
  },
  es: {
    common: {
      loading: "Cargando...",
      error: "Ocurrió un error",
      success: "¡Éxito!",
      cancel: "Cancelar",
      confirm: "Confirmar",
      save: "Guardar",
      delete: "Eliminar",
      edit: "Editar",
      create: "Crear",
      update: "Actualizar",
      search: "Buscar",
      filter: "Filtrar",
      sort: "Ordenar",
      next: "Siguiente",
      previous: "Anterior",
      close: "Cerrar",
      open: "Abrir",
    },
    time: {
      now: "ahora mismo",
      minutes_ago: {
        one: "hace {count} minuto",
        other: "hace {count} minutos",
      },
      hours_ago: {
        one: "hace {count} hora",
        other: "hace {count} horas",
      },
      days_ago: {
        one: "hace {count} día",
        other: "hace {count} días",
      },
    },
    validation: {
      required: "Este campo es obligatorio",
      email: "Por favor, ingrese un email válido",
      min_length: "La longitud mínima es {min} caracteres",
      max_length: "La longitud máxima es {max} caracteres",
    },
  },
}

// Create default i18n instance
export function createI18n(options: Partial<I18nOptions> = {}): I18n {
  return new I18n({
    locale: "pt-BR",
    fallbackLocale: "en",
    messages: defaultMessages,
    ...options,
  })
}

// Global i18n instance
export const i18n = createI18n()

// Convenience functions
export function t(key: string, params?: Record<string, any>): string {
  return i18n.t(key, params)
}

export function tn(key: string, count: number, params?: Record<string, any>): string {
  return i18n.tn(key, count, params)
}

export function setLocale(locale: string): void {
  i18n.setLocale(locale)
}

export function getLocale(): string {
  return i18n.getLocale()
}
