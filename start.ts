import { assert } from 'std/testing/asserts.ts'
import { Ungoogleify } from '@/ungoogleify.ts'

const [inputDir, outputDir] = Deno.args

if (!inputDir || !outputDir) {
  console.error(
    '%cUsage: ungoogleify [takout directory] [output directory]',
    'color: yellow',
  )
  Deno.exit(1)
}

try {
  const finfo = await Deno.stat(inputDir)
  assert(finfo.isDirectory)
} catch {
  console.error(
    '%cError: takout directory does not exist or is not a directory.',
    'color: red',
  )
}

try {
  const inDir = inputDir.replace(/\/$/, '')
  const outDir = outputDir.replace(/\/$/, '')
  Ungoogleify(inDir, outDir)
} catch (error) {
  console.error(
    '%cAn unexpected error occurred.',
    'color: red',
  )
  console.error(error)
}
