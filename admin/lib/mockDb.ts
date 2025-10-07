import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'admin', 'data', 'mockDb.json')

type IPTVChannel = {
  id: number
  name: string
  url?: string
  logo?: string | null
  description?: string | null
  category?: string | null
  cost?: number
  createdAt: string
  updatedAt: string
}

type Subscription = {
  id: number
  userId: number
  channelId: number
  credit: number
  code: string
  duration: string
  startDate: string
  endDate: string
  status: string
  updatedAt: string
}

type User = { id: number; email: string; username: string; name: string }

type MockDB = { channels: IPTVChannel[]; subscriptions: Subscription[]; users: User[] }

function ensureDir() {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

export function readDb(): MockDB {
  ensureDir()
  if (!fs.existsSync(DB_PATH)) {
    const initial: MockDB = { channels: [], subscriptions: [], users: [] }
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2))
    return initial
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(raw) as MockDB
  } catch (e) {
    const initial: MockDB = { channels: [], subscriptions: [], users: [] }
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2))
    return initial
  }
}

export function writeDb(db: MockDB) {
  ensureDir()
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

export function resetDb() {
  const initial: MockDB = { channels: [], subscriptions: [], users: [] }
  writeDb(initial)
  return initial
}

export type { IPTVChannel, Subscription, User, MockDB }
