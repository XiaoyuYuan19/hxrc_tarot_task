import React, { useEffect, useRef, useState , useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import Deck from '../components/Deck'
import Card from '../components/Card'
import { animateDeal } from './animations/dealcards'
import './App.css'
import FloatingCharm from '../components/FloatingCharm';

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

  const audioRef =  useRef();
  const charms = [
          "/assets/icons/pendant1.png",
          "/assets/icons/pendant2.png",
          "/assets/icons/pendant3.png"
        ];

  const floatingCharms = useMemo(() => {
    return [...Array(10)].map((_, idx) => (
      <FloatingCharm 
        key={idx}
        src={charms[Math.floor(Math.random() * charms.length)]}
        style={{
          left: Math.random() < 0.5 ? `${Math.random() * 10 + 2}%` : undefined,
          right: Math.random() >= 0.5 ? `${Math.random() * 10 + 2}%` : undefined,
          animationDuration: `${4 + Math.random() * 4}s`,
          width: `${30 + Math.random() * 30}px`
        }}
      />
    ));
  }, []);

  useEffect(() => {
    const handleUserInteraction = () => {
      const audio = audioRef.current;
      if (audio && audio.paused) {
        audio.play().catch(err => console.log("Autoplay blocked:", err));
      }
    };
    window.addEventListener('click', handleUserInteraction);
    return () => window.removeEventListener('click', handleUserInteraction);
  }, []);

  return (
    
    <div className="h-screen bg-cover bg-center flex flex-col items-center justify-center px-4 relative "  style={{
  backgroundImage: `url('/assets/cards/bg (4).jpg')`}}>
      
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>
      <audio ref={audioRef} src="/assets/audio/bg-music.mp3" autoPlay loop />

      {floatingCharms}
      
      <div className="relative z-10 flex flex-col items-center  w-full max-w-full">
        
        <div className="w-full max-w-[90%] md:max-w-5xl lg:max-w-6xl aspect-[4/3] md:aspect-video max-h-[80vh] relative">

          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-yellow-300 drop-shadow-lg mb-2 text-center" style={{animation: "glow 3s ease-in-out infinite" }}
>✨ Tarot Reading ✨</h2>
          
          <Canvas
            className="full-canvas"
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 2, 12], fov: 45 }}
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

          <div className="deck-count text-lg font-semibold text-yellow-200">Deck: {deckCount} cards left</div>

          <div className="flex flex-wrap justify-center gap-2 ">

            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button key={n} onClick={() => requestDeal(n)}
              className="bg-purple-600/40 hover:bg-purple-700 text-yellow-200 font-semibold py-2 px-4 rounded-full shadow-md transition transform hover:scale-105"
  >
                Deal {n}
              </button>
            ))}
            <button onClick={resetDeck}
            className="bg-pink-600/40 hover:bg-pink-700 text-yellow-100 font-semibold px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105"
  >
              Reset Deck
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
