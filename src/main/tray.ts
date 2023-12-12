import { app, Tray, Menu, MenuItem, BrowserWindow } from 'electron'
import { assert, isUndefined } from '@blackglory/prelude'
import * as path from 'path'
import { closeDatabase } from './database.js'

let tray: Tray | undefined // prevent GC

export function setupTray(appWindow: BrowserWindow): void {
  assert(isUndefined(tray), 'Tray is already setup')

  tray = new Tray(path.join(app.getAppPath(), 'public/icon.png'))
  tray.setToolTip('Unotifier')
  tray.addListener('click', showAppWindow)
  tray.setContextMenu(createContextMenu())

  function createContextMenu(): Menu {
    const show = new MenuItem({
      type: 'normal'
    , label: 'Show'
    , click: showAppWindow
    })
    const launchAtStartup = new MenuItem({
      type: 'checkbox'
    , label: 'Launch at startup'
    , click(menuItem) {
        app.setLoginItemSettings({
          openAtLogin: menuItem.checked
        , openAsHidden: true
        , args: ['--hidden']
        })
      }
    , checked: app.getLoginItemSettings().openAtLogin
    })
    const quit = new MenuItem({
      type: 'normal'
    , label: 'Quit'
    , click(): void {
        closeDatabase()
        app.exit()
      }
    })
    const separator = new MenuItem({
      type: 'separator'
    })

    const contextMenu = new Menu()
    contextMenu.append(show)
    contextMenu.append(separator)
    contextMenu.append(launchAtStartup)
    contextMenu.append(separator)
    contextMenu.append(quit)

    return contextMenu
  }

  function showAppWindow(): void {
    appWindow.show()
  }
}
