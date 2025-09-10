import React, { useState } from 'react'

const timelineData = [
  {
    year: '2021',
    title: '入职某公司',
    summary: '开始职业生涯，参与多个项目开发。',
    detail: '2021年加入某公司，担任前端开发工程师，负责公司官网和管理后台的开发与维护。'
  },
  {
    year: '2022',
    title: '项目负责人',
    summary: '带领团队完成大型项目。',
    detail: '2022年晋升为项目负责人，带领5人团队完成电商平台的开发，项目上线后用户量大幅提升。'
  },
  {
    year: '2023',
    title: '技术创新',
    summary: '推动技术升级，引入新框架。',
    detail: '2023年主导技术升级，成功引入React和微前端架构，提升开发效率和系统稳定性。'
  },
  {
    year: '1998-2002',
    title: '大学本科',
    summary: '兰州交通大学 工业自动化专业',
    detail: ` <h2>教育经历</h2>
              <ul>
                <li>1998-2002 兰州交通大学 工业自动化专业 本科</li>
                <li>毕业设计：列车轮轨润滑控制系统（该设计成功在天水-陇西段投入使用）</li>
                <li>获得奖项：全国大学生电子设计竞赛国家二等奖、省一等奖</li>
                <li>英语证书：CET-6</li>
              </ul>`
  }
]

export default function Resume() {
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState(null)

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 bg-white shadow-md p-6">
        <div className="relative flex flex-col items-center h-full">
          {/* 时间轴线 */}
          <div className="absolute left-8 top-0 w-1 h-full bg-gray-200"></div>
          {timelineData.map((item, idx) => (
            <div key={item.year} className="relative mb-12 flex items-center group">
              {/* 时间点 */}
              <button
                className={`z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                  ${selected === idx ? 'bg-blue-500 border-blue-700' : 'bg-white border-gray-400'}
                  `}
                onClick={() => setSelected(idx)}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="text-xs font-bold text-gray-700">{item.year.slice(-2)}</span>
              </button>
              {/* 时间点右侧标题 */}
              <span className="ml-4 text-gray-800 font-medium">{item.title}</span>
              {/* 悬浮摘要 */}
              {hovered === idx && (
                <div className="absolute left-16 top-0 bg-gray-800 text-white text-sm rounded px-3 py-2 shadow-lg whitespace-nowrap z-20">
                  {item.summary}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">{timelineData[selected].title}</h1>
          <div className="text-gray-600 mb-2">{timelineData[selected].year}</div>
          <div
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: timelineData[selected].detail }}
          />
        </div>
      </main>
    </div>
  )
}
