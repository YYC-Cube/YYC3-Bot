/**
 * file: chat-storage.ts
 * description: YYC³ AI 对话历史持久化 · IndexedDB 封装
 * author: YanYuCloudCube Team <admin@0379.email>
 * version: v1.0.0
 */

import type { ChatMessage } from "@yyc3/ai"

const DB_NAME = "yyc3-chat"
const DB_VERSION = 1
const STORE_NAME = "conversations"

interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  provider: string
  createdAt: number
  updatedAt: number
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" })
        store.createIndex("updatedAt", "updatedAt", { unique: false })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveConversation(
  id: string,
  messages: ChatMessage[],
  provider: string = "zhipu"
): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readwrite")
  const store = tx.objectStore(STORE_NAME)

  const existing = await new Promise<Conversation | undefined>((resolve) => {
    const req = store.get(id)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => resolve(undefined)
  })

  const conversation: Conversation = {
    id,
    title: messages.find((m) => m.role === "user")?.content.slice(0, 50) || "新对话",
    messages,
    provider,
    createdAt: existing?.createdAt || Date.now(),
    updatedAt: Date.now(),
  }

  store.put(conversation)
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function loadConversation(id: string): Promise<Conversation | null> {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readonly")
  const store = tx.objectStore(STORE_NAME)
  const req = store.get(id)

  return new Promise((resolve) => {
    req.onsuccess = () => resolve(req.result || null)
    req.onerror = () => resolve(null)
  })
}

export async function listConversations(): Promise<Conversation[]> {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readonly")
  const store = tx.objectStore(STORE_NAME)
  const index = store.index("updatedAt")
  const req = index.openCursor(null, "prev")

  const results: Conversation[] = []
  return new Promise((resolve) => {
    req.onsuccess = () => {
      const cursor = req.result
      if (cursor) {
        results.push(cursor.value)
        cursor.continue()
      } else {
        resolve(results)
      }
    }
    req.onerror = () => resolve([])
  })
}

export async function deleteConversation(id: string): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readwrite")
  tx.objectStore(STORE_NAME).delete(id)
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export type { Conversation }
