import { Client } from 'pg'
import { facilities, type Facility, type FacilitySource } from '../lib/facilities'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is required to import facilities.')

const client = new Client({ connectionString: databaseUrl })

function lifecycleStatus(status: Facility['status']) {
  return status === 'operational' ? 'built' : status
}

function publicationStatus(status: Facility['publicationStatus']) {
  return status === 'demo' ? 'published' : status
}

function facilityClass(facility: Facility) {
  if (facility.class === 'additional') return 'network'
  if (facility.class === 'hyperscale') return 'hyperscale'
  if (facility.class === 'colocation') return 'colocation'
  return 'other'
}

function sourceRole(source: FacilitySource) {
  const publisher = source.publisher.toLowerCase()
  if (publisher.includes('baxtel') || publisher.includes('data center map')) return 'directory'
  if (publisher.includes('government') || publisher.includes('county') || publisher.includes('city')) return 'government'
  if (publisher.includes('news') || publisher.includes('journal') || publisher.includes('press')) return 'news'
  return 'other'
}

function accessedAt(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date() : date
}

function confidence(value: string) {
  const normalized = value.toLowerCase()
  if (normalized === 'high' || normalized === 'medium') return normalized
  if (normalized.includes('doubt')) return 'in_doubt'
  return 'candidate'
}

async function sourceId(source: FacilitySource) {
  const result = await client.query<{ source_id: string }>(`INSERT INTO inventory.sources
    (publisher, title, url, source_role, accessed_at, snapshot_url, content_hash, archived, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (publisher, url) DO UPDATE SET
      title = EXCLUDED.title,
      source_role = EXCLUDED.source_role,
      accessed_at = EXCLUDED.accessed_at,
      snapshot_url = EXCLUDED.snapshot_url,
      content_hash = EXCLUDED.content_hash,
      archived = EXCLUDED.archived,
      notes = EXCLUDED.notes
    RETURNING source_id`, [source.publisher, source.title, source.url, sourceRole(source), accessedAt(source.accessed), source.snapshot ?? null, source.contentHash ?? null, source.archived ?? false, source.supports])
  return result.rows[0].source_id
}

async function claim(entityId: string, key: string, value: unknown, source: string | null, evidenceStatus: 'reported' | 'unknown' = 'reported') {
  await client.query(`INSERT INTO inventory.claims (entity_id, claim_key, value, evidence_status, source_id)
    VALUES ($1, $2, $3::jsonb, $4, $5)`, [entityId, key, JSON.stringify(value), evidenceStatus, source])
}

