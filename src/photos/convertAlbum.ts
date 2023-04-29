import { Slugify } from '@/utils/slugify.ts'

type ImageMetadata = {
  photoTakenTime?: {
    formatted?: string
  }
} | undefined

export async function ConvertAlbum(albumDir: string, outputDir: string) {
  const albumName = albumDir.replace(/^.+\//, '')
  const unknownDir = outputDir + '/Unknown'
  console.log(
    `%cConverting album ${albumName}`,
    'color: cyan',
  )

  for (const fileEntry of Deno.readDirSync(albumDir)) {
    if (!fileEntry.isFile || fileEntry.name.endsWith('.json')) {
      continue
    }

    try {
      // TODO parse edited files and suppress unedited variants
      const metaFilename = fileEntry.name + '.json'
      const metadataFile = albumDir + '/' + metaFilename
      await Deno.stat(metadataFile)
      const metadata: ImageMetadata = JSON.parse(
        await Deno.readTextFile(metadataFile),
      )

      const timestamp = metadata?.photoTakenTime?.formatted
      if (!timestamp) {
        throw new Error('invalid photo timestamp')
      }

      const date = new Date(timestamp)
      if (!(date instanceof Date && !isNaN(date.valueOf()))) {
        throw new Error('invalid photo timestamp')
      }

      const year = date.toLocaleDateString('en', { year: 'numeric' })
      const month = date.toLocaleDateString('en', { month: '2-digit' })
      const formattedDate = date.toISOString().substring(0, 19) + 'Z' // remove milliseconds

      const dateDir = outputDir + '/' + year + '/' + month
      await Deno.mkdir(dateDir, { recursive: true })

      let fileExt = fileEntry.name.replace(/^.+\./, '').toLocaleLowerCase()
      if (fileExt === 'jpeg') {
        fileExt = 'jpg'
      }

      const inFile = albumDir + '/' + fileEntry.name
      const outFile = dateDir + '/' + formattedDate + '.' + fileExt

      Deno.copyFile(inFile, outFile)
    } catch {
      // metadata does not exist for image
      await Deno.mkdir(unknownDir, { recursive: true })

      const formattedAlbumName = Slugify(albumName)
      if (!formattedAlbumName) {
        console.log('invalid formatted album name. Comes from', albumName)
      } else {
        Deno.copyFile(
          albumDir + '/' + fileEntry.name,
          unknownDir + '/' + Slugify(albumName) + '-' + fileEntry.name,
        )
      }
    }
  }
}
