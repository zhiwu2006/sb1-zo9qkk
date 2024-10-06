import React, { useState } from 'react'
import { Upload } from 'lucide-react'

interface ImportFormProps {
  onImport: (words: string) => void
}

const ImportForm: React.FC<ImportFormProps> = ({ onImport }) => {
  const [importText, setImportText] = useState('')

  const handleImport = () => {
    onImport(importText)
    setImportText('')
  }

  return (
    <div className="mb-4">
      <textarea
        value={importText}
        onChange={(e) => setImportText(e.target.value)}
        placeholder="Import words (format: English,Chinese)"
        className="w-full p-2 border rounded mb-2"
        rows={4}
      />
      <button
        onClick={handleImport}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center"
      >
        <Upload size={18} className="mr-2" />
        Import Words
      </button>
    </div>
  )
}

export default ImportForm