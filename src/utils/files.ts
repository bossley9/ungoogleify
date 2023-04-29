export async function CopyAvoidCollisions(inFile: string, outFile: string) {
  try {
    await Deno.stat(outFile)

    // if images are found in multiple albums, they are duplicated
    // so we can ignore files that already exist byte for byte
    if (await areFilesIdentical(inFile, outFile)) {
      return
    }

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

async function areFilesIdentical(
  filePath1: string,
  filePath2: string,
): Promise<boolean> {
  const [file1, file2] = await Promise.all([
    Deno.readFile(filePath1),
    Deno.readFile(filePath2),
  ])

  if (file1.length !== file2.length) {
    return false
  }

  let isIdentical = true
  let i = 0
  while (i < file1.length) {
    if (file1[i] !== file2[i]) {
      isIdentical = false
      break
    }
    i++
  }

  return isIdentical
}
