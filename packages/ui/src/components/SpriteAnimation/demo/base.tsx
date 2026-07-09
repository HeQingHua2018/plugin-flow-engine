/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年04月24日 11:35:07
 * @example: 调用示例
 */
import { SpriteAnimation } from '@chloehe/logic-engine-ui';
import spriteImageUrl from '../../../assets/sprites.png';

export default function base() {
  const config = {
    spriteImageUrl: spriteImageUrl,
    frameCount: 26,
    frameWidth: 200,
    frameHeight: 200,
  };
  return <SpriteAnimation {...config} />;
}
