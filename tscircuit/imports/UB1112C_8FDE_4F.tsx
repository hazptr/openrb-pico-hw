import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["U-VCC"],
  pin2: ["U-D_NEG"],
  pin3: ["U-D_POS"],
  pin4: ["U-GND"],
  pin5: ["D-VCC"],
  pin6: ["D-D_NEG"],
  pin7: ["D-D_POS"],
  pin8: ["D-GND"],
  pin9: ["SHELL1"],
  pin10: ["SHELL2"],
  pin11: ["SHELL3"],
  pin12: ["SHELL4"]
} as const

export const UB1112C_8FDE_4F = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C2761534"
  ]
}}
      manufacturerPartNumber="UB1112C_8FDE_4F"
      footprint={<footprint>
        <platedhole  portHints={["pin1"]} pcbX="-3.499866mm" pcbY="2.489962mm" outerDiameter="1.524mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin2"]} pcbX="-0.999998mm" pcbY="2.489962mm" outerDiameter="1.524mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin3"]} pcbX="0.999998mm" pcbY="2.489962mm" outerDiameter="1.524mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin4"]} pcbX="3.50012mm" pcbY="2.489962mm" outerDiameter="1.524mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin5"]} pcbX="-3.499866mm" pcbY="-0.130048mm" outerDiameter="1.524mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin6"]} pcbX="-0.999998mm" pcbY="-0.130048mm" outerDiameter="1.524mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin7"]} pcbX="0.999998mm" pcbY="-0.130048mm" outerDiameter="1.524mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin8"]} pcbX="3.50012mm" pcbY="-0.130048mm" outerDiameter="1.524mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin9"]} pcbX="-6.569964mm" pcbY="2.839974mm" outerDiameter="2.999994mm" holeDiameter="2.3000208mm" shape="circle" />
<platedhole  portHints={["pin10"]} pcbX="6.569964mm" pcbY="2.839974mm" outerDiameter="2.999994mm" holeDiameter="2.3000208mm" shape="circle" />
<platedhole  portHints={["pin11"]} pcbX="-6.569964mm" pcbY="-2.839974mm" outerDiameter="2.999994mm" holeDiameter="2.3000208mm" shape="circle" />
<platedhole  portHints={["pin12"]} pcbX="6.569964mm" pcbY="-2.839974mm" outerDiameter="2.999994mm" holeDiameter="2.3000208mm" shape="circle" />
<silkscreenpath route={[{"x":5.6710325999999895,"y":4.318025399999897},{"x":-5.6710325999999895,"y":4.318025399999897}]} />
<silkscreenpath route={[{"x":6.500012399999832,"y":-1.110259400000018},{"x":6.500012399999832,"y":1.1103101999998444}]} />
<silkscreenpath route={[{"x":6.500012399999832,"y":-13.11996360000012},{"x":6.500012399999832,"y":-4.569688600000177}]} />
<silkscreenpath route={[{"x":-6.500012399999946,"y":-1.110259400000018},{"x":-6.500012399999946,"y":1.1103101999998444}]} />
<silkscreenpath route={[{"x":-6.500012399999946,"y":-13.11996360000012},{"x":-6.500012399999946,"y":-4.569688600000177}]} />
<silkscreenpath route={[{"x":6.500012399999832,"y":-13.11996360000012},{"x":-6.500012399999946,"y":-13.11996360000012}]} />
<silkscreentext text="{NAME}" pcbX="-0.0127mm" pcbY="5.475226mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-8.377999999999929,"y":4.725226000000021},{"x":8.352599999999939,"y":4.725226000000021},{"x":8.352599999999939,"y":-13.503974000000085},{"x":-8.377999999999929,"y":-13.503974000000085},{"x":-8.377999999999929,"y":4.725226000000021}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2761534.obj?uuid=e66d14c945ed42cdb8269d6cfb6c30ce",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2761534.step?uuid=e66d14c945ed42cdb8269d6cfb6c30ce",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 4.199965900000029, z: -4.1621384 },
      }}
      {...props}
    />
  )
}