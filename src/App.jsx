import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Deck from '../components/Deck'
import Card from '../components/Card'
import { animateDeal } from './animations/dealcards'
import './app.css'

export default function App() {
  const [dealtCards, setDealtCards] = useState([])
  const [deckCount, setDeckCount] = useState(0)

  const dealtRefs = useRef([])
  const deckGroupRef = useRef()
  const handleDeckChange = (count) => setDeckCount(count)
  const handleDeal = (cards) => {
    dealtRefs.current = cards.map(() => React.createRef())
    setDealtCards(cards)
  }
  
  useEffect(() => {
    if(!dealtRefs.current || !Array.isArray(dealtRefs.current)) return
    if (dealtRefs.current.length === 0 || !deckGroupRef.current) return
    
    const tryAnimate = () => {
      const ready = dealtRefs.current.every(ref => ref?.current)

      if(ready) {
        animateDeal(dealtRefs.current, deckGroupRef)
      } else {
        requestAnimationFrame(tryAnimate)
      }
    }

    tryAnimate()
  },[dealtCards])

  const requestDeal = (n) =>
    window.dispatchEvent(new CustomEvent('deal-request', { detail: n }))
  
  const resetDeck = () => window.dispatchEvent(new Event('reset-deck'))

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start pt-8 pb-12 px-4">

      <div className="w-full max-w-3xl aspect-[4/3] md:aspect-video max-h-[80vh] relative rounded-xl overflow-hidden shadow-lg bg-white">

        <Canvas
          className="full-canvas"
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 2, 12], fov: 50 }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight
            castShadow
            position={[5, 5, 5]}
            intensity={1}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          <Deck 
            onDeal={handleDeal}
            onDeckChange={handleDeckChange}
            groupRef={deckGroupRef}
          />

          {dealtCards.map((code, idx) => {
            const count = dealtCards.length
            //const xOffset = -((count - 1) / 2) + idx * 1.2
            const rotY = (idx - (count - 1) / 2) * 0.1
            const origin = deckGroupRef.current.position
            return (
              <Card
                key={`${code}-${idx}`}
                ref={dealtRefs.current[idx]}
                code={code}
                dealt={true}
                rotation={[0, rotY, 0]}
                position={[origin.x, origin.y, origin.z]}
              />
            )
          })}
        </Canvas>
      </div>

      <div className="flex flex-col items-center space-y-4 mt-4">

        <div className="deck-count">Deck: {deckCount} cards left</div>
        <div className="flex flex-wrap justify-center gap-2 ">

          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <button key={n} onClick={() => requestDeal(n)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
>
              Deal {n}
            </button>
          ))}
          <button onClick={resetDeck}
          className="bg-blue-500 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
>
            Reset Deck
          </button>
        </div>
      </div>
    </div>
  )
}
