export function ColoredImage({ src, className, style }) {
  return <div className={`${className} image-wrapper`} style={style}>
    <div className="wrapped-image" style={{ backgroundImage: `url(${src})` }} />
    <div className="image-overlay" />
  </div>;
}
