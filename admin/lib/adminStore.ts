export type CatalogItem = {
  id: number
  title: string
  rating: number
  category: 'Movie' | 'TV Series' | 'Anime' | 'Cartoon' | 'Live TV' | 'Streaming'
  views: number
  status: 'Visible' | 'Hidden'
  createdAt: string
  mediaUrl?: string
  quality?: 'SD' | 'HD' | 'FullHD' | '4K'
  age?: string
  description?: string
  genres?: string[]
  runtime?: string
  premiereDate?: string
  coverUrl?: string
  backgroundUrl?: string
  country?: string
  director?: string
  actors?: string[]
}

export type AdminUser = {
  id: number
  name: string
  email: string
  username: string
  plan: 'Free' | 'Basic' | 'Premium' | 'Cinematic'
  comments: number
  reviews: number
  credits: number
  status: 'Approved' | 'Banned'
  createdAt: string
}

export type AdminComment = {
  id: number
  itemId: number
  itemTitle: string
  author: string
  content: string
  status: 'Pending' | 'Approved' | 'Hidden'
  createdAt: string
}

export type AdminReview = {
  id: number
  itemId: number
  itemTitle: string
  author: string
  rating: number
  content?: string
  status: 'Pending' | 'Approved' | 'Hidden'
  createdAt: string
}

export type AdminSettings = {
  brandName: string
  accentColor: string
  allowRegistrations: boolean
  maintenanceMode: boolean
}

let usersSeed: AdminUser[] = [
  { id: 11, name: 'Tess Harper', email: 'tess@example.com', username: 'tessharper', plan: 'Premium', comments: 13, reviews: 1, credits: 120, status: 'Approved', createdAt: '2023-02-05' },
  { id: 12, name: 'Gene Graham', email: 'gene@example.com', username: 'gene', plan: 'Free', comments: 1, reviews: 15, credits: 0, status: 'Approved', createdAt: '2023-02-05' },
  { id: 13, name: 'Rosa Lee', email: 'rosa@example.com', username: 'rosalee', plan: 'Premium', comments: 6, reviews: 6, credits: 45, status: 'Approved', createdAt: '2023-02-04' },
  { id: 14, name: 'Matt Jones', email: 'matt@example.com', username: 'mattj', plan: 'Free', comments: 11, reviews: 15, credits: 5, status: 'Banned', createdAt: '2023-02-04' },
  { id: 15, name: 'Brian Cranston', email: 'brian@example.com', username: 'bcranston', plan: 'Basic', comments: 0, reviews: 0, credits: 300, status: 'Approved', createdAt: '2023-02-04' },
  { id: 16, name: 'Louis Leterrier', email: 'louis@example.com', username: 'louis', plan: 'Free', comments: 2, reviews: 1, credits: 8, status: 'Approved', createdAt: '2023-02-03' },
  { id: 17, name: 'Son Gun', email: 'songun@example.com', username: 'songun', plan: 'Cinematic', comments: 65, reviews: 0, credits: 1000, status: 'Approved', createdAt: '2023-02-02' },
  { id: 18, name: 'Jordana Brewster', email: 'jordana@example.com', username: 'jordana', plan: 'Premium', comments: 0, reviews: 0, credits: 0, status: 'Banned', createdAt: '2023-02-02' },
  { id: 19, name: 'Tyreese Gibson', email: 'tyreese@example.com', username: 'tyreese', plan: 'Premium', comments: 13, reviews: 1, credits: 12, status: 'Approved', createdAt: '2023-02-02' },
  { id: 20, name: 'Charlize Theron', email: 'charlize@example.com', username: 'charlize', plan: 'Free', comments: 1, reviews: 15, credits: 2, status: 'Banned', createdAt: '2023-02-01' },
]
usersSeed = Array.from({ length: 17 }).flatMap((_, i) =>
  usersSeed.map((row) => ({
    ...row,
    id: row.id + i * 10,
    name: i ? `${row.name} ${i + 1}` : row.name,
    username: i ? `${row.username}${i + 1}` : row.username,
  }))
)

