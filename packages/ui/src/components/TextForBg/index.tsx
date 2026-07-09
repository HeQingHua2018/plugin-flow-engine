import React from 'react';

export interface TextForBgProps {
  /**
   * @description 图片地址
   * @type string
   *
   */
  imageUrl: string;
  /**
   * @description 文本
   * @type string
   * @default 'TEXT'
   */
  text?: string;
  /**
   * @description 文本颜色
   * @type string
   * @default '#00f'
   */
  textColor?: string;
  /**
   * @description 透明度
   * @type number
   * @default 0.9
   */
  textOpacity?: number;
  /**
   * @description 文本大小
   * @type string | number | undefined
   * @default '10em'
   */
  fontSize?: string | number | undefined;
  /**
   * @description 文本粗细
   * @type string | number | undefined
   * @default 'bold'
   */
  fontWeight?: string | number | undefined;
  /**
   * @description 文本对齐方式
   * @type string | undefined
   * @default 'middle'
   */
  textAnchor?: "start" | "middle" | "end" | "inherit" | undefined;
  /**
   * @description 文本基线对齐方式
   * @type string
   * @default 'middle'
   */
  alignmentBaseline?:
    | 'auto'
    | 'baseline'
    | 'before-edge'
    | 'text-before-edge'
    | 'middle'
    | 'central'
    | 'after-edge'
    | 'text-after-edge'
    | 'ideographic'
    | 'alphabetic'
    | 'hanging'
    | 'mathematical'
    | 'inherit'
    | undefined;
  /**
   * @description 文本位置横坐标
   * @type number | string | undefined
   * @default '50%'
   */
  x?: number | string | undefined;
  /**
   * @description 文本位置纵坐标
   * @type number | string | undefined
   * @default '50%'
   */
  y?: number | string | undefined;
}
const TextForBg: React.FC<TextForBgProps> = ({
  imageUrl,
  text = 'TEXT',
  textOpacity = 0.9,
  textColor = '#00f',
  fontSize = '10em',
  fontWeight = 'bold',
  textAnchor = 'middle',
  alignmentBaseline = 'middle',
  x = '50%',
  y = '50%',
}) => {
  return (
    <div>
      <svg viewBox="0 0 600 300">
        <defs>
          <filter id="conform">
            <feImage
              href={imageUrl}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="ORIGIN_IMAGE"
            ></feImage>
            <feColorMatrix
              in="ORIGIN_IMAGE"
              type="saturate"
              values="0"
              result="GRAY_IMAGE"
            ></feColorMatrix>
            <feDisplacementMap
              in="SourceGraphic"
              in2="GRAY_IMAGE"
              scale="15"
              xChannelSelector="R"
              yChannelSelector="R"
              result="TEXTURED_TEXT"
            ></feDisplacementMap>
            <feColorMatrix
              in="TEXTURED_TEXT"
              result="OPACITY_TEXT"
              type="matrix"
              values={`1 0 0 0 0
                                0 1 0 0 0
                                0 0 1 0 0
                                0 0 0 ${textOpacity} 0`}
            ></feColorMatrix>
            <feImage
              href={imageUrl}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="BG"
            ></feImage>
            <feBlend in="BG" in2="OPACITY_TEXT" mode="multiply"></feBlend>
          </filter>
        </defs>
        <image
          href={imageUrl}
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        ></image>
        <text
          x={x}
          y={y}
          fontSize={fontSize}
          fontWeight={fontWeight}
          textAnchor={textAnchor as any}
          alignmentBaseline={alignmentBaseline as any}
          fill={textColor}
          filter="url(#conform)"
        >
          {text}
        </text>
      </svg>
    </div>
  );
};

export default TextForBg;
