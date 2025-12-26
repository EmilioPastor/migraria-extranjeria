export function generate2FACode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function expiresIn(minutes = 5) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}
