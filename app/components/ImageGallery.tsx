'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ImageGallery = () => {
    const [images, setImages] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const loadingRef = useRef<HTMLDivElement>(null);
    const { ref: inViewRef, inView } = useInView({
        threshold: 0.1,
        triggerOnce: false,
    });

    const fetchImages = useCallback(async (page: number) => {
        if (loading) return;
        
        setLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            const newImages = Array.from({ length: 16 }, (_, i) => 
                `https://picsum.photos/304/304?random=${page * 16 + i}`
            );
            setImages(prev => [...prev, ...newImages]);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    useEffect(() => {
        if (inView && !loading) {
            setPage(prev => prev + 1);
        }
    }, [inView, loading]);

    useEffect(() => {
        fetchImages(page);
    }, [page, fetchImages]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.8,
            y: 20,
            rotateX: -45
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring",
                bounce: 0.4,
                duration: 0.8
            }
        },
        hover: {
            scale: 1.05,
            rotateZ: 2,
            boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2 max-w-fit mx-auto"
        >
            {images.map((src, index) => (
                <motion.div
                    key={src + index}
                    variants={itemVariants}
                    whileHover="hover"
                    className="relative w-[304px] h-[304px] overflow-hidden rounded-lg shadow-lg shrink-0"
                >
                    <motion.img
                        src={src}
                        alt={`Image ${index + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        layoutId={`image-${index}`}
                    />
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity"
                        initial={false}
                    />
                </motion.div>
            ))}
            
            <div ref={inViewRef} className="col-span-full h-10 flex items-center justify-center">
                {loading && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex gap-2"
                    >
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                                className="w-3 h-3 bg-blue-500 rounded-full"
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default ImageGallery; 