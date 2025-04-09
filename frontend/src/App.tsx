import { useState } from 'react';
import './App.css'
import TopNav from './common/layouts/TopNav'
import { BottomNav } from './features/ToiletMap/components/BottomNav'
import { ToiletMapPage } from './features/ToiletMap/pages'

function App() {
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(null);

  return (
    <>
      <TopNav />
      <ToiletMapPage position={position} map={setMap} />
      <BottomNav map={map} setPosition={setPosition} />
    </>
  )
}

export default App
