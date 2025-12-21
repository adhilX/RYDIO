import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface BlurTextProps {
    text: string;
    className?: string;
    variant?: {
        hidden: { filter: string; opacity: number; y: number };
        visible: { filter: string; opacity: number; y: number };
    };
    duration?: number;
    delayStep?: number;
}

const BlurText = ({
    text = '',
    className = '',
    variant = {
        hidden: { filter: 'blur(10px)', opacity: 0, y: -20 },
        visible: { filter: 'blur(0px)', opacity: 1, y: 0 },
    },
    duration = 0.4,
    delayStep = 0.05,
}: BlurTextProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    // Split text by characters but keep spaces
    // Actually, standard BlurText usually splits by words or characters. 
    // Let's do characters for that smooth cinematic text feel.

    // We need to preserve spaces.
    const letters = Array.from(text);

    const container = {
        hidden: {},
        visible: {
            transition: { staggerChildren: delayStep },
        },
    };

    const child = {
        hidden: variant.hidden,
        visible: {
            ...variant.visible,
            transition: { duration },
        },
    };

    return (
        <motion.h2
            ref={ref}
            className={`flex flex-wrap ${className}`}
            variants={container}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
        >
            {letters.map((letter, index) => (
                <motion.span key={index} variants={child} className="inline-block">
                    {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
            ))}
        </motion.h2>
    );
};

export default BlurText;
