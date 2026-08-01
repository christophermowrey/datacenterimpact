-- Phase 0 inventory foundation.
-- Raw discovery reports remain separate from reviewed entities so candidates
-- can be retained without making them public facilities.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE SCHEMA IF NOT EXISTS inventory;

CREATE TABLE inventory.sources (
  source_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publisher text NOT NULL,
  title text,
  url text NOT NULL,
  source_role text NOT NULL CHECK (source_role IN (
    'operator', 'government', 'permit', 'utility', 'property',
    'strong_secondary', 'directory', 'news', 'search', 'wikipedia',
    'community', 'social', 'other'
  )),
  accessed_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  snapshot_url text,
  content_hash text,
  archived boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (publisher, url)
);

CREATE TABLE inventory.entities (
  entity_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN (
    'development', 'building', 'network_facility', 'project', 'other'
  )),
  facility_class text NOT NULL CHECK (facility_class IN (
    'major', 'colocation', 'enterprise', 'hyperscale', 'edge',
    'hpc', 'network', 'other'
  )),
  operator_name text,
  owner_name text,
  address text,
  city text,
  county text,
  state_code char(2) NOT NULL DEFAULT 'TX',
  location_precision text NOT NULL CHECK (location_precision IN (
    'exact', 'approximate', 'candidate', 'unresolved'
  )),
  location geography(Point, 4326),
  lifecycle_status text NOT NULL CHECK (lifecycle_status IN (
    'built', 'construction', 'announced'
  )),
  verification_status text NOT NULL DEFAULT 'candidate' CHECK (verification_status IN (
    'verified', 'candidate'
  )),
  publication_status text NOT NULL DEFAULT 'candidate' CHECK (publication_status IN (
    'published', 'candidate', 'archived', 'excluded'
  )),
  confidence text NOT NULL DEFAULT 'candidate' CHECK (confidence IN (
    'high', 'medium', 'candidate', 'in_doubt'
  )),
  summary text,
  unknowns jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(unknowns) = 'array'),
  first_reviewed_at timestamptz,
  last_reviewed_at timestamptz,
  reviewed_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (location_precision IN ('exact', 'approximate') OR location IS NULL),
  CHECK (verification_status = 'candidate' OR location_precision IN ('exact', 'approximate')),
  CHECK (publication_status <> 'published' OR verification_status = 'verified')
);

CREATE INDEX entities_publication_idx
  ON inventory.entities (publication_status, lifecycle_status, facility_class);
CREATE INDEX entities_location_idx
  ON inventory.entities USING gist (location);

CREATE TABLE inventory.entity_aliases (
  alias_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES inventory.entities(entity_id) ON DELETE CASCADE,
  alias text NOT NULL,
  alias_type text NOT NULL DEFAULT 'name' CHECK (alias_type IN (
    'name', 'operator_name', 'project_name', 'address', 'source_identifier'
  )),
  source_id uuid REFERENCES inventory.sources(source_id),
  UNIQUE (entity_id, alias)
);

CREATE TABLE inventory.entity_relationships (
  relationship_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_entity_id uuid NOT NULL REFERENCES inventory.entities(entity_id) ON DELETE CASCADE,
  child_entity_id uuid NOT NULL REFERENCES inventory.entities(entity_id) ON DELETE CASCADE,
  relationship_type text NOT NULL CHECK (relationship_type IN (
    'campus_contains', 'development_phase', 'same_site', 'successor',
    'duplicate_of', 'related_to'
  )),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (parent_entity_id <> child_entity_id),
  UNIQUE (parent_entity_id, child_entity_id, relationship_type)
);

CREATE TABLE inventory.entity_locations (
  location_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES inventory.entities(entity_id) ON DELETE CASCADE,
  address text,
  city text,
  county text,
  state_code char(2) NOT NULL DEFAULT 'TX',
  location_precision text NOT NULL CHECK (location_precision IN (
    'exact', 'approximate', 'candidate', 'unresolved'
  )),
  location geography(Point, 4326),
  source_id uuid REFERENCES inventory.sources(source_id),
  is_current boolean NOT NULL DEFAULT false,
  notes text,
  CHECK (location_precision IN ('exact', 'approximate') OR location IS NULL)
);

