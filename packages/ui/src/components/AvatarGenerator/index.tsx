import { fabric } from 'fabric';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import './style/index.less';
// 导入图片资源
import hat0 from '../../assets/avatar/hat/hat0.png';
import hat1 from '../../assets/avatar/hat/hat1.png';
import hat2 from '../../assets/avatar/hat/hat2.png';
import hat3 from '../../assets/avatar/hat/hat3.png';
import hat4 from '../../assets/avatar/hat/hat4.png';
import hat5 from '../../assets/avatar/hat/hat5.png';
import hat6 from '../../assets/avatar/hat/hat6.png';
import hat7 from '../../assets/avatar/hat/hat7.png';
import hat8 from '../../assets/avatar/hat/hat8.png';
import hat9 from '../../assets/avatar/hat/hat9.png';
import { getUUID } from '@chloehe/utils';

export interface AvatarProps {
  /**
   * @description 帽子图片数组
   * @type {string[]}
   */
  hatArr?: string[];
  /**
   * @description 画布宽度
   * @type number
   * @default 200
   */
  width?: number;
  /**
   * @description 画布高度
   * @type number
   * @default 200
   */
  height?: number;
  /**
   * @description 合成图片的文件名
   * @type string
   * @default 'avatar-xxx'
   */
  fileName?: string;
}

const AvatarGenerator: React.FC<AvatarProps> = ({
  hatArr = [hat0, hat1, hat2, hat3, hat4, hat5, hat6, hat7, hat8, hat9],
  width = 200,
  height = 200,
  fileName = `avatar-${getUUID()}`,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [currentHatIndex, setCurrentHatIndex] = useState(0);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // const hatArr = [hat0, hat1, hat2, hat3, hat4, hat5, hat6, hat7, hat8, hat9];

  // 初始化画布
  useEffect((): any => {
    if (canvasRef.current) {
      const newCanvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
      });
      setCanvas(newCanvas);
      return () => newCanvas.dispose();
    }
  }, []);

  // 添加帽子到画布
  const addHatToCanvas = (hatUrl: string) => {
    if (!canvas) return;

    // 移除旧的帽子
    const objects = canvas.getObjects();
    objects.forEach((obj: any) => {
      if (obj.dataType === 'hat') {
        // 添加自定义标识
        canvas.remove(obj);
      }
    });

    fabric.Image.fromURL(hatUrl, (hat: any) => {
      hat.dataType = 'hat'; // 添加自定义标识
      console.log('hat', hat);
      // 设置帽子初始尺寸和位置
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      hat.set({
        left: 0,
        top: 0,
        scaleX: canvasWidth / hat.width,
        scaleY: canvasHeight / hat.height,
        hasControls: true,
        cornerColor: '#0b3a42',
        cornerStrokeColor: '#fff',
        cornerStyle: 'circle',
        transparentCorners: false,
        rotatingPointOffset: 30,
      });
      // 设置控制点可见性
      hat.setControlsVisibility({
        bl: false, // 左下
        // br: false,  // 右下
        tl: false, // 左上
        tr: false, // 右上
        // ml: false,  // 中左
        mr: false, // 中右
        mt: false, // 中上
        // mb: false   // 中下
      });
      canvas.add(hat);
      canvas.bringToFront(hat); // 确保帽子在最上层
      canvas.renderAll();
    });
  };

  // 添加用户图片到画布
  const addImageToCanvas = (imgUrl: string) => {
    if (!canvas) return;

    canvas.clear();

    fabric.Image.fromURL(imgUrl, (img: any) => {
      // 获取画布尺寸
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      // 设置图片属性
      img.set({
        scaleX: canvasWidth / img.width,
        scaleY: canvasHeight / img.height,
        left: 0,
        top: 0,
        hasControls: false, // 禁用控制点
        selectable: false, // 不可选中
        dataType: 'background', // 添加类型标识
      });
      canvas.add(img);
      if (hatArr.length > 0) {
        addHatToCanvas(hatArr[currentHatIndex]);
      }
    });
  };

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target?.result as string;
        setUserImage(imgUrl);
        addImageToCanvas(imgUrl);
        setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // 切换帽子
  const changeHat = (direction: number) => {
    if (!canvas || hatArr.length === 0) return;

    // 仅更新帽子（保留背景图片）
    if (canvas) {
      let newIndex = currentHatIndex + direction;
      if (newIndex < 0) newIndex = hatArr.length - 1;
      if (newIndex >= hatArr.length) newIndex = 0;
      setCurrentHatIndex(newIndex);
      const bgImage = canvas
        .getObjects()
        .find((obj: any) => obj.dataType === 'background');
      if (bgImage) {
        // 保留背景直接添加新帽子
        addHatToCanvas(hatArr[newIndex]);
      } else if (userImage) {
        // 重新创建整个场景
        addImageToCanvas(userImage);
      }
    }
  };

  // 导出图片
  const handleExport = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2, // 提高导出质量
    });

    const link = document.createElement('a');
    link.download = `${fileName}.png` || `avatar-${getUUID()}.png`;
    link.href = dataURL;
    link.click();
  };
  // 重置画布
  const handleReset = () => {
    if (!canvas) return;

    // 分步清除内容
    canvas.getObjects().forEach((obj) => {
      // 保留背景色设置
      if (obj !== canvas.backgroundImage) {
        canvas.remove(obj);
      }
    });
    // 重置视图位置
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    // 延时确保DOM更新
    setTimeout(() => {
      canvas.renderAll();
    }, 100);
    // 状态重置
    setCurrentHatIndex(0);
    setUserImage(null);
    setIsEditing(false);

    // 重置文件输入
    const fileInput = document.getElementById('upload');
    if (fileInput) {
      (fileInput as HTMLInputElement).value = '';
    }
  };
  return (
    <div className="wrapper">
      <div className="operation-box">
        <button
          type="button"
          className="nav-btn prev"
          disabled={!isEditing}
          onClick={() => changeHat(-1)}
        >
          ←
        </button>
        <div className="cropper-content">
          <div className="canvas-container">
            <canvas ref={canvasRef} />
          </div>
        </div>
        <button
          type="button"
          className="nav-btn next"
          disabled={!isEditing}
          onClick={() => changeHat(1)}
        >
          →
        </button>
      </div>

      <div className="controls">
        <label className="upload-btn btn">
          上传照片
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </label>

        {isEditing && (
          <Fragment>
            <button
              type="button"
              className="export-btn btn"
              onClick={handleExport}
            >
              保存头像
            </button>
            <button
              type="button"
              className="reset-btn btn"
              onClick={handleReset}
            >
              重新制作
            </button>
          </Fragment>
        )}
      </div>

      {/* 预加载帽子图片 */}
      <div style={{ display: 'none' }}>
        {hatArr.map((hat, index) => (
          <img key={index} src={hat} alt={`hat-${index}`} />
        ))}
      </div>
    </div>
  );
};

export default AvatarGenerator;
