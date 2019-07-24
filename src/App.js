import React from 'react';
import PropTypes from 'prop-types';
import {LocaleProvider} from 'antd';
import {message} from 'antd';
import { Layout, Menu, Icon } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from "moment";
import 'moment/locale/zh-cn';

import {MyPageOne} from "./Page/MyPageOne";
import {PageHeartBeatWatcher} from "./Page/HeartBeatWatcher";

import "antd/dist/antd.css";
import "./App.css"
import $ from 'jquery'

// const preVersionInfo = "0.0.0 Build20190101";
// const testVersionInfo = "0.0.0 Build20190101";
const versionInfo = "0.0.0 Build20190101";
function getCurrVersion() {
    return versionInfo
}

moment.locale('zh-cn');
message.config({
    top:60,
});

export default App;

function App(){
    return (
        <LocaleProvider locale={zhCN}>
            <div className={"rootContainer"}>
                <Container />
            </div>
        </LocaleProvider>
    )
}

class Container extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showPage:0,//0-init(null),1-login,-2-pageLoader
            svrAddress:"",
            wsVersion:"",
        };
        this.refreshConfig.bind(this);
        this.refreshWsVersion.bind(this);
        this.refreshWsVersionWorker.bind(this);
    }

    componentDidMount() {
        this.refreshConfig();
        this.refreshWsVersion();
        this.setState({
            showPage:2,
        });
    }

    refreshConfig = () =>{
        $.ajax({
            url:'../../config.json',
            cache:false,
            dataType:'json',
            success:function(data){
                // console.log(data)
                this.setState({
                    svrAddress:data["address"],
                });
            }.bind(this),
            error:function(e){
                console.log(e.toString());
                this.setState({
                    svrAddress:"",
                });
            }.bind(this)
        });
    };

    refreshWsVersion = () => {
        if(this.state.svrAddress===""){
            setTimeout(this.refreshWsVersion,1000)
        } else {
            this.refreshWsVersionWorker()
        }
    };

    refreshWsVersionWorker = () => {
        $.ajax({
            type:'GET',
            url:this.state.svrAddress + "/version",
            timeout:30000,
            contentType:'application/json',
            cache:false,
            sync:true,
            success: function (strData) {
                // console.log(strData);
                const data = JSON.parse(strData);
                if(data["errcode"]===200){
                    this.setState({
                        wsVersion:data.version,
                    });
                } else {
                    console.log(data.errmsg);
                }
            }.bind(this),
            error:function(xhr,status,e) {
                console.log(e);
            }
        });
    };

    render(){
        switch (this.state.showPage) {
            case 1:
                return (
                    <div>
                        <span>login</span>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <PageLoader wsVersion={this.state.wsVersion} svrAddress={this.state.svrAddress} defaultPage={"心跳监控"} />
                    </div>
                );
            default:
                return (<div>show page error</div>);
        }
    }
}

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

