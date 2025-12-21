import { motion } from "framer-motion";

export const AuroraBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden bg-black z-0 pointer-events-none">
            {/* Base Gradient */}
            <div
                className="absolute inset-0 opacity-50"
                style={{
                    background: "radial-gradient(circle at 50% 50%, #111 0%, #000 100%)"
                }}
            />

            {/* Aurora Orb 1 - Top Left - Cool White/Blue hue */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-white/5 rounded-full blur-[120px]"
            />

            {/* Aurora Orb 2 - Bottom Right - Warm Gray hue */}
            <motion.div
                animate={{
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-gray-500/10 rounded-full blur-[100px]"
            />

            {/* Aurora Orb 3 - Middle - Subtle Accent */}
            <motion.div
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, 100, -50, 0],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5
                }}
                className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] bg-white/5 rounded-full blur-[150px]"
            />

            {/* Noise Overlay for texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};

export default AuroraBackground;
