import React, {useEffect, useState} from 'react';
import Editor from 'for-editor';

import Layout from '@/layouts';
import MsgItem from '@/pages/MsgItem';
import "./index.less";

function Recommend() {
    const aMsgList = [
        {
            type: "推荐",
            user: "ShiYue",
            time: "46分钟前",
            label: "关注",
            title: "前端真好玩~~",
            good: 50,
            comment: 7
        },
        {
            type: "推荐",
            user: "ShiYue",
            time: "46分钟前",
            label: "关注",
            title: "前端真好玩~~",
            good: 50,
            comment: 7
        }
    ];
    return (
        <div className="recommend">
            <Layout aside={true}>
                <div className="main-page-content">
                    <ul className="main-page-content-header">
                        <li>热门</li>
                        <li>最新</li>
                    </ul>
                    <ul className="main-page-content-main">
                        {
                            aMsgList.map((item, index) =>
                                <MsgItem msg={item} key={index}/>
                            )
                        }
                    </ul>
                </div>
                <aside className="main-page-aside">
                    <div className="main-page-aside-item"/>
                    <div className="main-page-aside-item"/>
                </aside>
            </Layout>
            {/*<Editor value={value} onChange={(value) => handleChange(value)}/>*/}
        </div>
    );
}

export default Recommend;
