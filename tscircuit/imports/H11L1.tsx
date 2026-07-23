import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["AN"],
  pin2: ["CAT"],
  pin3: ["NC"],
  pin4: ["VO"],
  pin5: ["GND"],
  pin6: ["VCC"]
} as const

export const H11L1 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C78588"
  ]
}}
      manufacturerPartNumber="H11L1"
      footprint={<footprint>
        <platedhole  portHints={["pin1"]} pcbX="-2.54mm" pcbY="-3.81mm" outerDiameter="1.7999964mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin2"]} pcbX="0mm" pcbY="-3.81mm" outerDiameter="1.7999964mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin3"]} pcbX="2.54mm" pcbY="-3.81mm" outerDiameter="1.7999964mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin6"]} pcbX="-2.54mm" pcbY="3.81mm" outerDiameter="1.7999964mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin5"]} pcbX="0mm" pcbY="3.81mm" outerDiameter="1.7999964mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin4"]} pcbX="2.54mm" pcbY="3.81mm" outerDiameter="1.7999964mm" holeDiameter="0.999998mm" shape="circle" />
<silkscreenpath route={[{"x":-4.5237399999999965,"y":0.634999999999998},{"x":-4.5237399999999965,"y":2.6492199999999997},{"x":4.500880000000009,"y":2.6492199999999997},{"x":4.500880000000009,"y":-2.649220000000007},{"x":-4.5237399999999965,"y":-2.649220000000007},{"x":-4.5237399999999965,"y":-0.634999999999998}]} />
<silkscreenpath route={[{"x":-4.5237399999999965,"y":-0.634999999999998},{"x":-4.766743979551826,"y":-0.5866635031446634},{"x":-4.97275280605345,"y":-0.4490128060534673},{"x":-5.11040350314466,"y":-0.24300397955184394},{"x":-5.1587399999999946,"y":-7.105427357601002e-15},{"x":-5.11040350314466,"y":0.24300397955182973},{"x":-4.972752806053464,"y":0.44901280605344596},{"x":-4.766743979551826,"y":0.5866635031446634},{"x":-4.5237399999999965,"y":0.634999999999998}]} />
<silkscreenpath route={[{"x":-3.799839999999989,"y":-1.6992599999999953},{"x":-3.8890483594299354,"y":-1.9101943786078976},{"x":-4.101098658499424,"y":-1.9967167117677462},{"x":-4.312408799829157,"y":-1.9084021170390741},{"x":-4.399828047119115,"y":-1.6967200000000133},{"x":-4.312408799829171,"y":-1.4850378829609525},{"x":-4.101098658499438,"y":-1.3967232882322662},{"x":-3.8890483594299354,"y":-1.4832456213921077},{"x":-3.799839999999989,"y":-1.694180000000003}]} />
<silkscreenpath route={[{"x":-3.970019999999991,"y":-3.7998400000000103},{"x":-4.120662029703922,"y":-3.948581055997664},{"x":-4.270039424014726,"y":-3.798569999999998},{"x":-4.120662029703922,"y":-3.648558944002339},{"x":-3.970019999999991,"y":-3.7973}]} />
<silkscreentext text="{NAME}" pcbX="-0.0127mm" pcbY="5.7498mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-4.7712,"y":4.999799999999993},{"x":4.745800000000003,"y":4.999799999999993},{"x":4.745800000000003,"y":-5.025200000000005},{"x":-4.7712,"y":-5.025200000000005},{"x":-4.7712,"y":4.999799999999993}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C78588.obj?uuid=d28c5ad6138a4beabaac2aac7fd4a062",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C78588.step?uuid=d28c5ad6138a4beabaac2aac7fd4a062",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: -0.000006999999999646178 },
      }}
      {...props}
    />
  )
}