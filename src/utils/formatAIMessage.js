const formatAIMessage = (existingContent, newContent) => {
  const fullContent = existingContent + newContent
  const lines = fullContent.split('\n')
  let formattedContent = ''
  let inCodeBlock = false

  lines.forEach((line) => {
    // Check for code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
    }

    // Preserve original formatting, only add extra newline for paragraphs
    if (line.trim() === '' && !inCodeBlock) {
      formattedContent += '\n\n'
    } else {
      formattedContent += line + '\n'
    }
  })

  return formattedContent.trim()
}

export default formatAIMessage