let catalogSeed: CatalogItem[] = [
  { id: 11, title: 'I Dream in Another Language', rating: 7.9, category: 'Movie', views: 1392, status: 'Visible', createdAt: '2023-02-05' },
  { id: 12, title: 'The Forgotten Road', rating: 7.1, category: 'Movie', views: 1093, status: 'Hidden', createdAt: '2023-02-05' },
  { id: 13, title: 'Whitney', rating: 6.3, category: 'TV Series', views: 723, status: 'Visible', createdAt: '2023-02-04' },
  { id: 14, title: 'Red Sky at Night', rating: 8.4, category: 'TV Series', views: 2457, status: 'Visible', createdAt: '2023-02-04' },
  { id: 15, title: 'Into the Unknown', rating: 7.9, category: 'Movie', views: 5092, status: 'Visible', createdAt: '2023-02-03' },
  { id: 16, title: 'The Unseen Journey', rating: 7.1, category: 'TV Series', views: 2713, status: 'Hidden', createdAt: '2023-02-03' },
  { id: 17, title: 'Savage Beauty', rating: 6.3, category: 'Cartoon', views: 901, status: 'Visible', createdAt: '2023-02-03' },
  { id: 18, title: 'Live: World News', rating: 0, category: 'Live TV', views: 12034, status: 'Visible', createdAt: '2023-02-02', mediaUrl: 'https://example.com/live/news.m3u8' },
  { id: 19, title: 'Endless Horizon', rating: 8.4, category: 'Movie', views: 8430, status: 'Visible', createdAt: '2023-02-02' },
  { id: 20, title: 'Echoes of Yesterday', rating: 7.1, category: 'Anime', views: 1046, status: 'Hidden', createdAt: '2023-02-01' },
]

catalogSeed = Array.from({ length: 6 }).flatMap((_, i) =>
  catalogSeed.map((row) => ({ ...row, id: row.id + i * 20, title: i ? `${row.title} ${i + 1}` : row.title }))
)

// Seed comments and reviews using catalogSeed for item titles
let commentsSeed: AdminComment[] = [
  { id: 101, itemId: 11, itemTitle: catalogSeed[0].title, author: 'Eliza', content: 'Great movie!', status: 'Approved', createdAt: '2023-02-05' },
  { id: 102, itemId: 12, itemTitle: catalogSeed[1].title, author: 'Matt', content: 'Please fix subtitles.', status: 'Pending', createdAt: '2023-02-05' },
  { id: 103, itemId: 18, itemTitle: catalogSeed[7].title, author: 'Brian', content: 'Stream buffers sometimes.', status: 'Pending', createdAt: '2023-02-02' },
]

let reviewsSeed: AdminReview[] = [
  { id: 201, itemId: 15, itemTitle: catalogSeed[4].title, author: 'Rosa', rating: 8.0, content: 'Beautiful visuals', status: 'Approved', createdAt: '2023-02-03' },
  { id: 202, itemId: 19, itemTitle: catalogSeed[8].title, author: 'Tess', rating: 9.2, content: 'Loved it!', status: 'Approved', createdAt: '2023-02-02' },
  { id: 203, itemId: 20, itemTitle: catalogSeed[9].title, author: 'Gene', rating: 6.5, content: 'Good but slow', status: 'Pending', createdAt: '2023-02-01' },
]

let users = [...usersSeed]
let catalog = [...catalogSeed]
let comments = [...commentsSeed]
let reviews = [...reviewsSeed]
let settings: AdminSettings = { brandName: 'HOTFLIX', accentColor: '#f97316', allowRegistrations: true, maintenanceMode: false }

let version = 0
const listeners = new Set<() => void>()
const notify = () => { version++; listeners.forEach((l) => l()) }

