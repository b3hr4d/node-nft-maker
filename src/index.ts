import { loadImage } from "@napi-rs/canvas"
import { hexlify } from "ethers/lib/utils"
import { File } from "nft.storage"
import {
  checkDirectory,
  fileSync,
  saveDirectory,
  saveMetadata,
  savePicture,
} from "./files"
import drawRandomNFT, { allData } from "./NFT"
import { MetaData } from "./types"

const allNFT: File[] = []
const allMeta: { [key: string]: [string, string] } = {}

// upload to IPFS
const online = false

loadImage("./src/Texture.png").then(async (image) => {
  checkDirectory("../dist/images")
  checkDirectory("../dist/metadata")
  // generate 100 tile map and save to file
  for (let i = 0; i < 100; i++) {
    const { canvas, tileMap, attributes } = drawRandomNFT(
      image,
      [60, 20, 15, 5],
      [30, 20, 20, 10, 10, 7, 5, 2.5, 1]
    )
    try {
      const url = await savePicture(canvas, i, online)

      console.log(i, url)

      const image = `ipfs://${url}`
      const data = hexlify(tileMap)

      const metadata: MetaData = {
        name: `SmartLand #${i}`,
        external_url: `https://smartworld.app/nft/${i}`,
        description:
          "It leaves in the 3d Earth on the home page of the website.",
        image,
        data,
        tileMap,
        attributes,
      }

      allMeta[i] = [image, data]
      fileSync(allMeta)
      allNFT.push(await saveMetadata(metadata, i))
    } catch (err) {
      console.log("url: ", err)
    }
  }

  const ipfs = await saveDirectory(allNFT, allData, online)

  console.log("allNFT", ipfs)
})
