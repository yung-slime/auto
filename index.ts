import { $ } from "bun"
import { mkdir } from 'node:fs/promises';

// we're going to increase the value of y by croppedImgH
const croppedImgW = 2007, croppedImgH = 500, x = 0
let count: number = 1, y = 0

try {
    // make dir named cropped and sharp if not exist in the current dir.
    const cropped = await mkdir("cropped", { recursive: true });
    const sharp = await mkdir("sharp", { recursive: true });
} catch (err) {
    console.error(err.message);
}

async function imgProcessing(count: number, y: number) {
    // first crop the image and save it in the cropped_img dir.
    console.log(`cropping img: ${count}`)
    const { exitCode: exitCode1 } = await $`ffmpeg -probesize 50M -analyzeduration 100M -i ~/Desktop/quiz/DCBA-ELTY-RPVF-1500-MG021-MG022/DCBA-ELTY-RPVF-1500-MG022.gif -vf "crop=${croppedImgW}:${croppedImgH}:0:${y}" cropped/croppedImg${count}.gif`
    console.log(exitCode1)

    // second sharpen the image and save it in the sharpened_imgs dir.
    console.log(`sharpening img: ${count}`)
    const { exitCode: exitCode2 } = await $`ffmpeg -i cropped/croppedImg${count}.gif -vf "unsharp=5:5:1.0:5:5:0.0" sharp/sharpened${count}.png`
    console.log(exitCode2)

}
// we got to run this function till y becomes 30021.
while (y <= 30021) {
    console.log(y)
    imgProcessing(count, y).then(() => console.log(`sharpened${count}.png...`))
    count++
    y += croppedImgH
}

// third make the api call for OCR.