export const AdminStore = {
  // subscriptions
  subscribe(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener) },
  getVersion() { return version },

  // users
  getUsers() { return users.slice() },
  addUser(u: Omit<AdminUser, 'id' | 'createdAt'> & Partial<Pick<AdminUser, 'createdAt'>>) {
    const id = users.length ? Math.max(...users.map((x) => x.id)) + 1 : 1
    const createdAt = u.createdAt ?? new Date().toISOString().slice(0, 10)
    users.unshift({ ...u, id, createdAt })
    notify()
    return id
  },
  updateUser(id: number, patch: Partial<AdminUser>) {
    const i = users.findIndex((x) => x.id === id)
    if (i >= 0) { users[i] = { ...users[i], ...patch, id: users[i].id }; notify() }
  },
  deleteUser(id: number) {
    users = users.filter((x) => x.id !== id); notify()
  },
  toggleUserStatus(id: number) {
    const i = users.findIndex((x) => x.id === id)
    if (i >= 0) { users[i].status = users[i].status === 'Approved' ? 'Banned' : 'Approved'; notify() }
  },
  addCredits(id: number, amount: number) {
    const i = users.findIndex((x) => x.id === id)
    if (i >= 0) { users[i].credits = Math.max(0, users[i].credits + Math.floor(amount)); notify() }
  },
  setCredits(id: number, amount: number) {
    const i = users.findIndex((x) => x.id === id)
    if (i >= 0) { users[i].credits = Math.max(0, Math.floor(amount)); notify() }
  },
  resetCredits(id: number) {
    const i = users.findIndex((x) => x.id === id)
    if (i >= 0) { users[i].credits = 0; notify() }
  },

  // catalog
  getCatalog() { return catalog.slice() },
  addItem(it: Omit<CatalogItem, 'id' | 'createdAt'> & Partial<Pick<CatalogItem, 'createdAt'>>) {
    const id = catalog.length ? Math.max(...catalog.map((x) => x.id)) + 1 : 1
    const createdAt = it.createdAt ?? new Date().toISOString().slice(0, 10)
    catalog.unshift({ ...it, id, createdAt })
    notify()
    return id
  },
  updateItem(id: number, patch: Partial<CatalogItem>) {
    const i = catalog.findIndex((x) => x.id === id)
    if (i >= 0) { catalog[i] = { ...catalog[i], ...patch, id: catalog[i].id }; notify() }
  },
  deleteItem(id: number) { catalog = catalog.filter((x) => x.id !== id); notify() },
  toggleItemStatus(id: number) {
    const i = catalog.findIndex((x) => x.id === id)
    if (i >= 0) { catalog[i].status = catalog[i].status === 'Visible' ? 'Hidden' : 'Visible'; notify() }
  },

  // comments
  getComments() { return comments.slice() },
  addComment(c: Omit<AdminComment, 'id' | 'createdAt' | 'status'> & Partial<Pick<AdminComment, 'status' | 'createdAt'>>) {
    const id = comments.length ? Math.max(...comments.map((x) => x.id)) + 1 : 1
    const createdAt = c.createdAt ?? new Date().toISOString().slice(0, 10)
    comments.unshift({ ...c, id, createdAt, status: c.status ?? 'Pending' })
    notify(); return id
  },
  updateComment(id: number, patch: Partial<AdminComment>) {
    const i = comments.findIndex((x) => x.id === id)
    if (i >= 0) { comments[i] = { ...comments[i], ...patch, id: comments[i].id }; notify() }
  },
  deleteComment(id: number) { comments = comments.filter((x) => x.id !== id); notify() },
  setCommentStatus(id: number, status: AdminComment['status']) {
    const i = comments.findIndex((x) => x.id === id)
    if (i >= 0) { comments[i].status = status; notify() }
  },

  // reviews
  getReviews() { return reviews.slice() },
  addReview(r: Omit<AdminReview, 'id' | 'createdAt' | 'status'> & Partial<Pick<AdminReview, 'status' | 'createdAt'>>) {
    const id = reviews.length ? Math.max(...reviews.map((x) => x.id)) + 1 : 1
    const createdAt = r.createdAt ?? new Date().toISOString().slice(0, 10)
    reviews.unshift({ ...r, id, createdAt, status: r.status ?? 'Pending' })
    notify(); return id
  },
  updateReview(id: number, patch: Partial<AdminReview>) {
    const i = reviews.findIndex((x) => x.id === id)
    if (i >= 0) { reviews[i] = { ...reviews[i], ...patch, id: reviews[i].id }; notify() }
  },
  deleteReview(id: number) { reviews = reviews.filter((x) => x.id !== id); notify() },
  setReviewStatus(id: number, status: AdminReview['status']) {
    const i = reviews.findIndex((x) => x.id === id)
    if (i >= 0) { reviews[i].status = status; notify() }
  },

  // settings
  getSettings() { return { ...settings } },
  updateSettings(patch: Partial<AdminSettings>) { settings = { ...settings, ...patch }; notify() },
}

export default AdminStore;
