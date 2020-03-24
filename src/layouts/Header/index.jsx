import React, {useState, useEffect} from "react";
import {Menu, Dropdown, Modal, Input, message} from "antd";
import "./index.less";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import {withRouter} from 'react-router-dom';
import {reqLogin, reqMsg} from "@/utils/api"
import Cookies from 'js-cookie' //可以从操作前端cookie的对象 set()/remove()/get()
const Header = (props) => {
    const {
        history,
        markdownValue,
        aLabelType,
        aCategoryType
    } = props;
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [msgTitle, setMsgTitle] = useState();
    const [isLogin, setIsLogin] = useState(false);
    const [modalDisplay, setModalDisplay] = useState(false);

    const [categorySelect, setCategorySelect] = useState([]);
    const [labelSelect, setLabelSelect] = useState([]);
    const url = history.location.pathname;

    useEffect(() => {
        readIsLogin()
    }, []);

    const readIsLogin = () => {
        const userId = Cookies.get('userId');
        if (userId) {
            setIsLogin(true);
        }
    };

    const handleChange = (value, ajaxType) => {
        value.persist();

        switch (ajaxType) {
            case "username":
                setUsername(value.target.value.trim());
                break;
            case "password":
                setPassword(value.target.value.trim());
                break;
            case "msgTitle":
                setMsgTitle(value.target.value.trim());
            default:
                break;
        }
    };

    const handleLogin = () => {
        if (!username || !password) {
            message.error("用户名或密码不能为空！");
            return
        }
        reqLogin({username, password}).then((res) => {
            const {data = {}} = res;
            if (data.code === 1) {
                message.error(data.msg);
                return
            }
            if (data.code === 0) {
                message.success(data.msg);
                readIsLogin();
                handleCancelModal();
            }
        })
    };

    const handleCancelModal = () => {
        setUsername();
        setPassword();
        setModalDisplay(false);
    };

    const handleShowModal = () => {
        setModalDisplay(true);
    };

    const handleWrite = () => {
        history.push(`/write`);
    };

    const handleSendMsg = () => {
        if (!msgTitle || msgTitle.length > 20) {
            message.error("文章标题不能为空，且不能超过20个字！");
            return
        }
        if (!markdownValue) {
            message.error("文章内容不能为空！");
            return
        }
        if (!categorySelect.length) {
            message.error("分类不能为空！");
            return
        }
        if (!labelSelect.length) {
            message.error("标签不能为空！");
            return
        }
        if (markdownValue.length > 15000) {
            message.error("文章内容不能超过15000字！");
            return
        }
        const userId = Cookies.get('userId');
        const userName = Cookies.get('userName');
        if (userId && userName) {
            reqMsg({
                msgAuthorId: userId,
                msgAuthorName: userName,
                departments: categorySelect,
                labels: labelSelect,
                msgContent: markdownValue,
                msgTitle: msgTitle
            }).then(res => {
                const {data} = res;
                if (data.code === 0) {
                    message.success(data.msg);
                    history.replace("/");
                } else if (data.code === 1) {
                    message.error(data.msg);
                }
            });
        } else {
            message.error("登录已失效，请重新登陆！");
            Cookies.remove("userId");
            history.push("/")
        }
    };

    const handleActiveCategory = (id) => {
        if (categorySelect.indexOf(id) !== -1) {
            setCategorySelect(categorySelect.filter(item => item !== id));
        } else {
            setCategorySelect([...categorySelect, id])
        }
    };

    const handleActiveLabel = (id) => {
        if (labelSelect.indexOf(id) !== -1) {
            setLabelSelect(labelSelect.filter(item => item !== id));
        } else {
            setLabelSelect([...labelSelect, id])
        }
    };

    return (
        <header className="header">
            <div className="header-main">
                <div className="header-main-home"
                     onClick={() => {
                         history.push("/")
                     }}
                >
                    <div className="header-main-home-logo"/>
                    <div className="header-main-home-title">
                        数据科协
                    </div>
                </div>
                {
                    isLogin ?
                        <ul className="header-main-list">

                            {
                                url === '/write'
                                    ?
                                    <Dropdown
                                        overlay={
                                            <Menu className="my-dropdown">
                                                <div>
                                                    <Input placeholder="请输入文章标题："
                                                           className="my-dropdown-title"
                                                           onChange={(ev) => handleChange(ev, "msgTitle")}
                                                           value={msgTitle}
                                                    />
                                                </div>
                                                <div className="my-dropdown-category">分类</div>
                                                <ul className="my-dropdown-category-ul">
                                                    {
                                                        aCategoryType.map((item, index) => {
                                                            return <li
                                                                className={`my-dropdown-category-ul-li ${categorySelect.indexOf(item._id) === -1 ? "my-dropdown-category-ul-li-common" : "my-dropdown-category-ul-li-active"}`}
                                                                key={index}
                                                                onClick={() => handleActiveCategory(item._id)}
                                                            >{item.name}</li>
                                                        })
                                                    }
                                                </ul>
                                                <div className="my-dropdown-category">标签</div>
                                                <ul className="my-dropdown-category-ul">
                                                    {
                                                        aLabelType.map((item, index) => {
                                                            return <li
                                                                className={`my-dropdown-category-ul-li ${labelSelect.indexOf(item._id) === -1 ? "my-dropdown-category-ul-li-common" : "my-dropdown-category-ul-li-active"}`}
                                                                key={index}
                                                                onClick={() => handleActiveLabel(item._id)}
                                                            >{item.name}</li>
                                                        })
                                                    }
                                                </ul>
                                                <div className="my-dropdown-btn"
                                                     onClick={() => handleSendMsg()}
                                                >
                                                    确认并发布
                                                </div>
                                            </Menu>
                                        }
                                    >
                                        <li>
                                            <a className="header-main-list-send">
                                                发布
                                            </a>
                                        </li>
                                    </Dropdown>
                                    :
                                    <Button
                                        onClick={() => handleWrite()}
                                        className="header-main-list-btn"
                                    >
                                        写文章
                                    </Button>
                            }
                            <li>
                                <Icon type="BellOutlined"
                                      className="header-main-list-notice-icon"
                                />
                            </li>
                            <Dropdown
                                placement={"bottomRight"}
                                overlay={
                                    <Menu className="user-dropdown">
                                        <ul className="user-dropdown-ul">
                                            <li>123</li>
                                            <li>123</li>
                                            <li>123</li>
                                            <li>123</li>
                                            <li>123</li>
                                        </ul>
                                    </Menu>
                                }
                            >
                                <li>
                                    <div
                                        className="header-main-list-user-icon"
                                        style={{
                                            backgroundImage: `url("http://baike.kaiwind.com/jplb/201406/02/W020140602369270434118.png")`
                                        }}/>
                                </li>
                            </Dropdown>
                        </ul>
                        :
                        <p className="header-login"
                           onClick={() => handleShowModal()}
                        >登录</p>
                }
            </div>
            <Modal
                visible={modalDisplay}
                cancelText={"取消"}
                closable={false}
                destroyOnClose={true}
                okText={"确定"}
                title={"登录"}
                width={318}
                onOk={() => handleLogin()}
                onCancel={() => handleCancelModal()}
            >
                <div className="header-model">
                    账号： <Input className="header-model-input"
                               placeholder="请输入账号："
                               value={username}
                               onChange={(ev) => handleChange(ev, "username")}
                />
                    密码： <Input className="header-model-input"
                               placeholder="请输入密码："
                               type="password"
                               value={password}
                               onChange={(ev) => handleChange(ev, "password")}
                />
                </div>
            </Modal>
        </header>
    );
};

export default withRouter(Header);
