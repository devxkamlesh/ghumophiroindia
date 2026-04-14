'use client';

import * as React from 'react';
import { motion, useScroll, useTransform, HTMLMotionProps, MotionValue } from 'motion/react';
import { cn } from '@/lib/utils';

// ContainerScroll Context
interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>;
}

const ContainerScrollContext = React.createContext<ContainerScrollContextValue | undefined>(
  undefined
);

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext);
  if (!context) {
    throw new Error(
      'useContainerScrollContext must be used within a ContainerScroll Component'
    );
  }
  return context;
}

// ContainerScroll Component
const ContainerScroll = ({
  children,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
  });

  // Add overlay effect when scrolling
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const overlay = document.getElementById('scroll-overlay');
      if (overlay) {
        // Start showing overlay when scroll progress > 0.05 (images start appearing earlier)
        if (latest > 0.05) {
          overlay.style.opacity = String(Math.min((latest - 0.05) * 3, 0.7));
        } else {
          overlay.style.opacity = '0';
        }
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn('relative min-h-[120vh]', className)}
        style={{
          perspective: '1000px',
          perspectiveOrigin: 'center top',
          transformStyle: 'preserve-3d',
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
};

// ContainerSticky Component
const ContainerSticky = ({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'sticky left-0 top-0 min-h-[30rem] w-full overflow-hidden',
        className
      )}
      style={{
        perspective: '1000px',
        perspectiveOrigin: 'center top',
        transformStyle: 'preserve-3d',
        transformOrigin: '50% 50%',
        ...style,
      }}
      {...props}
    />
  );
};

// GalleryContainer Component
const GalleryContainer = ({
  children,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & HTMLMotionProps<'div'>) => {
  const { scrollYProgress } = useContainerScrollContext();
  const rotateX = useTransform(scrollYProgress, [0, 0.4], [55, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.8], [0.92, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8], [0.4, 1, 1]);

  return (
    <motion.div
      className={cn(
        'relative grid size-full grid-cols-3 gap-2 rounded-2xl',
        className
      )}
      style={{
        rotateX,
        scale,
        opacity,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        willChange: 'transform, opacity',
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// GalleryCol Component
const GalleryCol = ({
  className,
  style,
  yRange = ['0%', '-10%'],
  ...props
}: HTMLMotionProps<'div'> & { yRange?: string[] }) => {
  const { scrollYProgress } = useContainerScrollContext();
  const y = useTransform(scrollYProgress, [0.35, 1], yRange);

  return (
    <motion.div
      className={cn('relative flex w-full flex-col gap-2 ', className)}
      style={{
        y,
        willChange: 'transform',
        ...style,
      }}
      {...props}
    />
  );
};

export { ContainerScroll, ContainerSticky, GalleryContainer, GalleryCol };
