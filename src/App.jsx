import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Scores from './pages/Scores'
import Standings from './pages/Standings'
import Leaders from './pages/Leaders'
import './App.css'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Scores />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/leaders" element={<Leaders />} />
        </Routes>
      </main>
    </>
  )
}
