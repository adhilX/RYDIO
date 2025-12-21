import { useEffect, useRef } from "react";

interface ParticlesProps {
    className?: string;
    quantity?: number;
    staticity?: number;
    ease?: number;
    refresh?: boolean;
}

export default function Particles({
    className = "",
    quantity = 30,
    staticity = 50,
    ease = 50,
    refresh = false,
}: ParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const context = useRef<CanvasRenderingContext2D | null>(null);
    const circles = useRef<any[]>([]);
    const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

    useEffect(() => {
        if (canvasRef.current) {
            context.current = canvasRef.current.getContext("2d");
        }
        initCanvas();
        animate();
        window.addEventListener("resize", initCanvas);

        return () => {
            window.removeEventListener("resize", initCanvas);
        };
    }, []);

    useEffect(() => {
        onMouseMove();
    }, [mouse.current.x, mouse.current.y]);

    useEffect(() => {
        initCanvas();
    }, [refresh]);

    const initCanvas = () => {
        resizeCanvas();
        drawParticles();
    };

    const onMouseMove = () => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const { w, h } = canvasSize.current;
            const x = mouse.current.x - rect.left - w / 2;
            const y = mouse.current.y - rect.top - h / 2;
            const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
            if (inside) {
                // Particles react to mouse
            }
        }
    };

    const resizeCanvas = () => {
        if (canvasContainerRef.current && canvasRef.current && context.current) {
            circles.current.length = 0;
            canvasSize.current.w = canvasContainerRef.current.offsetWidth;
            canvasSize.current.h = canvasContainerRef.current.offsetHeight;
            canvasRef.current.width = canvasSize.current.w * dpr;
            canvasRef.current.height = canvasSize.current.h * dpr;
            canvasRef.current.style.width = `${canvasSize.current.w}px`;
            canvasRef.current.style.height = `${canvasSize.current.h}px`;
            context.current.scale(dpr, dpr);
        }
    };

    const circleParams = () => {
        const x = Math.floor(Math.random() * canvasSize.current.w);
        const y = Math.floor(Math.random() * canvasSize.current.h);
        const translateX = 0;
        const translateY = 0;
        const size = Math.floor(Math.random() * 2) + 0.5;
        const alpha = 0;
        const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
        const dx = (Math.random() - 0.5) * 0.2;
        const dy = (Math.random() - 0.5) * 0.2;
        const magnetism = 0.1 + Math.random() * 4;
        return {
            x,
            y,
            translateX,
            translateY,
            size,
            alpha,
            targetAlpha,
            dx,
            dy,
            magnetism,
        };
    };

    const drawParticles = () => {
        clearContext();
        const particleCount = quantity;
        for (let i = 0; i < particleCount; i++) {
            const circle = circleParams();
            circles.current.push(circle);
        }
    };

    const clearContext = () => {
        if (context.current) {
            context.current.clearRect(
                0,
                0,
                canvasSize.current.w,
                canvasSize.current.h
            );
        }
    };

    const drawCircle = (circle: any, update = false) => {
        if (context.current) {
            const { x, y, translateX, translateY, size, alpha } = circle;
            context.current.translate(translateX, translateY);
            context.current.beginPath();
            context.current.arc(x, y, size, 0, 2 * Math.PI);
            context.current.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            context.current.fill();
            context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

            if (!update) {
                circles.current.push(circle);
            }
        }
    };

    const animate = () => {
        clearContext();
        circles.current.forEach((circle: any, i: number) => {
            // Handle the alpha fade in
            const edge = [
                circle.x + circle.translateX - circle.size, // distance from left edge
                canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
                circle.y + circle.translateY - circle.size, // distance from top edge
                canvasSize.current.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
            ];
            const closestEdge = edge.reduce((a, b) => Math.min(a, b));
            const remapClosestEdge = parseFloat(
                remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
            );
            if (remapClosestEdge > 1) {
                circle.alpha += 0.02;
                if (circle.alpha > circle.targetAlpha) {
                    circle.alpha = circle.targetAlpha;
                }
            } else {
                circle.alpha = circle.targetAlpha * remapClosestEdge;
            }

            // Movement
            circle.x += circle.dx;
            circle.y += circle.dy;

            // Horizontal wrapping
            if (circle.x < -10) circle.x = canvasSize.current.w + 10;
            if (circle.x > canvasSize.current.w + 10) circle.x = -10;

            // Vertical wrapping (optional, or stick to edges)
            if (circle.y < -10) circle.y = canvasSize.current.h + 10;
            if (circle.y > canvasSize.current.h + 10) circle.y = -10;

            // Mouse interaction
            const { w, h } = canvasSize.current;
            const x = mouse.current.x - w / 2; // relative to center
            const y = mouse.current.y - h / 2;

            // Simple parallax based on mouse
            // (Simplified for performance found in the request context)
            // const rect = canvasContainerRef.current?.getBoundingClientRect();
            // const mouseX = (mouse.current.x - (rect?.left || 0));
            // const mouseY = (mouse.current.y - (rect?.top || 0));

            // circle.translateX = (mouseX - w/2) / (staticity * circle.magnetism);
            // circle.translateY = (mouseY - h/2) / (staticity * circle.magnetism);

            // For now, simpler consistent movement
            circle.translateX += ((mouse.current.x / w) * 20 - circle.translateX) / ease;
            circle.translateY += ((mouse.current.y / h) * 20 - circle.translateY) / ease;

            drawCircle(circle, true);
        });
        window.requestAnimationFrame(animate);
    };

    const remapValue = (
        value: number,
        start1: number,
        end1: number,
        start2: number,
        end2: number
    ): number => {
        const remapped =
            ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
        return remapped > 0 ? remapped : 0;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        // Just update reference, animation loop handles the rest
        if (canvasContainerRef.current) {
            const rect = canvasContainerRef.current.getBoundingClientRect();
            mouse.current.x = e.clientX - rect.left;
            mouse.current.y = e.clientY - rect.top;
        }
    };

    return (
        <div
            className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
            ref={canvasContainerRef}
            onMouseMove={handleMouseMove}
        >
            <canvas ref={canvasRef} />
        </div>
    );
}
