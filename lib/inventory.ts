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
export type CandidateDetail = CandidateRow & {
  address: string | null
  operatorName: string | null
  summary: string | null
  unknowns: string[]
  claims: { key: string; value: unknown; evidenceStatus: string; excerpt: string | null }[]
  sources: { title: string | null; publisher: string; url: string; sourceRole: string; accessedAt: string }[]
}

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

export async function getCandidateDetail(slug: string): Promise<{ row?: CandidateDetail; error?: string }> {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) return { error: 'DATABASE_URL is not configured.' }
  const client = new Client({ connectionString: databaseUrl })
  try {
    await client.connect()
    const entityResult = await client.query<CandidateDetail>(`SELECT
      e.entity_id AS "entityId", e.slug, e.name, e.lifecycle_status AS "lifecycleStatus",
      e.confidence, e.city, e.county, e.location_precision AS "locationPrecision",
      e.address, e.operator_name AS "operatorName", e.summary, e.unknowns,
      e.last_reviewed_at AS "lastReviewedAt",
      COUNT(DISTINCT c.source_id)::int AS "sourceCount",
      COUNT(DISTINCT rr.report_id)::int AS "reportCount"
    FROM inventory.entities e
    LEFT JOIN inventory.claims c ON c.entity_id = e.entity_id
    LEFT JOIN inventory.research_reports rr ON rr.linked_entity_id = e.entity_id
    WHERE e.slug = $1 AND e.publication_status = 'candidate'
    GROUP BY e.entity_id`, [slug])
    const entity = entityResult.rows[0]
    if (!entity) return { error: 'Candidate not found.' }

    const claimsResult = await client.query(`SELECT claim_key AS key, value, evidence_status AS "evidenceStatus", excerpt FROM inventory.claims WHERE entity_id = $1 ORDER BY claim_key`, [entity.entityId])
    const sourcesResult = await client.query(`SELECT DISTINCT s.title, s.publisher, s.url, s.source_role AS "sourceRole", s.accessed_at AS "accessedAt" FROM inventory.sources s JOIN inventory.claims c ON c.source_id = s.source_id WHERE c.entity_id = $1 ORDER BY s.publisher, s.title`, [entity.entityId])
    return { row: { ...entity, claims: claimsResult.rows, sources: sourcesResult.rows } }
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    return { error: message.includes('does not exist') ? 'Inventory schema has not been migrated yet.' : 'Candidate detail unavailable.' }
  } finally {
    await client.end().catch(() => undefined)
  }
}
