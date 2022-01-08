export function useShortcut(): ShortcutManager {
  //TODO Support Complex key map
  const mem: Array<string> = [];
  const _shortcut: any = {}
  const EventParser = (ev: KeyboardEvent): string => {
    let res = ev.code
    if (ev.shiftKey) {
      res = "shift+" + res
    }
    if (ev.metaKey) {
      res = "meta+" + res
    }
    if (ev.ctrlKey) {
      res = "ctrl+" + res
    }
    if (ev.altKey) {
      res = "alt+" + res
    }
    return res
  }
  const res: ShortcutManager = {
    handel: (ev: KeyboardEvent) => {
      const action = _shortcut[EventParser(ev)]
      if (action) {
        //ev.preventDefault()
        action(ev)
      }
    },
    addShortcut: (shortcut: Shortcut) => {
      const tmp = shortcut.key.split('+')
      const key = tmp.pop()
      tmp.sort()
      _shortcut[tmp.join('+') + '+' + (key?.length == 1 ? 'Key' + key?.toUpperCase() : key?.toUpperCase())] = shortcut.action
    },
    removeShortcut: (shortcut: string) => {
      _shortcut[shortcut] = null
    }
  }
  if (process.client) {
    document.removeEventListener("keydown", res.handel)
    document.addEventListener("keydown", res.handel)
  }
  return res
}

export interface ShortcutManager {
  handel: Handler
  addShortcut: AddShortcut
  removeShortcut: RemoveShortcut
}

export type Handler = (event: KeyboardEvent) => void
export type AddShortcut = (shortcut: Shortcut) => void
export type RemoveShortcut = (shortcut: string) => void

export type Shortcut = {
  key: string,
  action: Handler
}
