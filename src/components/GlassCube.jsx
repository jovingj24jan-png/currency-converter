export default function GlassCube() {
  return (
    <div className="cube-scene" aria-hidden="true">
      <div className="cube">
        <span className="cube-face front" />
        <span className="cube-face back" />
        <span className="cube-face right" />
        <span className="cube-face left" />
        <span className="cube-face top" />
        <span className="cube-face bottom" />
      </div>
      <div className="cube-shadow" />
    </div>
  )
}
