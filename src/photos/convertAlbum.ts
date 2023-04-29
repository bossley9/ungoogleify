export async function ConvertAlbum(albumDir: string, outputDir: string) {
  const albumName = albumDir.replace(/^.+\//, '')
  console.log(
    `%cConverting album ${albumName}`,
    'color: cyan',
  )

  for (const fileEntry of Deno.readDirSync(albumDir)) {
    if (!fileEntry.isFile || fileEntry.name.endsWith('.json')) {
      continue
    }

    const imgFilename = fileEntry.name.replace(/^.+\//, '')
    const metaFilename = imgFilename + '.json'

    try {
      await Deno.stat(metaFilename)
      // TODO
    } catch {
      // metadata does not exist for image
      // TODO
    }
  }
}
