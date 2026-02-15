import { AnimatedText } from './AnimatedText'

export const BulletList: React.FC<{
  items: string[]
  startDelay: number
}> = ({ items, startDelay }) => {
  return (
    <div style={{ marginTop: 32 }}>
      {items.map((item, i) => (
        <AnimatedText
          key={i}
          text={`\u2022  ${item}`}
          delay={startDelay + i * 12}
          style={{
            fontSize: 30,
            color: '#e0e0ff',
            marginBottom: 16,
            fontWeight: 500,
          }}
        />
      ))}
    </div>
  )
}
