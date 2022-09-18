import { Image } from "@napi-rs/canvas"
import { drawFromMap, generateTileMap, rows } from "./canvas"
import {
  Attr,
  Attributes,
  StandardType,
  TileAttributes,
  TileType,
  Type,
} from "./types"

export const allData: Attributes = {
  Base: 0,
  Grass: 0,
  Snow: 0,
  Water: 0,
  Sand: 0,
  Effect: 0,
  UnBuildable: 0,
  Tree: 0,
  Charcoal: 0,
  Iron: 0,
  Gold: 0,
  Crystal: 0,
  Diamond: 0,
}

export default function drawRandomNFT(
  image: Image,
  typeChane: number[],
  attrChane: number[]
) {
  const tileMap = generateTileMap(typeChane, attrChane)

  const cols = tileMap[0] % rows
  const baseType = TileType[cols] as Type

  allData[baseType]++

  const canvas = drawFromMap(image, tileMap)

  const buildable = { trait_type: "Buildable", value: 0 }
  const unBuildable = { trait_type: "UnBuildable", value: 0 }

  const attributes: StandardType[] = [
    {
      trait_type: "Base",
      value: baseType,
    },
    buildable,
    unBuildable,
  ]

  tileMap.forEach((item) => {
    const value = TileAttributes[Math.trunc(item / rows)] as Attr

    allData[value]++
    switch (value) {
      case "Base":
        buildable.value++
        break
      case "Effect":
        buildable.value++
        break
      case "UnBuildable":
        unBuildable.value++
        break
      default:
        attributes.push({ trait_type: "Resource", value })
        break
    }
  })
  return { canvas, tileMap, attributes }
}
