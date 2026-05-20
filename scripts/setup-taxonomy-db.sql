-- Taxonomy Database Schema
-- This script creates tables for managing taxonomies, attack vectors, safeguards, and references

-- Create taxonomies table
CREATE TABLE IF NOT EXISTS taxonomies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT taxonomies_name_unique UNIQUE(name)
);

-- Create attack vectors table
CREATE TABLE IF NOT EXISTS attack_vectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  taxonomy_id UUID NOT NULL REFERENCES taxonomies(id) ON DELETE CASCADE,
  vector_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  tactic TEXT[],
  technique TEXT[],
  examples TEXT[],
  weakness TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT attack_vectors_unique UNIQUE(taxonomy_id, vector_id)
);

-- Create safeguards table
CREATE TABLE IF NOT EXISTS safeguards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  taxonomy_id UUID NOT NULL REFERENCES taxonomies(id) ON DELETE CASCADE,
  safeguard_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT[],
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT safeguards_unique UNIQUE(taxonomy_id, safeguard_id)
);

-- Create references table
CREATE TABLE IF NOT EXISTS references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  taxonomy_id UUID NOT NULL REFERENCES taxonomies(id) ON DELETE CASCADE,
  reference_id TEXT NOT NULL,
  title TEXT NOT NULL,
  link TEXT,
  year INTEGER,
  authors TEXT[],
  tags JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT references_unique UNIQUE(taxonomy_id, reference_id)
);

-- Create mapping tables for relationships
CREATE TABLE IF NOT EXISTS vector_safeguard_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vector_id UUID NOT NULL REFERENCES attack_vectors(id) ON DELETE CASCADE,
  safeguard_id UUID NOT NULL REFERENCES safeguards(id) ON DELETE CASCADE,
  mitigation_level TEXT CHECK (mitigation_level IN ('full', 'partial', 'none')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT vector_safeguard_unique UNIQUE(vector_id, safeguard_id)
);

CREATE TABLE IF NOT EXISTS vector_reference_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vector_id UUID NOT NULL REFERENCES attack_vectors(id) ON DELETE CASCADE,
  reference_id UUID NOT NULL REFERENCES references(id) ON DELETE CASCADE,
  relevance_score INTEGER CHECK (relevance_score >= 0 AND relevance_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT vector_reference_unique UNIQUE(vector_id, reference_id)
);

-- Create audit/version history table
CREATE TABLE IF NOT EXISTS taxonomy_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  taxonomy_id UUID NOT NULL REFERENCES taxonomies(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL CHECK (change_type IN ('create', 'update', 'delete')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('vector', 'safeguard', 'reference')),
  entity_id TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  change_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  approved BOOLEAN DEFAULT false,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_attack_vectors_taxonomy_id ON attack_vectors(taxonomy_id);
CREATE INDEX IF NOT EXISTS idx_attack_vectors_vector_id ON attack_vectors(vector_id);
CREATE INDEX IF NOT EXISTS idx_safeguards_taxonomy_id ON safeguards(taxonomy_id);
CREATE INDEX IF NOT EXISTS idx_safeguards_safeguard_id ON safeguards(safeguard_id);
CREATE INDEX IF NOT EXISTS idx_references_taxonomy_id ON references(taxonomy_id);
CREATE INDEX IF NOT EXISTS idx_vector_safeguard_mapping_vector ON vector_safeguard_mapping(vector_id);
CREATE INDEX IF NOT EXISTS idx_vector_safeguard_mapping_safeguard ON vector_safeguard_mapping(safeguard_id);
CREATE INDEX IF NOT EXISTS idx_vector_reference_mapping_vector ON vector_reference_mapping(vector_id);
CREATE INDEX IF NOT EXISTS idx_vector_reference_mapping_reference ON vector_reference_mapping(reference_id);
CREATE INDEX IF NOT EXISTS idx_taxonomy_changes_taxonomy_id ON taxonomy_changes(taxonomy_id);

-- Enable RLS on all tables
ALTER TABLE taxonomies ENABLE ROW LEVEL SECURITY;
ALTER TABLE attack_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE safeguards ENABLE ROW LEVEL SECURITY;
ALTER TABLE references ENABLE ROW LEVEL SECURITY;
ALTER TABLE vector_safeguard_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE vector_reference_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE taxonomy_changes ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow all users to read
CREATE POLICY "Enable read access for all users" ON taxonomies
  FOR SELECT USING (is_active = true);

CREATE POLICY "Enable read access for all users" ON attack_vectors
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON safeguards
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON references
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON vector_safeguard_mapping
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON vector_reference_mapping
  FOR SELECT USING (true);

-- RLS Policies - Allow authenticated users to create/edit
CREATE POLICY "Enable insert for authenticated users" ON taxonomies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON taxonomies
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON attack_vectors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON attack_vectors
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON safeguards
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON safeguards
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON references
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON references
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_taxonomies_updated_at
BEFORE UPDATE ON taxonomies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_attack_vectors_updated_at
BEFORE UPDATE ON attack_vectors
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_safeguards_updated_at
BEFORE UPDATE ON safeguards
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_references_updated_at
BEFORE UPDATE ON references
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
