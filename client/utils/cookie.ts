import { serialize, CookieSerializeOptions } from "cookie"

export function DefaultClientOptions(): CookieSerializeOptions {
  return {
    path: '/',
    domain: document.domain,
    secure: true,
    sameSite: 'strict'
  }
}

export function SetClientCookie(name: string, value: string, options: CookieSerializeOptions) {
  if (process.server)
    return
  document.cookie = serialize(name, value, Object.assign(DefaultClientOptions(), options))
}

export function DeleteClientCookie(name: string) {
  document.cookie = serialize(name, "", Object.assign(DefaultClientOptions, {
    expires: new Date(Date.now())
  }))
}