class PageLoader extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            collapsed: false,
            currPage:"",
            menuOpenKeys:[],
        };
        this.toggle.bind(this);
        this.handleMenuClick.bind(this);
        // this.handleMenuOpenChange.bind(this);
    }

    static propTypes = {
        menuData:PropTypes.array,
        defaultPage:PropTypes.string,
        wsVersion:PropTypes.string,
        svrAddress:PropTypes.string,
    };

    static defaultProps = {
        menuData:[],
        defaultPage:"",
        wsVersion:"Version",
        svrAddress:"",
    };

    componentWillMount() {
        this.setState({
            currPage:this.props.defaultPage,
        });
    }

    toggle = () => {
        this.setState({
            collapsed:!this.state.collapsed,
        });
    };

    handleMenuClick = (key) => {
        this.setState({
            currPage:key,
        })
    };

    // handleMenuOpenChange = (openKeys) => {
    //     this.setState({
    //         menuOpenKeys:openKeys,
    //     })
    // };

    getSubMenuKey = (menuData,menuKey) => {
        let listMap = new Map();
        menuData.map((item)=>{
            if(item.child.length > 0){
                item.child.map((subItem)=>{
                    listMap[subItem.key]=item.key;
                    return subItem.key
                });
            } else {
                listMap[item.key]=item.key;
            }
            return item.key
        });
        for (let key in listMap){
            if(key === menuKey){
                return listMap[key];
            }
        }
        return "";
    };

    getDefaultOpenKey = (menuData,currPage) =>{
        let list = [];
        const defaultMenu = this.getSubMenuKey(menuData,currPage);
        if(defaultMenu !== ""){
            list.push(defaultMenu);
        }
        return list;
    };

    render() {
        const testData = [
            {key:"Z9MdDataTrans",icon:"table",title:"Z9MdDataTrans",child:[
                    {key:"心跳监控",title:"心跳监控"}
                ]}
        ];
        const version = getCurrVersion();
        const wsVersion = this.props.wsVersion;
        const currPage = this.state.currPage;
        const defaultOpenKey = this.getDefaultOpenKey(testData,currPage);
        const collapsed = this.state.collapsed;

        const MenuList = ({mData}) => {
            return (
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[currPage]}
                    defaultOpenKeys={defaultOpenKey}
                >
                    {mData.map((item)=>{
                        if (item.child.length > 0){
                            return (
                                <SubMenu key={item.key} style={{backgroundColor:'transparent'}} title ={<span><Icon type={item.icon} /><span>{item.title}</span></span>}>
                                    {item.child.map((subItem)=>{
                                        return (
                                            <Menu.Item key={subItem.key} onClick={()=>this.handleMenuClick(subItem.key)}>
                                                <span>{subItem.title}</span>
                                            </Menu.Item>
                                        )
                                    })}
                                </SubMenu>
                            )
                        } else {
                            return (
                                <Menu.Item key={item.key}>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </Menu.Item>
                            )
                        }
                    })}
                </Menu>
            )
        };

        return (
            <Layout>
                 <Sider width={256} style={{minHeight:'100vh'}} trigger={null} collapsible collapsed={collapsed}>
                     <div className="logo" />
                     <MenuList style={{marginBottom:'80px'}} mData={testData} defaultKey = {"title5"} defaultOpenKey={"menu2"} />
                     <div style={{width:'100%',height:'80px',backgroundColor:'transparent'}} />
                     <div className={"VersionInfo"} style={{display:this.state.collapsed?"none":"block"}}>
                         <span>{version}</span><br/><span>{wsVersion}</span>
                     </div>
                     {/*<Affix className={"VersionInfo"} style={{display:this.state.collapsed?"none":"block"}} offsetBottom={16}>*/}
                     {/*    <span>{version}</span>*/}
                     {/*    <br/>*/}
                     {/*    <span>{wsVersion}</span>*/}
                     {/*</Affix>*/}
                 </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 , width: '100%' }}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                        {/*<div className={"rightHeader"}>*/}
                        {/*    <Button type={"link"}>*/}
                        {/*        <Icon type="logout" />Logout*/}
                        {/*    </Button>*/}
                        {/*</div>*/}
                    </Header>
                    <Content style={{margin: '24px 16px',padding: 24,background: '#fff'}}>
                        <PageContent svrAddress={this.props.svrAddress} currPage={currPage} />
                    </Content>
                </Layout>
            </Layout>
        )
    }
}


class PageContent extends React.Component {

    static propTypes = {
        currPage:PropTypes.string,
    };

    static defaultProps = {
        currPage:"",
    };

    render() {

        const currPage = this.props.currPage;

        switch (currPage){
            case "111":
                return (
                    <div>111</div>
                );
            case "222":
                return (
                    <div>222</div>
                );
            case "MyPageOne":
                return (
                    <MyPageOne/>
                );
            case "心跳监控":
                return (
                    <PageHeartBeatWatcher  svrAddress={this.props.svrAddress} />
                );
            default:
                return (
                    <div>{currPage}</div>
                );
        }
    }
}
