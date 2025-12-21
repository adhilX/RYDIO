import { motion } from "framer-motion"

// React Bits inspired Grid Background - Monochrome Edition with Beams
const GridBackground = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-neutral-950">
            {/* Base Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9811a_1px,transparent_1px),linear-gradient(to_bottom,#10b9811a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* Shooting Beams (Horizontal & Vertical) */}
            {/* <div className="absolute inset-0 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={`beam-${i}`}
                        initial={{
                            opacity: 0,
                            left: Math.random() > 0.5 ? '-10%' : `${Math.random() * 100}%`,
                            top: Math.random() > 0.5 ? `${Math.random() * 100}%` : '-10%'
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            left: [null, `${Math.random() * 120}%`], // Move horizontally
                            top: [null, `${Math.random() * 120}%`] // Move vertically
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "linear",
                        }}
                        className="absolute bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        style={{
                            width: Math.random() > 0.5 ? '40%' : '1px',
                            height: Math.random() > 0.5 ? '1px' : '40%',
                        }}
                    />
                ))}
            </div> */}

            {/* Animated Sparkles/Intersections */}
            <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={`sparkle-${i}`}
                        initial={{
                            opacity: 0,
                            scale: 0,
                        }}
                        animate={{
                            opacity: [0, 0.8, 0],
                            scale: [0, 1.5, 0],
                        }}
                        transition={{
                            duration: Math.random() * 2 + 1,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "easeInOut",
                        }}
                        className="absolute w-1 h-1 bg-green-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                        style={{
                            left: `${Math.floor(Math.random() * 100)}%`,
                            top: `${Math.floor(Math.random() * 100)}%`,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default GridBackground
