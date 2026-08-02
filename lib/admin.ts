import { statfs } from 'node:fs/promises'
import { Client } from 'pg'

export type AdminSnapshot = {
  generatedAt: string
  health: { status: 'ok' | 'degraded'; map: 'configured' | 'missing' }
  runtime: { node: string; platform: string; uptimeSeconds: number; memoryUsedBytes: number }
  storage: { path: string; totalBytes?: number; freeBytes?: number; error?: string }
  configuration: { database: 'healthy' | 'unavailable' | 'not configured'; searchRetention: 'enabled' | 'disabled'; candidates: 'enabled' | 'disabled' }
  links: { uptime?: string; costs?: string; metrics?: string }
}

function optionalUrl(value: string | undefined) {
  return value?.trim() || undefined
}

export async function getAdminSnapshot(): Promise<AdminSnapshot> {
  const storagePath = process.env.STORAGE_PATH?.trim() || '/app'
  let storage: AdminSnapshot['storage'] = { path: storagePath }

  try {
    const stats = await statfs(storagePath)
    storage = {
      path: storagePath,
      totalBytes: Number(stats.blocks) * Number(stats.bsize),
      freeBytes: Number(stats.bavail) * Number(stats.bsize),
    }
  } catch {
    storage = { path: storagePath, error: 'Filesystem metrics unavailable' }
  }

  const mapConfigured = Boolean(process.env.NEXT_PUBLIC_MAP_STYLE_URL?.trim())
    || process.env.NEXT_PUBLIC_USE_OSM_FALLBACK === 'true'
  let database: AdminSnapshot['configuration']['database'] = 'not configured'
  if (process.env.DATABASE_URL) {
    const client = new Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 3000 })
    try {
      await client.connect()
      await client.query('SELECT 1')
      database = 'healthy'
    } catch {
      database = 'unavailable'
    } finally {
      await client.end().catch(() => undefined)
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    health: { status: mapConfigured ? 'ok' : 'degraded', map: mapConfigured ? 'configured' : 'missing' },
    runtime: {
      node: process.version,
      platform: `${process.platform} ${process.arch}`,
      uptimeSeconds: Math.round(process.uptime()),
      memoryUsedBytes: process.memoryUsage().rss,
    },
    storage,
    configuration: {
      database,
      searchRetention: process.env.STORE_SEARCHES === 'true' ? 'enabled' : 'disabled',
      candidates: process.env.NEXT_PUBLIC_SHOW_CANDIDATES === 'true' ? 'enabled' : 'disabled',
    },
    links: {
      uptime: optionalUrl(process.env.ADMIN_UPTIME_URL),
      costs: optionalUrl(process.env.ADMIN_COSTS_URL),
      metrics: optionalUrl(process.env.ADMIN_METRICS_URL),
    },
  }
}
