import fs from 'node:fs'
import path from 'node:path'

const RELEVANT_RULES = [
  'animations',
  'timing',
  'transitions',
  'audio',
  'voiceover',
  'fonts',
  'text-animations',
  'sequencing',
  'compositions',
]

const SKILLS_DIR = path.resolve(
  process.cwd(),
  '.agents/skills/remotion-best-practices/rules',
)

export function loadRemotionSkills(): string {
  const sections: string[] = []

  for (const rule of RELEVANT_RULES) {
    const filePath = path.join(SKILLS_DIR, `${rule}.md`)
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      sections.push(`## ${rule}\n\n${content}`)
    } catch {
      // Skip missing files gracefully
    }
  }

  if (sections.length === 0) {
    return ''
  }

  return `\n\n# Remotion Best Practices\n\n${sections.join('\n\n---\n\n')}`
}
