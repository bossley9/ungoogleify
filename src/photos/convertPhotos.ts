export async function ConvertPhotos(inputDir: string, outputDir: string) {
	console.log(
		`%cConverting photos from ${inputDir} into ${outputDir}.`,
		'color: cyan',
	)
	await Deno.mkdir(outputDir, { recursive: true })
}
