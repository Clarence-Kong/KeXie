import React, {useEffect, useState} from 'react';
import Editor from 'for-editor'

import Layout from '@/layouts';
import "./index.less";

function Write() {
    const [markdownValue, setMarkdownValue] = useState();

    const handleMarkdownChange = (ev) => {
        setMarkdownValue(ev)
    };

    // markdown 编辑器的工具栏
    const toolbar = {
        h1: true, // h1
        h2: true, // h2
        h3: true, // h3
        h4: true, // h4
        img: true, // 图片
        link: true, // 链接
        code: true, // 代码块
        // preview: true, // 预览
        // expand: true, // 全屏
        undo: true, // 撤销
        // redo: true, // 重做
        // save: true, // 保存
        // subfield: true, // 单双栏模式
    };



    return (
        <div className="write">
            <Layout
                aside={false}
                nav={false}
                markdownValue={markdownValue}
            >
                <div className="main-page-content">
                    <Editor
                        placeholder={"请开始写作..."}
                        height={"700px"}
                        value={markdownValue}
                        onChange={(ev) => handleMarkdownChange(ev)}
                        preview={true}
                        subfield={true}
                        toolbar={toolbar}
                    />
                </div>
            </Layout>
        </div>
    );
}

export default Write;
