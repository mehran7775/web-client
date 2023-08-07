export const printableKeys = "`1234567890-=qwertyuiop[]asdfghjkl;'\\zxcvbnm,./".split("")
export const printableShiftKeys = "~!@#$%^&*()_+QWERTYUIOP{}ASDFGHJKL:\"|ZXCVBNM<>?".split("")

let keyboard: virtualKeyboard | null = null

export function useVirtualKeyBoard(): virtualKeyboard {
  if (keyboard == null) {
    let listener: keyHandler | null = null
    function setListener(fn: keyHandler) {
      listener = fn
    }
    function removeListener(fn: keyHandler) {
      listener = null
    }
    function call(key: string) {
      if (listener)
        listener(key)
    }
    keyboard = {
      active: false,
      setListener,
      removeListener,
      call
    }
  }
  return keyboard
}

export type virtualKeyboard = {
  active: boolean,
  setListener: fnHandler,
  removeListener: fnHandler,
  call: keyHandler
}

export type fnHandler = (fn: keyHandler) => void
export type keyHandler = (key: string) => void
