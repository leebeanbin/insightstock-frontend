/**
 * 토스 스타일 애니메이션 프리셋
 * 부드럽고 자연스러운 애니메이션 설정
 */

import { Variants, Transition } from 'framer-motion';

/**
 * 토스 스타일 Spring 전환 설정
 * 부드럽고 자연스러운 움직임
 */
export const tossSpring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

/**
 * 빠른 Spring 전환 (버튼 클릭 등)
 */
export const quickSpring: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
  mass: 0.5,
};

/**
 * 부드러운 Spring 전환 (페이지 전환 등)
 */
export const smoothSpring: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
  mass: 1,
};

/**
 * Fade In 애니메이션
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Fade In Up 애니메이션 (아래에서 위로)
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: tossSpring,
  },
};

/**
 * Fade In Down 애니메이션 (위에서 아래로)
 */
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: tossSpring,
  },
};

/**
 * Scale In 애니메이션
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: tossSpring,
  },
};

/**
 * Slide In Right 애니메이션
 */
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: tossSpring,
  },
};

/**
 * Slide In Left 애니메이션
 */
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: tossSpring,
  },
};

/**
 * Stagger Children 애니메이션 (리스트 아이템용)
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

/**
 * 버튼 클릭 피드백 애니메이션
 */
export const buttonTap = {
  scale: 0.96,
  transition: quickSpring,
};

/**
 * 호버 애니메이션
 */
export const hoverScale = {
  scale: 1.02,
  transition: quickSpring,
};

/**
 * 모달 애니메이션
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: smoothSpring,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

/**
 * 오버레이 애니메이션
 */
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1],
    },
  },
};

/**
 * 리스트 아이템 애니메이션
 */
export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: tossSpring,
  },
};

/**
 * 숫자 카운트업 애니메이션 (주가 등)
 */
export const numberVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: quickSpring,
  },
};

