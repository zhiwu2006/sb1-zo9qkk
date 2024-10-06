import React, { useState } from 'react'
import WordList from './components/WordList'
import ImportForm from './components/ImportForm'
import { PlusCircle } from 'lucide-react'

export interface WordPair {
  id: number
  english: string
  chinese: string
}

function App() {
  const [wordPairs, setWordPairs] = useState<WordPair[]>([])

  const addWordPair = (english: string, chinese: string) => {
    setWordPairs([...wordPairs, { id: Date.now(), english, chinese }])
  }

  const importWords = (importedWords: string) => {
    const newPairs = importedWords.split('\n').map((line) => {
      const [english, chinese] = line.split(',').map((word) => word.trim())
      return { id: Date.now() + Math.random(), english, chinese }
    })
    setWordPairs([...wordPairs, ...newPairs])
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">英汉单词配对 / English-Chinese Word Pairing</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <ImportForm onImport={importWords} />
        <div className="mt-4 flex items-center">
          <input
            type="text"
            placeholder="English word"
            className="flex-1 p-2 border rounded-l"
            id="englishWord"
          />
          <input
            type="text"
            placeholder="中文意思"
            className="flex-1 p-2 border-t border-b border-r"
            id="chineseWord"
          />
          <button
            onClick={() => {
              const englishInput = document.getElementById('englishWord') as HTMLInputElement
              const chineseInput = document.getElementById('chineseWord') as HTMLInputElement
              addWordPair(englishInput.value, chineseInput.value)
              englishInput.value = ''
              chineseInput.value = ''
            }}
            className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition-colors"
          >
            <PlusCircle size={24} />
          </button>
        </div>
        <WordList wordPairs={wordPairs} />
      </div>
    </div>
  )
}

export default App