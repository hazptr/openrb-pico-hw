import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["OSC1"],
  pin2: ["GND1"],
  pin3: ["OSC2"],
  pin4: ["GND2"]
} as const

export const X322512MSB4SI = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      symbol={
        <symbol>
          <port name="pin3" pinNumber={3} aliases={["OSC2"]} direction="right" schX={7.62} schY={2.54} schStemLength={2.54} />
          <port name="pin1" pinNumber={1} aliases={["OSC1"]} direction="left" schX={-7.62} schY={-2.54} schStemLength={2.54} />
          <schematicrect schX={0} schY={0} width={10.16} height={10.16} strokeWidth={0.254} color="#880000" />
          <port name="pin2" pinNumber={2} aliases={["GND1","GND"]} direction="right" schX={7.62} schY={-2.54} schStemLength={2.54} />
          <port name="pin4" pinNumber={4} aliases={["GND2","GND"]} direction="left" schX={-7.62} schY={2.54} schStemLength={2.54} />
          <schematicpath points={[{"x":0.762,"y":1.778},{"x":0.762,"y":-1.778},{"x":-0.762,"y":-1.778},{"x":-0.762,"y":1.778},{"x":0.762,"y":1.778}]} strokeWidth={0.254} strokeColor="#880011" />
          <schematicpath points={[{"x":-1.27,"y":-1.778},{"x":-1.27,"y":1.778}]} strokeWidth={0.254} strokeColor="#880011" />
          <schematicpath points={[{"x":1.27,"y":-1.778},{"x":1.27,"y":1.778}]} strokeWidth={0.254} strokeColor="#880011" />
          <schematicpath points={[{"x":-5.08,"y":-2.54},{"x":-2.54,"y":-2.54},{"x":-2.54,"y":0},{"x":-1.524,"y":0}]} strokeWidth={0.254} strokeColor="#880011" />
          <schematicpath points={[{"x":5.08,"y":2.54},{"x":2.54,"y":2.54},{"x":2.54,"y":0},{"x":1.524,"y":0}]} strokeWidth={0.254} strokeColor="#880011" />
          <schematicpath points={[{"x":-0.762,"y":-1.778},{"x":-0.762,"y":1.778},{"x":0.762,"y":1.778},{"x":0.762,"y":-1.778}]} strokeWidth={0.254} strokeColor="#880011" />
          <schematicpath points={[{"x":1.27,"y":-1.016},{"x":1.27,"y":1.016}]} strokeWidth={0.254} strokeColor="#880011" />
          <schematicpath points={[{"x":0.762,"y":-1.778},{"x":-0.762,"y":-1.778}]} strokeWidth={0.254} strokeColor="#880011" />
          <schematicpath points={[{"x":-1.27,"y":-1.016},{"x":-1.27,"y":1.016}]} strokeWidth={0.254} strokeColor="#880011" />
        </symbol>
      }
      supplierPartNumbers={{
  "jlcpcb": [
    "C9002"
  ]
}}
      manufacturerPartNumber="X322512MSB4SI"
      footprint="crystal"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C9002.obj?uuid=02485e56ba8d4732a26526d2983fc729",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C9002.step?uuid=02485e56ba8d4732a26526d2983fc729",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: -0.000012700000070253736, z: 0 },
      }}
      {...props}
    />
  )
}