CREATE UNIQUE INDEX one_current_entity_location
  ON inventory.entity_locations (entity_id)
  WHERE is_current;
CREATE INDEX entity_locations_geo_idx
  ON inventory.entity_locations USING gist (location);

CREATE TABLE inventory.lifecycle_events (
  lifecycle_event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES inventory.entities(entity_id) ON DELETE CASCADE,
  lifecycle_status text NOT NULL CHECK (lifecycle_status IN (
    'built', 'construction', 'announced'
  )),
  event_date date,
  title text NOT NULL,
  description text,
  source_id uuid REFERENCES inventory.sources(source_id),
  is_current boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX one_current_lifecycle_event
  ON inventory.lifecycle_events (entity_id)
  WHERE is_current;

CREATE TABLE inventory.claims (
  claim_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES inventory.entities(entity_id) ON DELETE CASCADE,
  claim_key text NOT NULL,
  dimension_key text CHECK (dimension_key IS NULL OR dimension_key IN (
    'electricity_grid', 'water', 'air_generation', 'sound', 'vibration',
    'construction_traffic', 'zoning_land_use', 'waste_heat', 'wildlife'
  )),
  value jsonb,
  unit text,
  evidence_status text NOT NULL CHECK (evidence_status IN (
    'reported', 'confirmed', 'estimated', 'proxy', 'disputed', 'unknown'
  )),
  source_id uuid REFERENCES inventory.sources(source_id),
  excerpt text,
  observed_at timestamptz,
  valid_from date,
  valid_to date,
  comparable_entity_id uuid REFERENCES inventory.entities(entity_id),
  method text,
  reviewer_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (value IS NOT NULL OR evidence_status = 'unknown'),
  CHECK (evidence_status <> 'proxy' OR comparable_entity_id IS NOT NULL OR method IS NOT NULL)
);

CREATE INDEX claims_entity_key_idx
  ON inventory.claims (entity_id, claim_key, created_at DESC);
CREATE INDEX claims_dimension_idx
  ON inventory.claims (dimension_key, evidence_status);

CREATE TABLE inventory.research_reports (
  report_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES inventory.sources(source_id),
  origin_type text NOT NULL CHECK (origin_type IN (
    'source_import', 'manual_search', 'community_report', 'user_report', 'other'
  )),
  reported_name text NOT NULL,
  reported_operator text,
  reported_lifecycle text CHECK (reported_lifecycle IS NULL OR reported_lifecycle IN (
    'built', 'construction', 'announced', 'unknown'
  )),
  reported_location_text text,
  reported_location geography(Point, 4326),
  report_text text,
  report_url text,
  disposition text NOT NULL DEFAULT 'open' CHECK (disposition IN (
    'open', 'linked', 'merged', 'rejected', 'archived'
  )),
  linked_entity_id uuid REFERENCES inventory.entities(entity_id),
  reviewer_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by text
);

CREATE INDEX research_reports_queue_idx
  ON inventory.research_reports (disposition, created_at DESC);
CREATE INDEX research_reports_location_idx
  ON inventory.research_reports USING gist (reported_location);

CREATE TABLE inventory.publication_decisions (
  decision_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES inventory.entities(entity_id) ON DELETE CASCADE,
  publication_status text NOT NULL CHECK (publication_status IN (
    'published', 'candidate', 'archived', 'excluded'
  )),
  reason text NOT NULL,
  decided_at timestamptz NOT NULL DEFAULT now(),
  decided_by text NOT NULL,
  superseded_at timestamptz
);

CREATE INDEX publication_decisions_current_idx
  ON inventory.publication_decisions (entity_id, superseded_at);

CREATE TABLE inventory.review_events (
  review_event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid REFERENCES inventory.entities(entity_id) ON DELETE CASCADE,
  report_id uuid REFERENCES inventory.research_reports(report_id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN (
    'created', 'reviewed', 'promoted', 'downgraded', 'merged',
    'archived', 'excluded', 'corrected'
  )),
  notes text,
  reviewer text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (entity_id IS NOT NULL OR report_id IS NOT NULL)
);

CREATE OR REPLACE FUNCTION inventory.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER entities_touch_updated_at
BEFORE UPDATE ON inventory.entities
FOR EACH ROW EXECUTE FUNCTION inventory.touch_updated_at();
