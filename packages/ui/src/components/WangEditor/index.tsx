import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import React, { useEffect, useState } from 'react';

function HQHEditor() {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null);

  // 编辑器内容
  const [html, setHtml] = useState<string | undefined>();

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: ['group-image', 'group-video'],
  };

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        server: '/api/upload-image',
        fieldName: 'custom-field-name',
      },
      uploadVideo: {
        server: '/api/upload-video',
        fieldName: 'custom-field-name',
      },
    },
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    //  if(editor){
    //   const toolbar = DomEditor.getToolbar(editor)
    //   const curToolbarConfig = toolbar.getConfig()
    //   console.log(curToolbarConfig.toolbarKeys,111) // 当前菜单排序和分组
    //  }
    return () => {
      if (editor === null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => setHtml(editor.getHtml())}
          mode="default"
          style={{ height: '500px', overflowY: 'hidden' }}
        />
      </div>
      {/* <div style={{ marginTop: '15px' }}>{html}</div> */}
    </>
  );
}

export default HQHEditor;
