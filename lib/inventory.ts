import { Client } from 'pg'

export type CandidateRow = {
  entityId: string
  slug: string
  name: string
  lifecycleStatus: string
  confidence: string
  city: string | null
  county: string | null
  locationPrecision: string
  sourceCount: number
  reportCount: number
  lastReviewedAt: string | null
}

export type CandidateQueue = { rows: CandidateRow[]; error?: string }

export async function getCandidateQueue(limit = 100): Promise<CandidateQueue> {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) return { rows: [], error: 'DATABASE_URL is not configured.' }
  const client = new Client({ connectionString: databaseUrl })
  try {
    await client.connect()
    const result = await client.query<CandidateRow>(`SELECT
      e.entity_id AS "entityId",
      e.slug,
      e.name,
      e.lifecycle_status AS "lifecycleStatus",
      e.confidence,
      e.city,
      e.county,
      e.location_precision AS "locationPrecision",
      COUNT(DISTINCT c.source_id)::int AS "sourceCount",
      COUNT(DISTINCT rr.report_id)::int AS "reportCount",
      e.last_reviewed_at AS "lastReviewedAt"
    FROM inventory.entities e
    LEFT JOIN inventory.claims c ON c.entity_id = e.entity_id
    LEFT JOIN inventory.research_reports rr ON rr.linked_entity_id = e.entity_id
    WHERE e.publication_status = 'candidate'
    GROUP BY e.entity_id
    ORDER BY e.last_reviewed_at NULLS FIRST, e.name
    LIMIT $1`, [limit])
    return { rows: result.rows }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Candidate queue unavailable.'
    return { rows: [], error: message.includes('does not exist') ? 'Inventory schema has not been migrated yet.' : 'Candidate queue unavailable.' }
  } finally {
    await client.end().catch(() => undefined)
  }
}
