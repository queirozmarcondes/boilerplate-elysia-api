import { Database } from 'bun:sqlite'

export const db = new Database('./src/db/mydb.sqlite')
db.exec('PRAGMA journal_mode = WAL;')

export function closeDb() {
  db.close()
}
