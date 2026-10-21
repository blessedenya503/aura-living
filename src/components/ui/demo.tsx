import { GlitchText } from "@/components/ui/animated-glitch-text"

function DefaultDemo() {
  return <GlitchText text="Glitch Effect" />
}

function CustomColorsDemo() {
  return (
    <GlitchText 
      text="Custom Colors"
      colors={{
        red: "#ff00ff",
        green: "#00ffff",
        blue: "#ffff00"
      }}
    />
  )
}

function CustomStyleDemo() {
  return (
    <GlitchText 
      text="Custom Style"
      textClassName="text-8xl font-black"
      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20"
    />
  )
}

function SmallDemo() {
  return (
    <GlitchText 
      text="Small Glitch"
      textClassName="text-2xl"
      className="min-h-[100px]"
    />
  )
}

export {
  DefaultDemo,
  CustomColorsDemo,
  CustomStyleDemo,
  SmallDemo
}
