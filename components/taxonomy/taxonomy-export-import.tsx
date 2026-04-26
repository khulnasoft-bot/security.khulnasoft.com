'use client'

import { useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Upload, FileJson, Copy } from 'lucide-react'

interface ExportImportProps {
  taxonomyId: string
  taxonomyName: string
  onImport?: (data: any) => void
}

export default function TaxonomyExportImport({
  taxonomyId,
  taxonomyName,
  onImport,
}: ExportImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)

  const handleExportJSON = async () => {
    setExporting(true)
    try {
      const response = await fetch(`/api/taxonomies/${taxonomyId}/export?format=json`)
      if (!response.ok) throw new Error('Failed to export')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${taxonomyName}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting:', error)
    } finally {
      setExporting(false)
    }
  }

  const handleExportCSV = async () => {
    setExporting(true)
    try {
      const response = await fetch(`/api/taxonomies/${taxonomyId}/export?format=csv`)
      if (!response.ok) throw new Error('Failed to export')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${taxonomyName}-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting:', error)
    } finally {
      setExporting(false)
    }
  }

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      const response = await fetch(`/api/taxonomies/${taxonomyId}/export?format=pdf`)
      if (!response.ok) throw new Error('Failed to export')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${taxonomyName}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting:', error)
    } finally {
      setExporting(false)
    }
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/taxonomies/${taxonomyId}/import`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to import')

      const data = await response.json()
      onImport?.(data)
      setImportSuccess(true)

      setTimeout(() => setImportSuccess(false), 3000)
    } catch (error) {
      console.error('Error importing:', error)
    } finally {
      setImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Export Card */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Taxonomy
          </CardTitle>
          <CardDescription>Download your taxonomy in various formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">Available formats:</p>
            <Button
              onClick={handleExportJSON}
              disabled={exporting}
              variant="outline"
              className="w-full justify-start"
            >
              <FileJson className="h-4 w-4 mr-2" />
              JSON
              <Badge variant="secondary" className="ml-auto text-xs">
                Full data
              </Badge>
            </Button>
            <Button
              onClick={handleExportCSV}
              disabled={exporting}
              variant="outline"
              className="w-full justify-start"
            >
              <FileJson className="h-4 w-4 mr-2" />
              CSV
              <Badge variant="secondary" className="ml-auto text-xs">
                Spreadsheet
              </Badge>
            </Button>
            <Button
              onClick={handleExportPDF}
              disabled={exporting}
              variant="outline"
              className="w-full justify-start"
            >
              <FileJson className="h-4 w-4 mr-2" />
              PDF
              <Badge variant="secondary" className="ml-auto text-xs">
                Report
              </Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Card */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Taxonomy
          </CardTitle>
          <CardDescription>Upload a JSON file to merge data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            disabled={importing}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            variant="outline"
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {importing ? 'Importing...' : 'Choose JSON File'}
          </Button>

          {importSuccess && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-400">
                Successfully imported taxonomy data!
              </p>
            </div>
          )}

          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-2">Supported format:</p>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>• JSON exported from this system</li>
              <li>• Merge with existing data</li>
              <li>• Creates new version</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
