import images from 'images';
import { program } from 'commander';

const combine = (baseFile, overlayFile, outFile, size) => {
    const overlaySize = Math.max(200, size / 4)
    images(baseFile)
        .size(size)
        .draw(images(overlayFile).size(overlaySize), size - overlaySize - 20, size - overlaySize - 20)
        .save(outFile, { quality: 50 })
}

program
    .requiredOption('--qr <path_to_qr_code>', 'path to the QR code to overlay')
    .requiredOption('--onto <path_to_base_image>', 'path to the image to overlay the QR code on')
    .option('--size <pixels>', 'set the size of the (square) output image in pixels', 800)
    .argument('<string>', 'path to write the output to')
    .action((outFile, opts) => {
        console.log('outFile', outFile)
        console.log(opts)
        const { qr, onto, size } = opts
        combine(onto, qr, outFile, parseInt(size))
    })

program.parse();