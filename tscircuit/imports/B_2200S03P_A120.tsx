import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"]
} as const

export const B_2200S03P_A120 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C146690"
  ]
}}
      manufacturerPartNumber="B_2200S03P_A120"
      footprint={<footprint>
        <platedhole  portHints={["pin3"]} pcbX="2.54mm" pcbY="0mm" outerDiameter="1.5748mm" holeDiameter="1.0200132mm" shape="circle" />
<platedhole  portHints={["pin2"]} pcbX="0mm" pcbY="0mm" outerDiameter="1.5748mm" holeDiameter="1.0200132mm" shape="circle" />
<platedhole  portHints={["pin1"]} pcbX="-2.54mm" pcbY="0mm" outerDiameter="1.5748mm" holeDiameter="1.0200132mm" shape="circle" />
<silkscreenpath route={[{"x":-1.2699999999999818,"y":1.2499848},{"x":-1.2699999999999818,"y":-1.2499848000000071}]} />
<silkscreenpath route={[{"x":-4.059986800000047,"y":-1.2499848000000071},{"x":4.05998679999999,"y":-1.2499848000000071}]} />
<silkscreenpath route={[{"x":-4.059986800000047,"y":1.2499848},{"x":-4.059986800000047,"y":-1.2499848000000071}]} />
<silkscreenpath route={[{"x":4.05998679999999,"y":1.2499848},{"x":-4.059986800000047,"y":1.2499848}]} />
<silkscreenpath route={[{"x":4.05998679999999,"y":-1.2499848000000071},{"x":4.05998679999999,"y":1.2499848}]} />
<silkscreentext text="{NAME}" pcbX="-0.0127mm" pcbY="2.27mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-4.339399999999955,"y":1.519999999999989},{"x":4.314000000000021,"y":1.519999999999989},{"x":4.314000000000021,"y":-1.5200000000000031},{"x":-4.339399999999955,"y":-1.5200000000000031},{"x":-4.339399999999955,"y":1.519999999999989}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C146690.obj?uuid=1258c40de7594e919cd6d17be43291aa",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C146690.step?uuid=1258c40de7594e919cd6d17be43291aa",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: -2.5399872999999866, y: 0, z: -0.000005999999999950489 },
      }}
      {...props}
    />
  )
}