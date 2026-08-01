import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Client } from 'pg'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const migrationsPath = path.join(root, 'db', 'migrations')
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) throw new Error('DATABASE_URL is required to run database migrations.')

async function main() {
  const client = new Client({ connectionString: databaseUrl })
  await client.connect()
  try {
    await client.query('CREATE SCHEMA IF NOT EXISTS inventory')
    await client.query(`CREATE TABLE IF NOT EXISTS inventory.schema_migrations (
    filename text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`)

    const files = (await readdir(migrationsPath)).filter((file) => file.endsWith('.sql')).sort()
    for (const filename of files) {
      const existing = await client.query('SELECT 1 FROM inventory.schema_migrations WHERE filename = $1', [filename])
      if (existing.rowCount) continue
      const sql = await import('node:fs/promises').then(({ readFile }) => readFile(path.join(migrationsPath, filename), 'utf8'))
      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query('INSERT INTO inventory.schema_migrations (filename) VALUES ($1)', [filename])
        await client.query('COMMIT')
        console.log(`Applied ${filename}`)
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      }
    }
  } finally {
    await client.end()
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
