import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Leaders from './pages/Leaders'
import PlayerDetail from './pages/PlayerDetail'
import './App.css'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaders" element={<main className="container py-4"><Leaders /></main>} />
        <Route path="/player/:id" element={<main className="container py-4"><PlayerDetail /></main>} />
      </Routes>
    </>
  )
}
