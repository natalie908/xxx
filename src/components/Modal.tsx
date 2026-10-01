import type { ReactNode } from 'react'

export function Modal({ onClose, children, center = false }: { onClose: () => void; children: ReactNode; center?: boolean }) {
  return (
    <div
      className={`fade fixed inset-0 z-50 flex bg-sea-800/50 backdrop-blur-[2px] ${center ? 'items-center' : 'items-end'} justify-center`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${center ? 'pop-in rounded-[2rem] mx-4' : 'sheet-up rounded-t-[2rem]'} w-full max-w-md bg-sand-50 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl max-h-[92dvh] overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  )
}
