export function processMermaidSvg(svgString: string): string {
  let svg = svgString

  // Make SVG responsive
  svg = svg.replace(/width="[\d.]+"/, 'width="100%"')
  svg = svg.replace(/height="[\d.]+"/, 'height="100%"')

  // Force transparent background
  svg = svg.replace(
    /style="[^"]*background:[^;"]*;?/g,
    (match) =>
      match.replace(/background:[^;"]*;?/, 'background:transparent;'),
  )

  return svg
}
