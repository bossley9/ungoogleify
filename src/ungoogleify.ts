import { assert } from 'std/testing/asserts.ts'
import { ConvertPhotos } from '@/photos/convertPhotos.ts'

export async function Ungoogleify(inputDir: string, outputDir: string) {
	console.log(
		`%cUngoogleifying ${inputDir} into ${outputDir}.`,
		'color: cyan',
	)
	await Deno.mkdir(outputDir, { recursive: true })

	try {
		const photoDir = inputDir + '/Google\ Photos'
		const finfo = await Deno.stat(photoDir)
		assert(finfo.isDirectory)
		ConvertPhotos(photoDir, outputDir + '/Photos')
	} catch {
		// silently ignore
	}
}
