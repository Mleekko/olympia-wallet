import { IpcMainEvent } from 'electron/main'
import { clipboard } from 'electron'
import fs from 'fs'
import { readFile } from 'fs/promises'

export const writeKeystoreFile = (event: IpcMainEvent, encodedWallet: string) => {
  fs.writeFile('./keystore.json', encodedWallet, (err) => {
    if (err as Error) throw err
    console.log('The file has been saved!')
  })
}

export const getKeystoreFile = () =>
  readFile('./keystore.json', 'utf-8')

export const copyToClipboard = (event: IpcMainEvent, text: string) => {
  clipboard.writeText(text, 'selection')
}
