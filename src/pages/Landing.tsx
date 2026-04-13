import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'

type HeroNavItem = {
  label: string
  href: string
}

const heroNavItems: HeroNavItem[] = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Categories', href: '/#categories' },
  { label: 'Enterprise', href: '/#enterprise' },
  { label: 'CommitScore', href: '/#enterprise' },
]

const steps = [
  {
    id: '01',
    title: 'Set Your Commitment',
    text: 'Define outcomes, pick verification, and align members before the deadline starts.',
  },
  {
    id: '02',
    title: 'Stake Your Amount in INR',
    text: 'Lock stake in escrow with transparent rules and real-time status for every participant.',
  },
  {
    id: '03',
    title: 'Deliver. Prove. Earn.',
    text: 'Submit proof and reclaim stake with rewards when your commitment is completed on time.',
  },
]

const categories = [
  { name: 'Government', note: 'Compliance programs and public-sector milestones' },
  { name: 'Corporate', note: 'B2B delivery timelines and contract outcomes' },
  { name: 'Legal', note: 'Verifier-backed legal and compliance commitments' },
  { name: 'Education', note: 'Study circles, cohorts, and exam accountability' },
  { name: 'Personal', note: 'Fitness, habit, and side-project execution goals' },
]

function createFaceCanvas(size = 1024) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to create 2D canvas context')
  }
  return { canvas, ctx, size }
}

function drawGrid(ctx: CanvasRenderingContext2D, size: number, step: number, color: string) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  for (let x = 0; x <= size; x += step) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, size)
    ctx.stroke()
  }
  for (let y = 0; y <= size; y += step) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(size, y)
    ctx.stroke()
  }
  ctx.restore()
}

