import { useCallback, useEffect, useRef } from 'react'
import Icon from './Icon'

// Full-screen image viewer. Closes with Esc or a click on the backdrop,
// and moves between images with the arrow keys or buttons.
export default function Lightbox({ items, index, onClose, onChange }) {
  const closeRef = useRef(null)
  const item = items[index]
  const many = items.length > 1

  const go = useCallback(
    (step) => onChange((index + step + items.length) % items.length),
    [index, items.length, onChange],
  )

  useEffect(() => {
    const previous = document.activeElement
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (many && e.key === 'ArrowLeft') go(-1)
      if (many && e.key === 'ArrowRight') go(1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previous?.focus?.()
    }
  }, [go, many, onClose])

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.caption || item.alt}
      onClick={onClose}
    >
      <button ref={closeRef} className="lightbox-close" onClick={onClose} aria-label="Close image">
        <Icon name="close" size={22} />
      </button>
      {many && (
        <button
          className="lightbox-nav lightbox-prev"
          onClick={(e) => {
            e.stopPropagation()
            go(-1)
          }}
          aria-label="Previous image"
        >
          <Icon name="left" size={24} />
        </button>
      )}
      <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
        <img src={item.src} alt={item.alt} />
        {(item.caption || many) && (
          <figcaption>
            {item.caption}
            {many && <span className="lightbox-count"> {index + 1} / {items.length}</span>}
          </figcaption>
        )}
      </figure>
      {many && (
        <button
          className="lightbox-nav lightbox-next"
          onClick={(e) => {
            e.stopPropagation()
            go(1)
          }}
          aria-label="Next image"
        >
          <Icon name="right" size={24} />
        </button>
      )}
    </div>
  )
}
