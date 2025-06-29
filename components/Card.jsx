import React, { forwardRef, useRef, useImperativeHandle } from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { cardMap } from '../utils/cardList'
import { addHoverEffect } from '../src/animations/hovercard';
import { useEffect } from 'react';

const Card = forwardRef(({
  code,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}, ref) => {
  const meshRef = useRef()
  useImperativeHandle(ref, () => meshRef.current, [])

  const frontUrl = cardMap[code]
  const backUrl = cardMap['CardBacks']
  const [frontTex, backTex] = useLoader(
    THREE.TextureLoader,
    [frontUrl, backUrl]
  )

  const materials = [
    new THREE.MeshStandardMaterial({ color: '#222' }),
    new THREE.MeshStandardMaterial({ color: '#222' }),
    new THREE.MeshStandardMaterial({ color: '#222' }),
    new THREE.MeshStandardMaterial({ color: '#222' }),
    new THREE.MeshStandardMaterial({ map: frontTex }),
    new THREE.MeshStandardMaterial({ map: backTex }),
  ]

  useEffect(() => {
    if (meshRef.current) {
      const hover = addHoverEffect(meshRef.current);
      meshRef.current.userData.hoverIn = hover.hoverIn;
      meshRef.current.userData.hoverOut = hover.hoverOut;
    }
  }, []);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      material={materials}
      castShadow
      receiveShadow
      onPointerOver={() => meshRef.current?.userData.hoverIn?.()}
      onPointerOut={() => meshRef.current?.userData.hoverOut?.()}

    >
      <boxGeometry args={[2.5, 3.5, 0.1]} />
    </mesh>
  )
})

export default Card