function drawHexMesh(ctx: CanvasRenderingContext2D, size: number, radius: number, color: string) {
  const h = Math.sqrt(3) * radius
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.2

  for (let y = -h; y < size + h; y += h) {
    for (let x = -radius * 2; x < size + radius * 2; x += radius * 3) {
      const offsetX = ((Math.floor(y / h) % 2) * 1.5 + 0.5) * radius
      const cx = x + offsetX
      const cy = y
      ctx.beginPath()
      for (let i = 0; i < 6; i += 1) {
        const a = (Math.PI / 3) * i
        const px = cx + radius * Math.cos(a)
        const py = cy + radius * Math.sin(a)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.stroke()
    }
  }

  ctx.restore()
}

function drawLockIcon(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 8

  ctx.beginPath()
  ctx.arc(x, y - 30 * scale, 46 * scale, Math.PI * 1.15, Math.PI * 1.85)
  ctx.stroke()

  ctx.fillRect(x - 58 * scale, y - 10 * scale, 116 * scale, 120 * scale)
  ctx.strokeRect(x - 58 * scale, y - 10 * scale, 116 * scale, 120 * scale)

  ctx.beginPath()
  ctx.arc(x, y + 46 * scale, 13 * scale, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.fill()

  ctx.restore()
}

export default function Landing() {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambient)

    const orbitLightA = new THREE.PointLight(0x7c3aed, 2.5, 8)
    orbitLightA.position.set(4, 1.2, 0)
    scene.add(orbitLightA)

    const orbitLightB = new THREE.PointLight(0x06b6d4, 1.5, 8)
    orbitLightB.position.set(-3, -0.8, 0)
    scene.add(orbitLightB)

    const fill = new THREE.DirectionalLight(0xffffff, 0.6)
    fill.position.set(-3, 3, 4)
    scene.add(fill)

    const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5)

    const front = createFaceCanvas()
    const back = createFaceCanvas()
    const top = createFaceCanvas()
    const bottom = createFaceCanvas()
    const left = createFaceCanvas()
    const right = createFaceCanvas()

    const frontGradient = front.ctx.createLinearGradient(0, 0, front.size, front.size)
    frontGradient.addColorStop(0, '#1a0b2e')
    frontGradient.addColorStop(0.55, '#7c3aed')
    frontGradient.addColorStop(1, '#2e1065')
    front.ctx.fillStyle = frontGradient
    front.ctx.fillRect(0, 0, front.size, front.size)
    drawGrid(front.ctx, front.size, 56, 'rgba(187,155,255,0.15)')
    front.ctx.fillStyle = 'rgba(255,255,255,0.95)'
    front.ctx.font = '900 142px Sora, sans-serif'
    front.ctx.textAlign = 'center'
    front.ctx.textBaseline = 'middle'
    front.ctx.fillText('STAKE', front.size / 2, front.size / 2)

    const backGradient = back.ctx.createLinearGradient(0, 0, back.size, back.size)
    backGradient.addColorStop(0, '#083344')
    backGradient.addColorStop(0.6, '#06b6d4')
    backGradient.addColorStop(1, '#0e7490')
    back.ctx.fillStyle = backGradient
    back.ctx.fillRect(0, 0, back.size, back.size)
    drawHexMesh(back.ctx, back.size, 28, 'rgba(240,253,250,0.2)')
    back.ctx.fillStyle = 'rgba(255,255,255,0.96)'
    back.ctx.font = '900 150px Sora, sans-serif'
    back.ctx.textAlign = 'center'
    back.ctx.textBaseline = 'middle'
    back.ctx.fillText('EARN', back.size / 2, back.size / 2)

    const topGradient = top.ctx.createLinearGradient(0, 0, top.size, top.size)
    topGradient.addColorStop(0, '#2e1065')
    topGradient.addColorStop(1, '#111827')
    top.ctx.fillStyle = topGradient
    top.ctx.fillRect(0, 0, top.size, top.size)
    top.ctx.fillStyle = 'rgba(255,255,255,0.9)'
    top.ctx.font = '700 112px Sora, sans-serif'
    top.ctx.textAlign = 'center'
    top.ctx.textBaseline = 'middle'
    top.ctx.fillText('+18.7% APY', top.size / 2, top.size / 2)

    const bottomGradient = bottom.ctx.createLinearGradient(0, 0, bottom.size, bottom.size)
    bottomGradient.addColorStop(0, '#020617')
    bottomGradient.addColorStop(1, '#172554')
    bottom.ctx.fillStyle = bottomGradient
    bottom.ctx.fillRect(0, 0, bottom.size, bottom.size)

    const leftGradient = left.ctx.createLinearGradient(0, 0, left.size, left.size)
    leftGradient.addColorStop(0, '#581c87')
    leftGradient.addColorStop(0.55, '#db2777')
    leftGradient.addColorStop(1, '#be185d')
    left.ctx.fillStyle = leftGradient
    left.ctx.fillRect(0, 0, left.size, left.size)
    left.ctx.fillStyle = 'rgba(255,255,255,0.95)'
    left.ctx.font = '900 122px Sora, sans-serif'
    left.ctx.textAlign = 'center'
    left.ctx.fillText('SECURE', left.size / 2, left.size / 2 - 120)
    drawLockIcon(left.ctx, left.size / 2, left.size / 2 + 120, 1)

    const rightGradient = right.ctx.createLinearGradient(0, 0, right.size, right.size)
    rightGradient.addColorStop(0, '#042f2e')
    rightGradient.addColorStop(0.6, '#14b8a6')
    rightGradient.addColorStop(1, '#0f766e')
    right.ctx.fillStyle = rightGradient
    right.ctx.fillRect(0, 0, right.size, right.size)
    right.ctx.fillStyle = 'rgba(255,255,255,0.96)'
    right.ctx.font = '900 132px Sora, sans-serif'
    right.ctx.textAlign = 'center'
    right.ctx.textBaseline = 'middle'
    right.ctx.fillText('LIQUID', right.size / 2, right.size / 2)

    const textures = [front, back, top, bottom, left, right].map(({ canvas }) => {
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
      return texture
    })

    const materials = textures.map(
      (texture) =>
        new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.32,
          metalness: 0.45,
          emissive: new THREE.Color(0x09090b),
          emissiveIntensity: 0.35,
        }),
    )

    const cube = new THREE.Mesh(geometry, materials)
    cube.position.set(2.5, 0, 0)
    scene.add(cube)

    const starGeometry = new THREE.BufferGeometry()
    const starVertices = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i += 1) {
      const i3 = i * 3
      starVertices[i3] = (Math.random() - 0.5) * 60
      starVertices[i3 + 1] = (Math.random() - 0.5) * 34
      starVertices[i3 + 2] = (Math.random() - 0.5) * 50
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starVertices, 3))
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.015, transparent: true, opacity: 0.9 })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    const shadowGeometry = new THREE.CircleGeometry(1.5, 64)
    const shadowMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { value: new THREE.Vector3(124 / 255, 58 / 255, 237 / 255) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColor;
        void main() {
          float dist = distance(vUv, vec2(0.5));
          float alpha = smoothstep(0.5, 0.0, dist) * 0.4;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    })
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial)
    shadow.rotation.x = -Math.PI / 2
    shadow.position.set(2.5, -1.8, 0)
    scene.add(shadow)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2(2, 2)
    let mouseX = 0
    let mouseY = 0
    let hovered = false

    const particlesTop = Array.from({ length: 36 }, () => ({
      x: Math.random() * top.size,
      y: Math.random() * top.size,
      speed: 0.3 + Math.random() * 0.8,
      size: 1 + Math.random() * 2.2,
      alpha: 0.15 + Math.random() * 0.4,
    }))

    const flowingLines = Array.from({ length: 8 }, (_, i) => ({
      offset: i * 0.6,
      amp: 16 + i * 2,
    }))

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      const localX = event.clientX - rect.left
      const localY = event.clientY - rect.top

      mouseX = (localX / rect.width - 0.5) * 2
      mouseY = (localY / rect.height - 0.5) * 2

      pointer.x = (localX / rect.width) * 2 - 1
      pointer.y = -(localY / rect.height) * 2 + 1
    }

    const onResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', handlePointerMove)

    const clock = new THREE.Clock()

    const animate = () => {
      const elapsed = clock.getElapsedTime()

      raycaster.setFromCamera(pointer, camera)
      hovered = raycaster.intersectObject(cube).length > 0

      const rotationFactor = hovered ? 0.4 : 1
      cube.rotation.y += 0.004 * rotationFactor
      cube.rotation.x += 0.002 * rotationFactor

      cube.rotation.y += mouseX * 0.0003
      cube.rotation.x += mouseY * 0.0002

      const targetScale = hovered ? 1.08 : 1
      const nextScale = THREE.MathUtils.lerp(cube.scale.x, targetScale, 0.08)
      cube.scale.set(nextScale, nextScale, nextScale)

      orbitLightA.intensity = 2.2 + Math.sin(elapsed * 2.2) * 0.3
      orbitLightA.position.x = Math.sin(elapsed) * 4
      orbitLightA.position.z = Math.cos(elapsed) * 4

      orbitLightB.position.x = Math.sin(elapsed + Math.PI) * 3
      orbitLightB.position.z = Math.cos(elapsed + Math.PI) * 3

      top.ctx.fillStyle = 'rgba(20,10,36,0.35)'
      top.ctx.fillRect(0, 0, top.size, top.size)
      top.ctx.fillStyle = 'rgba(255,255,255,0.92)'
      top.ctx.font = '700 112px Sora, sans-serif'
      top.ctx.textAlign = 'center'
      top.ctx.textBaseline = 'middle'
      top.ctx.fillText('+18.7% APY', top.size / 2, top.size / 2)
      for (const p of particlesTop) {
        p.y -= p.speed
        if (p.y < -10) p.y = top.size + 10
        top.ctx.beginPath()
        top.ctx.fillStyle = `rgba(196,181,253,${p.alpha})`
        top.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        top.ctx.fill()
      }

      bottom.ctx.fillStyle = '#020617'
      bottom.ctx.fillRect(0, 0, bottom.size, bottom.size)
      bottom.ctx.strokeStyle = 'rgba(56,189,248,0.75)'
      bottom.ctx.lineWidth = 5
      bottom.ctx.beginPath()
      for (let x = 0; x <= bottom.size; x += 6) {
        const y = bottom.size * 0.5 + Math.sin((x + elapsed * 220) * 0.018) * 80
        if (x === 0) bottom.ctx.moveTo(x, y)
        else bottom.ctx.lineTo(x, y)
      }
      bottom.ctx.stroke()

      right.ctx.fillStyle = rightGradient
      right.ctx.fillRect(0, 0, right.size, right.size)
      right.ctx.fillStyle = 'rgba(255,255,255,0.96)'
      right.ctx.font = '900 132px Sora, sans-serif'
      right.ctx.textAlign = 'center'
      right.ctx.textBaseline = 'middle'
      right.ctx.fillText('LIQUID', right.size / 2, right.size * 0.34)
      right.ctx.lineWidth = 3
      for (const line of flowingLines) {
        right.ctx.beginPath()
        right.ctx.strokeStyle = 'rgba(94,234,212,0.55)'
        for (let x = 0; x <= right.size; x += 10) {
          const y = right.size * 0.62 + Math.sin(x * 0.014 + elapsed * 2 + line.offset) * line.amp
          if (x === 0) right.ctx.moveTo(x, y)
          else right.ctx.lineTo(x, y)
        }
        right.ctx.stroke()
      }

      textures[2].needsUpdate = true
      textures[3].needsUpdate = true
      textures[5].needsUpdate = true

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    let animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', handlePointerMove)

      geometry.dispose()
      shadowGeometry.dispose()
      starGeometry.dispose()
      shadowMaterial.dispose()
      starMaterial.dispose()
      textures.forEach((texture) => texture.dispose())
      materials.forEach((material) => material.dispose())
      renderer.dispose()

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="bg-obsidian text-white">
      <header className="fixed left-0 top-0 z-30 w-full px-5 pt-5 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#05070c]/70 px-4 py-3 backdrop-blur-xl sm:px-6">
          <Link
            to="/"
            data-cursor="pointer"
            className="font-syne text-base font-bold tracking-wide text-white sm:text-lg"
          >
            StakePact
          </Link>

          <nav aria-label="Primary" className="flex-1 overflow-x-auto px-2">
            <ul className="mx-auto flex w-max min-w-full items-center justify-center gap-6 whitespace-nowrap text-lg sm:gap-8 sm:text-[30px]">
              {heroNavItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    data-cursor="pointer"
                    className="text-white/55 transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            to="/create"
            data-cursor="pointer"
            className="hidden rounded-md border border-[#7c3aed]/60 bg-[#7c3aed]/18 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7c3aed]/30 md:inline-flex"
          >
            Launch
          </Link>
        </div>
      </header>

      <section id="hero" className="relative min-h-screen w-full overflow-hidden bg-transparent">
        <div ref={mountRef} className="absolute inset-0" />

        <div className="hero-copy hero-reveal absolute left-0 top-0 z-10 flex min-h-screen w-full items-center px-6 sm:px-10 lg:px-20">
          <div className="max-w-2xl pt-20">
            <h1 className="hero-title text-white">Stake Smarter. Earn Together.</h1>
            <p className="mt-6 max-w-xl text-base text-white/65 sm:text-lg">
              Join the next generation DeFi staking network with transparent rewards,
              high-yield pools, and institutional-grade security.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/create"
                data-cursor="pointer"
                className="rounded-md border border-[#7c3aed]/60 bg-[#7c3aed]/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7c3aed]/35"
              >
                Start Staking
              </Link>
              <Link
                to="/dashboard"
                data-cursor="pointer"
                className="rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white/85 transition-colors hover:border-white/40 hover:text-white"
              >
                Explore Pools
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative z-20 mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-12">
        <p className="font-mono text-[11px] tracking-[4px] text-teal">HOW IT WORKS</p>
        <h2 className="mt-4 font-syne text-4xl font-bold sm:text-5xl">How StakePact Works</h2>
        <p className="mt-4 max-w-2xl text-white/60">
          Every pact is time-bound, cryptographically enforced, and impossible to ignore.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-[8px]"
            >
              <p className="font-mono text-xs tracking-[3px] text-teal">STEP {step.id}</p>
              <h3 className="mt-3 font-syne text-xl font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="categories" className="relative z-20 mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
        <p className="font-mono text-[11px] tracking-[4px] text-teal">CATEGORIES</p>
        <h2 className="mt-4 font-syne text-4xl font-bold sm:text-5xl">Built for Every Industry</h2>
        <p className="mt-4 max-w-2xl text-white/60">
          From enterprise programs to solo goals, StakePact adapts to your mission.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <article
              key={category.name}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20"
            >
              <h3 className="font-syne text-lg font-bold">{category.name}</h3>
              <p className="mt-2 text-sm text-white/55">{category.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="enterprise" className="relative z-20 mx-auto max-w-7xl px-6 pb-28 pt-16 sm:px-10 lg:px-12">
        <div className="rounded-3xl border border-[#7c3aed]/30 bg-gradient-to-br from-[#1a0b2e]/70 via-[#0b1020]/80 to-[#05263a]/70 p-8 sm:p-10">
          <p className="font-mono text-[11px] tracking-[4px] text-teal">ENTERPRISE</p>
          <h2 className="mt-4 max-w-3xl font-syne text-3xl font-bold sm:text-4xl">
            Does your company miss contract deadlines? Make them costly.
          </h2>
          <p className="mt-4 max-w-2xl text-white/60">
            Get custom pact templates, dedicated verifier workflows, and full commitment analytics.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/create"
              data-cursor="pointer"
              className="rounded-md border border-teal/40 bg-teal/15 px-6 py-3 text-sm font-semibold text-teal transition-colors hover:bg-teal/25"
            >
              Schedule Enterprise Demo
            </Link>
            <Link
              to="/profile"
              data-cursor="pointer"
              className="rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white/85 transition-colors hover:border-white/40"
            >
              View CommitScore
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
