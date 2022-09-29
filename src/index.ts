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
import tiles from "./tiles.json"
import { MetaData } from "./types"

const allNFT: File[] = []
const allMeta: Partial<MetaData>[] = []

// upload to IPFS
const online = false

loadImage("./src/Texture.png").then(async (image) => {
  checkDirectory("../dist/images")
  checkDirectory("../dist/metadata")
  // generate 100 tile map and save to file
  for (let i = 0; i < 10000; i++) {
    const { canvas, tileMap, color, attributes } = drawRandomNFT(
      image,
      [60, 20, 15, 5],
      [30, 20, 20, 10, 10, 7, 5, 2.5, 1]
    )
    try {
      const url = await savePicture(canvas, i, online)

      console.log(i, url)

      const image = `ipfs://${url}`
      const hashData = hexlify(tileMap)
      const mapData = { ...tiles[i], color }
      const id = mapData.id
      const name = `SmartLand #${id}`
      const external_url = `https://smartworld.app/land?tile=${id}`
      const description = `This nft is (${id}/10,000) land in the smart world Globe (lat=${mapData.lat}, lng=${mapData.lng}), you can use it to build your own world.`

      const metadata: MetaData = {
        name,
        external_url,
        description,
        image,
        hashData,
        tileMap,
        mapData,
        attributes,
      }

      allMeta[i] = {
        name,
        image,
        mapData,
        tileMap,
        attributes,
      }
      allNFT.push(await saveMetadata(metadata, i))
    } catch (err) {
      console.log("url: ", err)
    }
  }

  const ipfs = await saveDirectory(allNFT, allData, online)

  fileSync(allMeta)

  console.log("allNFT", ipfs)
})
