import { hexlify } from "ethers/lib/utils"
import { File } from "nft.storage"
import { loadTexture } from "./canvas"
import {
  checkDirectory,
  fileSync,
  saveDirectory,
  saveMetadata,
  savePicture,
} from "./files"
import drawRandomNFT, { allAttributes } from "./NFT"
import tiles from "./tiles.json"
import { MetaData } from "./types"

const allNFT: File[] = []
const allMapData: {
  color: number
  id: number
  phi: number
  theta: number
  lat: number
  lng: number
}[] = []

// upload to IPFS
const online = false

const main = async () => {
  checkDirectory("../dist/images")
  checkDirectory("../dist/metadata")
  // generate 100 tile map and save to file
  for (let i = 0; i < 100; i++) {
    const { canvas, tileMap, color, attributes } = drawRandomNFT(
      // [ "Grass", "Snow", "Water", "Sand" ],
      [60, 20, 15, 5],
      //["normal", "effect", "unbuild", "tree", "charcoal", "iron", "gold", "crystal", "diamond"],
      [30, 20, 20, 10, 8, 5, 3.5, 2.5, 1]
      //30 + 20 + 20 + 10 + 8 + 5 + 3.5 + 2.5 + 1 = 100%
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
      const description = `This nft (${id}/10,000) land in the Smart World Globe (lat:${mapData.lat}, lng:${mapData.lng}), you can use it to build your own world.`

      const metadata: MetaData = {
        name,
        external_url,
        description,
        image,
        hashData,
        tileMap: new Array(...tileMap),
        mapData,
        attributes,
      }

      allMapData[i] = mapData
      allNFT.push(await saveMetadata(metadata, i))
    } catch (err) {
      console.log("url: ", err)
    }
  }

  const ipfs = await saveDirectory(allNFT, allAttributes, online)

  fileSync(allMapData)

  console.log("allNFT", ipfs)
}

loadTexture("./src/Texture.png").then(() => main())
