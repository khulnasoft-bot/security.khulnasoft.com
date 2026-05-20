'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'

interface Taxonomy {
  id?: string
  name: string
  description: string
  slug: string
  icon: string
  is_active: boolean
}

interface TaxonomyEditorProps {
  taxonomy?: Taxonomy
  onSave: () => void
  onCancel: () => void
}

export default function TaxonomyEditor({
  taxonomy,
  onSave,
  onCancel,
}: TaxonomyEditorProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Taxonomy>(
    taxonomy || {
      name: '',
      description: '',
      slug: '',
      icon: '📊',
      is_active: true,
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
      setFormData(prev => ({
        ...prev,
        slug: slug || prev.slug,
      }))
    }
  }

  const handleToggle = () => {
    setFormData(prev => ({
      ...prev,
      is_active: !prev.is_active,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = taxonomy?.id ? `/api/taxonomies/${taxonomy.id}` : '/api/taxonomies'
      const method = taxonomy?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save taxonomy')

      onSave()
    } catch (error) {
      console.error('Error saving taxonomy:', error)
      alert('Failed to save taxonomy. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Taxonomy Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Open Source Supply Chain Attacks"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide a detailed description of what this taxonomy covers..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="auto-generated-from-name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon">Icon Emoji</Label>
          <Input
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            maxLength={2}
            className="text-center text-2xl"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <Label htmlFor="is_active">Active Taxonomy</Label>
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={handleToggle}
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {taxonomy?.id ? 'Update' : 'Create'} Taxonomy
        </Button>
      </div>
    </form>
  )
}
