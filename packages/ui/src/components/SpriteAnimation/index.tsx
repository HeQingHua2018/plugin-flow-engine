import React, { useEffect, useRef, useState } from 'react';

// 定义SpriteAnimation组件的属性接口
export interface SpriteAnimationProps {
  /**
   * @description 图片地址
   * @type string
   */
  spriteImageUrl: string;
  /**
   * @description 总帧数
   * @type number
   */
  frameCount: number;
  /**
   * @description 每一帧图片宽度
   * @type number
   */
  frameWidth: number;
  /**
   * @description 每一帧图片高度
   * @type number
   */
  frameHeight: number;
  /**
   * @description 动画速度，控制帧更新的频率（毫秒/帧）
   * @type number
   * @default 30
   */
  animationSpeed?: number;
}

/**
 * SpriteAnimation 组件用于创建基于精灵图的动画效果。
 *
 * @param spriteImageUrl - 精灵图的URL。
 * @param frameCount - 精灵图中包含的帧数。
 * @param frameWidth - 单帧图像的宽度。
 * @param frameHeight - 单帧图像的高度。
 * @param animationSpeed - 动画速度，控制帧更新的频率（毫秒/帧）。
 * @returns 返回一个包含动画效果的div元素。
 */
const SpriteAnimation: React.FC<SpriteAnimationProps> = ({
  spriteImageUrl,
  frameCount,
  frameWidth,
  frameHeight,
  animationSpeed = 30,
}) => {
  // 当前帧数的状态，用于控制动画的播放帧
  const [currentFrame, setCurrentFrame] = useState(0);
  // 鼠标是否悬停的状态，用于触发不同的动画方向
  const [isHovered, setIsHovered] = useState(false);
  // 使用useRef来存储isHovered的引用，以便在动画函数中访问
  const isHoveredRef = useRef<boolean>(false);
  // 动画帧请求的引用，用于控制和取消动画帧
  const animationRef = useRef<number>();
  // 上一次动画帧的时间戳，用于计算帧间隔
  const lastTimestamp = useRef<number>(0);
  // 动画速度，控制帧更新的频率（毫秒/帧）
  //  const animationSpeed = props.animationSpeed ?? 30;
  /**
   * 取消动画
   *
   * 如果当前存在动画，则取消该动画并清空引用
   */
  const cancelAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  };
  /**
   * 动画函数，用于实现动画效果。
   *
   * @param timestamp 时间戳，表示当前动画帧的时间。
   */
  const animate = (timestamp: number) => {
    if (!lastTimestamp.current) lastTimestamp.current = timestamp;

    const deltaTime = timestamp - lastTimestamp.current;
    // 如果帧间隔超过设定的动画速度，则更新帧
    if (deltaTime > animationSpeed) {
      setCurrentFrame((prev) => {
        const direction = isHoveredRef.current ? 1 : -1;
        let nextFrame = prev + direction;

        // 限制帧数范围在0到frameCount-1之间
        nextFrame = Math.max(0, Math.min(nextFrame, frameCount - 1));

        // 到达边界时停止动画
        if (nextFrame === (isHoveredRef ? frameCount - 1 : 0)) {
          cancelAnimation();
        }
        return nextFrame;
      });
      lastTimestamp.current = timestamp;
    }
    // 请求下一帧动画
    animationRef.current = requestAnimationFrame(animate);
  };

  /**
   * 开始动画
   */
  const startAnimation = () => {
    if (!animationRef.current) {
      lastTimestamp.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // 组件卸载时取消动画
  useEffect(() => {
    return () => cancelAnimation();
  }, []);
  // isHovered状态更新时同步更新isHoveredRef
  useEffect(() => {
    isHoveredRef.current = isHovered; // 更新 isHoveredRef 的值
  }, [isHovered]);

  /**
   * 鼠标进入事件处理函数
   *
   * @returns 无返回值
   */
  const handleMouseEnter = () => {
    setIsHovered(true);
    cancelAnimation();
    startAnimation();
  };

  /**
   * 处理鼠标移出事件
   *
   * 将 isHovered 设置为 false，取消动画，并重新启动动画
   */
  const handleMouseLeave = () => {
    setIsHovered(false);
    cancelAnimation();
    startAnimation();
  };

  return (
    <div
      style={{
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        backgroundImage: `url(${spriteImageUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `0px ${-currentFrame * frameHeight}px`,
        border: '1px solid darkgray',
        cursor: 'pointer',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default SpriteAnimation;
