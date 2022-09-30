import { createCanvas, Image, loadImage } from "@napi-rs/canvas"
import { selectRandom } from "./utile"

let img: Image

export const loadTexture = async (path: string) => {
  await loadImage(path).then(async (image) => {
    img = image
  })
}

export const tileHeight = 64,
  tileWidth = 130,
  tileNumber = 4,
  texWidth = 130,
  texHeight = 230,
  rows = 9,
  width = tileWidth * tileNumber,
  height = tileWidth * tileNumber,
  canvas = createCanvas(width, height),
  ctx = canvas.getContext("2d")

ctx.translate(width / 2, tileHeight * 2.5)

// generate random tile map
export const generateTileMap = (typeChance: number[], tileChance: number[]) => {
  const randomType = typeChance.reduce(
    (acc, cur, index) => (selectRandom(cur) ? index : acc),
    0
  )

  const newTileMap = new Uint8Array(tileNumber * tileNumber)

  for (let i = 0; i < tileNumber * tileNumber; i++) {
    const randomIndex = tileChance.findIndex((cur) => selectRandom(cur))
    const randomTile = randomIndex > 0 ? randomIndex : 0

    const isUnique = randomTile !== 0 && randomTile !== 2

    const tile = randomTile * rows + randomType

    newTileMap[i] = isUnique && newTileMap.includes(tile) ? randomType : tile
  }
  return newTileMap
}

export const drawFromMap = (tileMap: Uint8Array) => {
  clear()

  tileMap.forEach((t: number, i: number) => {
    const x = Math.trunc(i / tileNumber)
    const y = Math.trunc(i % tileNumber)
    const row = Math.trunc(t / rows)
    const col = Math.trunc(t % rows)
    drawTile(x, y, row, col)
  })
  return canvas
}

const clear = () => {
  ctx.clearRect(-width, -height, width * 2, height * 2)
}

const drawTile = (x: number, y: number, row: number, col: number) => {
  ctx.save()
  ctx.translate(((y - x) * tileWidth) / 2, ((x + y) * tileHeight) / 2)
  ctx.drawImage(
    img,
    row * texWidth,
    col * texHeight,
    texWidth,
    texHeight,
    -tileHeight,
    -tileWidth,
    texWidth,
    texHeight
  )
  ctx.restore()
  return canvas
}
