import React from 'react'
import { WordPair } from '../App'

interface WordListProps {
  wordPairs: WordPair[]
}

const WordList: React.FC<WordListProps> = ({ wordPairs }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Word List</h2>
      <div className="grid grid-cols-2 gap-2">
        {wordPairs.map((pair) => (
          <React.Fragment key={pair.id}>
            <div className="bg-gray-100 p-2 rounded">{pair.english}</div>
            <div className="bg-gray-100 p-2 rounded">{pair.chinese}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default WordList