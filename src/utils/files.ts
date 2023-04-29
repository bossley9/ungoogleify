export async function CopyAvoidCollisions(inFile: string, outFile: string) {
  try {
    await Deno.stat(outFile)

    const fileExt = outFile.replace(/^.+\./, '')
    const filePrefix = outFile.substring(0, outFile.length - fileExt.length - 1)

    let modifiedOutFile = ''

    const indexSuffix = filePrefix.match(/-\d+$/) ?? []
    if (indexSuffix?.[0]) {
      const currentIndex = Number(indexSuffix[0].substring(1))
      const fileNoIndexPrefix = filePrefix.substring(
        0,
        filePrefix.length - indexSuffix[0].length,
      )
      modifiedOutFile = fileNoIndexPrefix + '-' + (currentIndex + 1) +
        '.' +
        fileExt
    } else {
      modifiedOutFile = filePrefix + '-2.' + fileExt
    }

    CopyAvoidCollisions(
      inFile,
      modifiedOutFile,
    )
  } catch {
    Deno.copyFile(
      inFile,
      outFile,
    )
  }
}
