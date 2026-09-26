'use client'

import { useEffect, useRef, useState } from 'react'
import type * as T from 'three'
import type { Layer } from './data'

// Hambúrguer 3D montado por código (sem arquivo de modelo): cada camada é uma geometria simples
// deformada para parecer comida. Camadas novas caem de cima quando a lista muda.

const THICK: Record<Layer, number> = { bottom: 0.42, sauce: 0.05, patty: 0.32, veggie: 0.32, cheese: 0.07, bacon: 0.09, lettuce: 0.1, tomato: 0.12, onion: 0.09, top: 0.95 }

type Api = { setLayers: (layers: Layer[]) => void }

export default function Burger3D({ layers, className = '' }: { layers: Layer[]; className?: string }) {
  const host = useRef<HTMLDivElement>(null)
  const api = useRef<Api | null>(null)
  const latest = useRef(layers)
  const [failed, setFailed] = useState(false)
  latest.current = layers

  useEffect(() => {
    let disposed = false
    let cleanup = () => {}

    import('three').then((THREE) => {
      if (disposed || !host.current) return
      const el = host.current
      let renderer: T.WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      } catch {
        setFailed(true)
        return
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      el.appendChild(renderer.domElement)
      renderer.domElement.style.touchAction = 'pan-y'

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
      camera.position.set(0, 2.6, 8.2)
      camera.lookAt(0, 0.2, 0)
      scene.add(new THREE.HemisphereLight(0xfff4e8, 0x2a1206, 1.4))
      const key = new THREE.DirectionalLight(0xffe2c4, 2.4)
      key.position.set(3, 5, 4)
      scene.add(key)
      const rim = new THREE.PointLight(0xff5a1f, 40, 20)
      rim.position.set(-3.5, 1.5, -2.5)
      scene.add(rim)

      const burger = new THREE.Group()
      scene.add(burger)
      const stack = new THREE.Group()
      burger.add(stack)

      const mat = (color: number, roughness = 0.7) => new THREE.MeshStandardMaterial({ color, roughness })
      const rand = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647 })()

      // borda irregular: empurra cada vértice radialmente um pouco para dentro/fora
      const wobble = (g: T.BufferGeometry, amount: number, waves = 0, waveY = 0) => {
        const p = g.attributes.position
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), z = p.getZ(i)
          const r = Math.hypot(x, z)
          if (r < 0.01) continue
          const a = Math.atan2(z, x)
          const k = 1 + Math.sin(a * 7 + 1.3) * amount + Math.sin(a * 13) * amount * 0.5
          p.setXYZ(i, x * k, p.getY(i) + (waves ? Math.sin(a * waves) * waveY * (r / 1.4) : 0), z * k)
        }
        g.computeVertexNormals()
        return g
      }

      const make = (layer: Layer): T.Object3D => {
        const h = THICK[layer]
        switch (layer) {
          case 'bottom': return new THREE.Mesh(wobble(new THREE.CylinderGeometry(1.32, 1.22, h, 64, 2), 0.01), mat(0xd08a45, 0.8))
          case 'sauce': return new THREE.Mesh(wobble(new THREE.CylinderGeometry(1.36, 1.36, h, 64), 0.05), mat(0xf2b544, 0.35))
          case 'patty': return new THREE.Mesh(wobble(new THREE.CylinderGeometry(1.42, 1.4, h, 64, 3), 0.045), mat(0x4a2616, 0.95))
          case 'veggie': return new THREE.Mesh(wobble(new THREE.CylinderGeometry(1.38, 1.36, h, 64, 3), 0.04), mat(0x9a7236, 0.9))
          case 'lettuce': return new THREE.Mesh(wobble(new THREE.CylinderGeometry(1.52, 1.5, h, 96, 1), 0.03, 16, 0.12), mat(0x62c23f, 0.6))
          case 'onion': return new THREE.Mesh(wobble(new THREE.CylinderGeometry(1.34, 1.34, h, 64), 0.08), mat(0xb8702c, 0.5))
          case 'cheese': {
            const g = new THREE.BoxGeometry(2.55, h, 2.55, 24, 1, 24)
            const p = g.attributes.position
            for (let i = 0; i < p.count; i++) {
              const x = p.getX(i), z = p.getZ(i)
              const over = Math.max(0, Math.hypot(x, z) - 1.25)
              p.setY(i, p.getY(i) - over * over * 1.1) // pontas "derretendo" para baixo
            }
            g.computeVertexNormals()
            const m = new THREE.Mesh(g, mat(0xffb81c, 0.45))
            m.rotation.y = rand() * Math.PI
            return m
          }
          case 'bacon': {
            const group = new THREE.Group()
            for (let s = 0; s < 3; s++) {
              const g = new THREE.BoxGeometry(2.7, 0.05, 0.36, 40, 1, 1)
              const p = g.attributes.position
              for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) + Math.sin(p.getX(i) * 5 + s) * 0.05)
              g.computeVertexNormals()
              const strip = new THREE.Mesh(g, mat(0x9a3420, 0.55))
              strip.position.set(0, s * 0.012, (s - 1) * 0.42)
              strip.rotation.y = 0.5 + s * 0.35
              group.add(strip)
            }
            return group
          }
          case 'tomato': {
            const group = new THREE.Group()
            for (const [x, z] of [[-0.55, 0.2], [0.55, -0.1], [0, -0.7]]) {
              const slice = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, h, 40), mat(0xd9302a, 0.35))
              slice.position.set(x, 0, z)
              group.add(slice)
            }
            return group
          }
          case 'top': {
            const group = new THREE.Group()
            const dome = new THREE.Mesh(wobble(new THREE.SphereGeometry(1.34, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2), 0.012), mat(0xe29a4c, 0.55))
            dome.scale.y = 0.7
            dome.position.y = -h / 2
            group.add(dome)
            const seeds = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 8, 6), mat(0xfff1d6, 0.6), 46)
            const m = new THREE.Matrix4()
            const q = new THREE.Quaternion()
            for (let i = 0; i < 46; i++) {
              const theta = rand() * Math.PI * 2
              const phi = rand() * 1.15
              const dir = new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta))
              q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
              m.compose(new THREE.Vector3(dir.x * 1.34, dir.y * 1.34 * 0.7 - h / 2, dir.z * 1.34), q, new THREE.Vector3(1, 0.5, 1.7))
              seeds.setMatrixAt(i, m)
            }
            group.add(seeds)
            return group
          }
        }
      }

      type Piece = { obj: T.Object3D; target: number; delay: number }
      let pieces: Piece[] = []
      let current: Layer[] = []
      let height = 0

      const dispose = (o: T.Object3D) => o.traverse((c) => {
        const mesh = c as T.Mesh
        mesh.geometry?.dispose()
        ;(mesh.material as T.Material | undefined)?.dispose?.()
      })

      const setLayers = (next: Layer[]) => {
        let same = 0
        while (same < current.length && same < next.length && current[same] === next[same]) same++
        pieces.slice(same).forEach((p) => { stack.remove(p.obj); dispose(p.obj) })
        pieces = pieces.slice(0, same)
        let y = pieces.length ? pieces[pieces.length - 1].target + THICK[current[same - 1]] / 2 : 0
        next.slice(same).forEach((layer, i) => {
          const obj = make(layer)
          const target = y + THICK[layer] / 2
          obj.position.y = target + (current.length ? 3 + i * 0.4 : 0) // na primeira montagem não cai
          stack.add(obj)
          pieces.push({ obj, target, delay: i * 0.06 })
          y += THICK[layer]
        })
        height = y
        current = [...next]
      }

      setLayers(latest.current)
      api.current = { setLayers }

      // girar arrastando (e voltar a girar sozinho depois de soltar)
      let dragging = false
      let lastX = 0
      let spin = 0.006
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX }
      const move = (e: PointerEvent) => {
        if (!dragging) return
        burger.rotation.y += (e.clientX - lastX) * 0.012
        lastX = e.clientX
      }
      const up = () => { dragging = false }
      renderer.domElement.addEventListener('pointerdown', down)
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)

      const resize = () => {
        const { width, height: h } = el.getBoundingClientRect()
        if (!width || !h) return
        renderer.setSize(width, h, false)
        renderer.domElement.style.width = '100%'
        renderer.domElement.style.height = '100%'
        camera.aspect = width / h
        camera.updateProjectionMatrix()
      }
      const ro = new ResizeObserver(resize)
      ro.observe(el)
      resize()

      let raf = 0
      const clock = new THREE.Clock()
      const tick = () => {
        raf = requestAnimationFrame(tick)
        const dt = Math.min(clock.getDelta(), 0.05)
        const t = clock.elapsedTime
        if (!dragging && !reduce) burger.rotation.y += spin
        spin += (0.006 - spin) * 0.02
        burger.position.y = reduce ? 0 : Math.sin(t * 1.3) * 0.06
        stack.position.y += (-height / 2 - stack.position.y) * 0.1 // centraliza conforme o lanche cresce
        for (const p of pieces) {
          if (p.delay > 0) { p.delay -= dt; continue }
          p.obj.position.y += (p.target - p.obj.position.y) * Math.min(1, dt * 11)
        }
        renderer.render(scene, camera)
      }
      tick()

      cleanup = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        renderer.domElement.removeEventListener('pointerdown', down)
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        dispose(scene)
        renderer.dispose()
        renderer.domElement.remove()
        api.current = null
      }
    }).catch(() => setFailed(true))

    return () => { disposed = true; cleanup() }
  }, [])

  useEffect(() => { api.current?.setLayers(layers) }, [layers])

  return (
    <div ref={host} className={`relative cursor-grab active:cursor-grabbing ${className}`} role="img" aria-label="Hambúrguer em 3D; arraste para girar">
      {failed && <p className="absolute inset-0 grid place-items-center text-sm text-[#FFF4E8]/50">Visualização 3D indisponível neste navegador</p>}
    </div>
  )
}
