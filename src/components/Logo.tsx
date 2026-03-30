interface LogoProps {
  size?: number
  white?: boolean
}

export default function Logo({ size = 32, white = false }: LogoProps) {
  const leaf = white ? '#ffffff' : '#ffffff'
  const bg = white ? 'transparent' : '#16a34a'
  const vein = white ? 'rgba(255,255,255,0.35)' : '#16a34a'

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {!white && <circle cx="20" cy="20" r="20" fill={bg} />}
      {white && <circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.15)" />}
      {/* Leaf body */}
      <path
        d="M20 34 C20 34 10 26 10 17 C10 10.5 14.5 6 20 6 C25.5 6 30 10.5 30 17 C30 26 20 34 20 34Z"
        fill={leaf}
      />
      {/* Center vein */}
      <path d="M20 34 L20 9" stroke={vein} strokeWidth="1.5" strokeLinecap="round" />
      {/* Side veins */}
      <path d="M20 19 L14.5 14.5" stroke={vein} strokeWidth="1" strokeLinecap="round" />
      <path d="M20 24 L14.5 19.5" stroke={vein} strokeWidth="1" strokeLinecap="round" />
      <path d="M20 19 L25.5 14.5" stroke={vein} strokeWidth="1" strokeLinecap="round" />
      <path d="M20 24 L25.5 19.5" stroke={vein} strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}
