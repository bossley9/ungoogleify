import { assert } from 'std/testing/asserts.ts'
import { Slugify } from '@/utils/slugify.ts'
import { CopyAvoidCollisions } from '@/utils/files.ts'

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
    if (
      !fileEntry.isFile || fileEntry.name.endsWith('.json') ||
      await hasEditedVariant(albumDir + '/' + fileEntry.name)
    ) {
      continue
    }

    const inFile = albumDir + '/' + fileEntry.name

    try {
      const metadata = await getMetadata(inFile)

      const timestamp = metadata?.photoTakenTime?.formatted
      if (!timestamp) {
        throw new Error('invalid photo timestamp')
      }

      const date = new Date(timestamp)
      if (!(date instanceof Date && !isNaN(date.valueOf()))) {
        throw new Error('invalid photo timestamp')
      }

      const year = date.toLocaleDateString('en', {
        timeZone: 'UTC',
        year: 'numeric',
      })
      const month = date.toLocaleDateString('en', {
        timeZone: 'UTC',
        month: '2-digit',
      })
      const formattedDate = date.toISOString().substring(0, 19) + 'Z' // remove milliseconds

      const dateDir = outputDir + '/' + year + '/' + month
      await Deno.mkdir(dateDir, { recursive: true })

      let fileExt = fileEntry.name.replace(/^.+\./, '').toLocaleLowerCase()
      if (fileExt === 'jpeg') {
        fileExt = 'jpg'
      }

      const outFile = dateDir + '/' + formattedDate + '.' + fileExt

      CopyAvoidCollisions(inFile, outFile)
    } catch {
      // metadata does not exist for image
      await Deno.mkdir(unknownDir, { recursive: true })

      CopyAvoidCollisions(
        albumDir + '/' + fileEntry.name,
        unknownDir + '/' + Slugify(albumName) + '-' +
          fileEntry.name.replace(/\s+/g, '-'),
      )
    }
  }
}

async function hasEditedVariant(file: string) {
  const editedFile = file.replace(/\..+$/, '-edited$&')

  try {
    const finfo = await Deno.stat(editedFile)
    assert(finfo.isFile)
    return true
  } catch {
    return false
  }
}

async function getMetadata(file: string): Promise<ImageMetadata> {
  try {
    const metadataFile = file + '.json'
    await Deno.stat(metadataFile)
    return JSON.parse(
      await Deno.readTextFile(metadataFile),
    )
  } catch {
    if (!file.includes('-edited.')) {
      throw new Error('no metadata found.')
    }
    const uneditedMetadataFile = file.replace(/-edited\./, '.') + '.json'

    await Deno.stat(uneditedMetadataFile)
    return JSON.parse(
      await Deno.readTextFile(uneditedMetadataFile),
    )
  }
}
