export function cleanPrompt(str: string) {
  return str
    .split(`\n`)
    .filter((line) => line)
    .map((line) => line.trim())
    .join('\n');
}

export function extractJSON(str: string) {
  try {
    return JSON.parse(str);
  } catch (error) {
    return null;
  }
}
