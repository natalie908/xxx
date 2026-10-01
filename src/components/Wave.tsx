export function Wave() {
  const path = 'M0 20 Q 25 0 50 20 T 100 20 T 150 20 T 200 20 V40 H0 Z'
  return (
    <div className="relative h-8 overflow-hidden" aria-hidden>
      <svg className="wave slow absolute bottom-0 left-0 h-8 opacity-50" viewBox="0 0 200 40" preserveAspectRatio="none">
        <path d={path} fill="#2cc9bf" />
      </svg>
      <svg className="wave absolute bottom-0 left-0 h-6" viewBox="0 0 200 40" preserveAspectRatio="none">
        <path d={path} fill="#0fb5ae" />
      </svg>
    </div>
  )
}
