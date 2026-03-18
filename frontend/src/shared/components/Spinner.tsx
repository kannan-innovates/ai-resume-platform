export default function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: '3px solid rgba(255, 255, 255, 0.1)',
        borderTop: '3px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite',
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    />
  )
}