async function main() {
  await client.connect()
  await client.query('BEGIN')
  try {
  for (const facility of facilities) {
    const publication = publicationStatus(facility.publicationStatus)
    const verification = publication === 'candidate' ? 'candidate' : 'verified'
    const publicLocation = facility.locationPrecision === 'exact' || facility.locationPrecision === 'approximate'
    const sourceIds = []
    for (const source of facility.sources) sourceIds.push(await sourceId(source))
    const firstSource = sourceIds[0] ?? null
    const entity = await client.query<{ entity_id: string }>(`INSERT INTO inventory.entities
      (slug, name, entity_type, facility_class, operator_name, address, city, county, location_precision,
       location, lifecycle_status, verification_status, publication_status, confidence, summary, unknowns,
       first_reviewed_at, last_reviewed_at, reviewed_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,
        CASE WHEN $10 THEN ST_SetSRID(ST_MakePoint($11, $12), 4326)::geography ELSE NULL END,
        $13, $14, $15, $16, $17, $18::jsonb, $19, $19, 'initial-facilities-import')
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        entity_type = EXCLUDED.entity_type,
        facility_class = EXCLUDED.facility_class,
        operator_name = EXCLUDED.operator_name,
        address = EXCLUDED.address,
        city = EXCLUDED.city,
        county = EXCLUDED.county,
        location_precision = EXCLUDED.location_precision,
        location = EXCLUDED.location,
        lifecycle_status = EXCLUDED.lifecycle_status,
        verification_status = EXCLUDED.verification_status,
        publication_status = EXCLUDED.publication_status,
        confidence = EXCLUDED.confidence,
        summary = EXCLUDED.summary,
        unknowns = EXCLUDED.unknowns,
        last_reviewed_at = EXCLUDED.last_reviewed_at,
        reviewed_by = EXCLUDED.reviewed_by
      RETURNING entity_id`, [
      facility.slug, facility.name, facility.class === 'additional' ? 'network_facility' : facility.status === 'announced' ? 'project' : 'development',
      facilityClass(facility), facility.operator || null, facility.address ?? null, facility.city, facility.county,
      facility.locationPrecision, publicLocation, facility.longitude, facility.latitude, lifecycleStatus(facility.status),
      verification, publication, confidence(facility.confidence), facility.summary, JSON.stringify(facility.unknowns ?? []),
      facility.verified === 'Not published' ? null : accessedAt(facility.verified),
    ])
    const entityId = entity.rows[0].entity_id

    await client.query('DELETE FROM inventory.entity_aliases WHERE entity_id = $1', [entityId])
    for (const alias of facility.aliases ?? []) await client.query('INSERT INTO inventory.entity_aliases (entity_id, alias, source_id) VALUES ($1, $2, $3)', [entityId, alias, firstSource])
    await claim(entityId, 'identity', { name: facility.name, operator: facility.operator }, firstSource)
    await claim(entityId, 'lifecycle_status', lifecycleStatus(facility.status), firstSource)
    if (facility.address) await claim(entityId, 'address', facility.address, firstSource)
    if (facility.operator) await claim(entityId, 'operator', facility.operator, firstSource)
    for (const metric of facility.metrics ?? []) await claim(entityId, `metric:${metric.label}`, { value: metric.value, note: metric.note ?? null }, firstSource)
    for (const unknown of facility.unknowns ?? []) await claim(entityId, 'unknown', unknown, null, 'unknown')

    await client.query('DELETE FROM inventory.lifecycle_events WHERE entity_id = $1', [entityId])
    await client.query(`INSERT INTO inventory.lifecycle_events (entity_id, lifecycle_status, title, description, source_id, is_current)
      VALUES ($1, $2, $3, $4, $5, true)`, [entityId, lifecycleStatus(facility.status), facility.statusLabel, facility.summary, firstSource])
    await client.query('UPDATE inventory.lifecycle_events SET is_current = false WHERE entity_id = $1 AND lifecycle_event_id <> (SELECT lifecycle_event_id FROM inventory.lifecycle_events WHERE entity_id = $1 AND is_current LIMIT 1)', [entityId])

    await client.query('UPDATE inventory.publication_decisions SET superseded_at = now() WHERE entity_id = $1 AND superseded_at IS NULL', [entityId])
    await client.query(`INSERT INTO inventory.publication_decisions (entity_id, publication_status, reason, decided_by)
      VALUES ($1, $2, $3, 'initial-facilities-import')`, [entityId, publication, facility.publicationStatus === 'demo' ? 'Imported existing demo record as published; review policy may revise this decision.' : 'Imported from current application inventory.'])

    if (publication === 'candidate') {
      await client.query(`INSERT INTO inventory.research_reports
        (source_id, origin_type, reported_name, reported_operator, reported_lifecycle, reported_location_text, report_text, disposition, linked_entity_id, reviewer_notes)
        VALUES ($1, 'source_import', $2, $3, $4, $5, $6, 'linked', $7, $8)`, [firstSource, facility.name, facility.operator, lifecycleStatus(facility.status), [facility.address, facility.city, facility.county].filter(Boolean).join(', '), facility.summary, entityId, 'Imported candidate; unresolved coordinates were intentionally not used as a map location.'])
    }
  }
    await client.query('COMMIT')
    console.log(`Imported ${facilities.length} facilities.`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
