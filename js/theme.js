// Theme Management System
class ThemeManager {
  constructor() {
    this.themes = ['system', 'light', 'dark']
    this.currentTheme = localStorage.getItem('theme') || 'system'
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    this.init()
  }
  
  init() {
    this.applyTheme(this.currentTheme)
    this.updateToggleUI()
    this.setupEventListeners()
    
    // Listen for system theme changes
    this.mediaQuery.addEventListener('change', () => {
      if (this.currentTheme === 'system') {
        this.applyTheme('system')
      }
    })
  }
  
  setupEventListeners() {
    document.querySelectorAll('.theme-toggle-option').forEach(button => {
      button.addEventListener('click', () => {
        const theme = button.dataset.theme
        this.setTheme(theme)
      })
    })
  }
  
  setTheme(theme) {
    this.currentTheme = theme
    localStorage.setItem('theme', theme)
    this.applyTheme(theme)
    this.updateToggleUI()
  }
  
  applyTheme(theme) {
    const html = document.documentElement
    
    if (theme === 'system') {
      html.removeAttribute('data-theme')
    } else {
      html.setAttribute('data-theme', theme)
    }
  }
  
  updateToggleUI() {
    document.querySelectorAll('.theme-toggle-option').forEach(button => {
      button.classList.toggle('active', button.dataset.theme === this.currentTheme)
    })
  }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ThemeManager())
} else {
  new ThemeManager()
}