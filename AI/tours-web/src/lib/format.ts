export function fmtMoney(n: number, currency: string = 'GTQ', locale: string = 'es-GT') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Number(n || 0));
}

export function fmtDate(input: string | Date, locale: string = 'es-GT') {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' })
    .format(new Date(input));
}

export function greetNow() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}
