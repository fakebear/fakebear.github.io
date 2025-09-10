import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

// 自动导入 blogs 目录下所有 md 文件（仅限 CRA/Webpack）
const context = require.context('../../../blogs', false, /\.md$/)

export default function Blogs() {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    setFiles(context.keys().map(path => ({
      name: path.replace('./', ''),
      path
    })))
  }, [])

  const handleSelect = (file) => {
    setSelectedFile(file.name)
    fetch(context(file.path)).then(res => res.text()).then(setContent)
  }

  return (
    <div className="flex h-[calc(100vh-5rem)]">
      <aside className="w-64 bg-gray-100 border-r p-4">
        <h2 className="font-bold mb-4">Blog 列表</h2>
        <ul>
          {files.map(file => (
            <li key={file.name}>
              <button
                className={`block w-full text-left px-2 py-1 rounded hover:bg-blue-100 ${selectedFile === file.name ? 'bg-blue-200 font-bold' : ''}`}
                onClick={() => handleSelect(file)}
              >
                {file.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        {content ? (
          <div className="prose max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-gray-400">请选择一个博客文件</div>
        )}
      </main>
    </div>
  )
}
