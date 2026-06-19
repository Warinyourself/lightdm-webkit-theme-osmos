export function setCSSVariable(property: string, value: string) {
  document.documentElement.style.setProperty(property, value)
}
