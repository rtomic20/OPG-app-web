interface LogoProps {
  size?: number
  variant?: 'green' | 'white' | 'dark'
}

export default function Logo({ size = 32, variant = 'green' }: LogoProps) {
  if (variant === 'white') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.15)" />
        <path d="M20 34 C20 34 10 26 10 17 C10 10.5 14.5 6 20 6 C25.5 6 30 10.5 30 17 C30 26 20 34 20 34Z" fill="white" />
        <path d="M20 34 L20 9" stroke="rgba(45,80,22,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 19 L14.5 14.5" stroke="rgba(45,80,22,0.4)" strokeWidth="1" strokeLinecap="round" />
        <path d="M20 24 L14.5 19.5" stroke="rgba(45,80,22,0.4)" strokeWidth="1" strokeLinecap="round" />
        <path d="M20 19 L25.5 14.5" stroke="rgba(45,80,22,0.4)" strokeWidth="1" strokeLinecap="round" />
        <path d="M20 24 L25.5 19.5" stroke="rgba(45,80,22,0.4)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="#2D5016" />
      <path d="M20 34 C20 34 10 26 10 17 C10 10.5 14.5 6 20 6 C25.5 6 30 10.5 30 17 C30 26 20 34 20 34Z" fill="white" />
      <path d="M20 34 L20 9" stroke="#2D5016" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 19 L14.5 14.5" stroke="#2D5016" strokeWidth="1" strokeLinecap="round" />
      <path d="M20 24 L14.5 19.5" stroke="#2D5016" strokeWidth="1" strokeLinecap="round" />
      <path d="M20 19 L25.5 14.5" stroke="#2D5016" strokeWidth="1" strokeLinecap="round" />
      <path d="M20 24 L25.5 19.5" stroke="#2D5016" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}
