import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"]
} as const

export const ASMD0603_020 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      symbol={
        <symbol>
          <schematicpath points={[{"x":-5.08,"y":0},{"x":-2.54,"y":0}]} strokeWidth={0.254} strokeColor="#880000" />
          <schematicpath svgPath="M -2.54 0 A 1.27 1.27 0 1 0 0 0" strokeWidth={0.254} strokeColor="#880000" />
          <schematicpath svgPath="M 2.54 0 A 1.27 1.27 0 1 0 0 0" strokeWidth={0.254} strokeColor="#880000" />
          <schematicpath points={[{"x":2.54,"y":0},{"x":5.08,"y":0}]} strokeWidth={0.254} strokeColor="#880000" />
          <port name="pin1" pinNumber={1} aliases={["1"]} direction="left" schX={-7.62} schY={0} schStemLength={2.54} />
          <port name="pin2" pinNumber={2} aliases={["2"]} direction="right" schX={7.62} schY={0} schStemLength={2.54} />
        </symbol>
      }
      supplierPartNumbers={{
  "jlcpcb": [
    "C135321"
  ]
}}
      manufacturerPartNumber="ASMD0603_020"
      footprint="res_p1.5067mm_pw0.8065mm_ph0.864mm"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C135321.obj?uuid=f9b4c9f684154bb3a64f336476a603d6",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C135321.step?uuid=f9b4c9f684154bb3a64f336476a603d6",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: -0.000012700000070253736, y: -0.000012700000070253736, z: 0 },
      }}
      {...props}
    />
  )
}