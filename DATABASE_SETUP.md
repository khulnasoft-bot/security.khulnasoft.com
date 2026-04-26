# Taxonomy Database Setup Guide

## Overview
This guide walks you through setting up the Supabase PostgreSQL database for the taxonomy management system.

## Prerequisites
- Supabase project connected (already done ✓)
- Access to Supabase dashboard
- Service role key available in environment variables

## Step 1: Create Tables via Supabase SQL Editor

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "+ New Query"
4. Copy the entire contents from `scripts/setup-taxonomy-db.sql`
5. Paste it into the SQL editor
6. Click "Run" button

### What This SQL Creates:
- **taxonomies**: Stores taxonomy definitions (1-2 per database typically)
- **attack_vectors**: Stores 100+ attack vectors with descriptions and examples
- **safeguards**: Stores 87+ safeguards/countermeasures
- **references**: Stores 300+ references to scientific/gray literature
- **vector_safeguard_mapping**: Links which safeguards mitigate which attacks

## Step 2: Seed Initial Data

After tables are created, seed the initial attack taxonomy:

```bash
npm run seed-taxonomy
```

This will:
1. Create the base "Open Source Supply Chain Attacks" taxonomy
2. Import 100+ attack vectors from `app/taxonomy/data/attackvectors.json`
3. Import 87+ safeguards from `app/taxonomy/data/safeguards.json`
4. Import 300+ references from `app/taxonomy/data/references.json`

## Step 3: Verify Setup

Check that data was imported:

```bash
# List all taxonomies
curl -X GET "http://localhost:3000/api/taxonomies"

# List all attack vectors
curl -X GET "http://localhost:3000/api/attack-vectors"

# List all safeguards  
curl -X GET "http://localhost:3000/api/safeguards"

# List all references
curl -X GET "http://localhost:3000/api/references"
```

## Step 4: Access the UI

Visit these URLs to explore the taxonomy:

- **Taxonomy Explorer Home**: http://localhost:3000/taxonomy-explorer
- **Attack Tree View**: http://localhost:3000/taxonomy-explorer/attack-tree
- **Attack Vectors Table**: http://localhost:3000/taxonomy-explorer/attack-vectors
- **Safeguards Table**: http://localhost:3000/taxonomy-explorer/safeguards
- **References Library**: http://localhost:3000/taxonomy-explorer/references

## Step 5: Admin Dashboard (Optional)

To manage taxonomies and create new ones:

- **Admin Dashboard**: http://localhost:3000/admin/taxonomies

Note: You'll need to set up authentication/authorization to protect admin routes.

## Database Structure

### taxonomies
```
id (UUID)           - Primary key
name (TEXT)         - Taxonomy name (required)
description (TEXT)  - Taxonomy description
slug (TEXT)         - URL-friendly identifier (unique)
icon (TEXT)         - Emoji or icon for taxonomy
version (INT)       - Version number (default: 1)
is_active (BOOL)    - Is this taxonomy active? (default: true)
created_at          - Creation timestamp
updated_at          - Last update timestamp
created_by (UUID)   - User who created it
metadata (JSONB)    - Additional metadata
```

### attack_vectors
```
id (UUID)               - Primary key
taxonomy_id (UUID)      - Foreign key to taxonomies
vector_id (TEXT)        - Unique identifier within taxonomy
name (TEXT)             - Attack vector name
description (TEXT)      - Detailed description
tactic (TEXT[])         - Associated tactics
technique (TEXT[])      - Techniques used
examples (TEXT[])       - Real-world examples
weakness (TEXT[])       - Related CWE weaknesses
created_at              - Creation timestamp
updated_at              - Last update timestamp
created_by (UUID)       - User who created it
metadata (JSONB)        - Additional metadata
```

### safeguards
```
id (UUID)           - Primary key
taxonomy_id (UUID)  - Foreign key to taxonomies
safeguard_id (TEXT) - Unique identifier within taxonomy
name (TEXT)         - Safeguard/countermeasure name
description (TEXT)  - How it works
type (TEXT[])       - Type of safeguard (technical, process, etc.)
category (TEXT)     - Category/domain
created_at          - Creation timestamp
updated_at          - Last update timestamp
created_by (UUID)   - User who created it
metadata (JSONB)    - Additional metadata
```

### references
```
id (UUID)           - Primary key
taxonomy_id (UUID)  - Foreign key to taxonomies
reference_id (TEXT) - Unique identifier within taxonomy
title (TEXT)        - Reference title
link (TEXT)         - URL to resource
year (INT)          - Publication year
authors (TEXT[])    - Author names
tags (JSONB)        - Tags/keywords
created_at          - Creation timestamp
updated_at          - Last update timestamp
created_by (UUID)   - User who created it
metadata (JSONB)    - Additional metadata
```

### vector_safeguard_mapping
```
id (UUID)               - Primary key
vector_id (UUID)        - Foreign key to attack_vectors
safeguard_id (UUID)     - Foreign key to safeguards
mitigation_level (TEXT) - 'full', 'partial', or 'none'
created_at              - When mapping was created
```

## Troubleshooting

### "Table already exists" error
This is normal if tables were already created. The CREATE TABLE IF NOT EXISTS statement handles this.

### "Foreign key constraint failed"
Make sure you:
1. Create taxonomies table first
2. Create other tables in order (they reference taxonomies)
3. Seed data after all tables are created

### Connection errors
Verify your environment variables:
```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

### No data appearing
1. Check that seed script ran successfully
2. Verify JSON files exist in `app/taxonomy/data/`
3. Check Supabase logs for any errors

## Next Steps

1. **Phase 4**: Implement multi-taxonomy support
2. **Phase 5**: Add version history and collaboration features
3. **Phase 6**: Add visualizations and analytics
4. **Authentication**: Protect admin routes with proper auth
5. **Authorization**: Set up RLS policies for row-level security

## Support

For issues:
1. Check Supabase dashboard for database logs
2. Review API route responses for error messages
3. Check browser console for client-side errors
4. Review script output for seeding issues
