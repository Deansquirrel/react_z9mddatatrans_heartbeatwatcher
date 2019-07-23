import React,{Component} from "react";
import {Table,message} from 'antd';
import {PropTypes} from "prop-types";
import moment from 'moment';

import "./HeartBeatWatcher.css"

import $ from 'jquery'

export class PageHeartBeatWatcher extends Component {
    constructor(props){
        super(props);
        this.state={
            data:[],
            lastTime:"",
            isSearching:false,
            timer:undefined,
        };
        this.refreshData.bind(this);
        this.refreshTime.bind(this);
    }

    static propTypes = {
        svrAddress:PropTypes.string,
    };

    static defaultProps = {
        svrAddress:"",
    };

    refreshTime = () => {
        this.setState({
            lastTime:moment().format('YYYY-MM-DD HH:mm:ss'),
        });
    };

    refreshData = () => {
        if(this.props.svrAddress === "") {
            message.warn("未能刷新数据：服务地址为空");
            this.refreshTime();
            return
        }

        $.ajax({
            type:'GET',
            url:this.props.svrAddress + "/data",
            timeout:30000,
            contentType:'application/json',
            cache:false,
            sync:true,
            beforeSend:function(){
                this.setState({
                    isSearching:true,
                });
            }.bind(this),
            complete:function(){
                this.setState({
                    isSearching:false,
                    lastTime:moment().format('YYYY-MM-DD HH:mm:ss'),
                });
            }.bind(this),
            success: function (strData) {
                const data = JSON.parse(strData);
                if(data["errcode"]===200){
                    this.setState({
                        data:data.data.map(d => {
                            return {
                                key:d.mdId,
                                ...d,
                            }
                        }),
                    });
                } else {
                    this.setState({
                        data:[],
                    });
                    if(data["errmsg"]!=="") {
                        message.info(data["errmsg"]);
                    } else {
                        message.info("未知错误");
                        console.log(data)
                    }
                }
            }.bind(this),
            error:function(xhr,status,e) {
                message.warn("刷新时遇到错误");
                console.log(e);
                // message.error("[" + xhr.status + "]" + status + ":"+ e,3)
            }
        });
    };

    componentDidMount() {
        // this.refreshData();
        setTimeout(this.refreshData,100);
        this.setState({
            timer:setInterval(this.refreshData,60000),
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    render() {
        const columns = [
            {
                title: '门店ID',
                dataIndex: 'mdId',
                key: 'mdId',
            },
            {
                title: '门店名称',
                dataIndex: 'mdName',
                key: 'mdName',
            },
            {
                title: '最后心跳时间',
                dataIndex: 'heartBeat',
                key: 'heartBeat',
            },
        ];
        const lastRefresh = this.state.lastTime;
        const dataSource = this.state.data;
        const getRowClassName = (r) => {return r.isOffLine === "true"?"row":"b"};

        return (
            <div>
                <h1 style={{fontSize: '24px'}}>心跳监控</h1>
                <div style={{width:"100%",height:'36px'}}>
                    <span style={{float:'right',marginRight:'16px'}}>最后刷新时间：{lastRefresh}</span>
                </div>
                <Table loading={this.state.isSearching} rowClassName={getRowClassName} bordered pagination={false} dataSource={dataSource} columns={columns}/>
            </div>
        )
    }
}
