import { ConvertAlbum } from '@/photos/convertAlbum.ts'

export async function ConvertPhotos(inputDir: string, outputDir: string) {
  console.log(
    `%cConverting photos from ${inputDir} into ${outputDir}.`,
    'color: cyan',
  )
  try {
    await Deno.remove(outputDir, { recursive: true })
  } catch {
    // silently ignore if old output does not exist
  }
  await Deno.mkdir(outputDir, { recursive: true })

  for (const dirEntry of Deno.readDirSync(inputDir)) {
    if (!dirEntry.isDirectory || isMetaAlbum(dirEntry.name)) {
      continue
    }

    ConvertAlbum(inputDir + '/' + dirEntry.name, outputDir)
  }
}

function isMetaAlbum(name: string): boolean {
  return name === 'Trash' || name === 'Failed\ Videos' ||
    name.startsWith('Print Order ')
}
