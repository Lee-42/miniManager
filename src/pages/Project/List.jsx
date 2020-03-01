import React, { PureComponent, Fragment }  from 'react';
import { connect } from "dva";
import moment from "moment";
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Button,
    Table,
    notification,
    Popconfirm,
    Divider,
    Tag,
    Select,
    Avatar
} from 'antd';
import ProjectComponent from "./ProjectComponent";

const FormItem = Form.Item;

@connect(({ project }) => ({
    project,
}))
@Form.create()
class TableList extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            changeType: false,
            title: "",
            img: "",
            url: "",
            stateComponent: '',
            content: '',
            start_time: new Date(),
            end_time: new Date(),
            visible: false,
            loading: false,
            keyword: '',
            state: '',
            pageNum: 1,
            pageSize: 10,
            columns: [
                 {
                     title: '标题',
                     width: 150,
                     dataIndex: 'title',
                 },
                 {
                     title: '内容',
                     width: 350,
                     dataINdex: 'content',
                 },
                 {
                     title: 'url',
                     width: 50,
                     dataIndex: 'img',
                     render: val => <Avatar shape="square" src={val} size={40} icon="user" />
                 },
                 {
                     title: '状态',
                     dataIndex: 'state',
                     render: val => {
                        //  状态1 已经完成, 2是正在进行  3是没完成
                        if(val === 1){
                            return <Tag color='green'>已经完成</Tag>;
                        }
                        if(val === 2){
                            return <Tag color="red">正在进行</Tag>;
                        }
                        return <Tag>没完成</Tag>;
                     },
                 },
                 {
                     title: '开始时间',
                     dataIndex: 'start_time',
                     sorter: true,
                     render: val => <span>{{val}}</span>
                 },
                 {
                     title: '操作',
                     width: 150,
                     render: (text, record) => {
                         <div>
                             <Fragment>
                                 <a onClick={() => this.showModal(record)}>修改</a>
                             </Fragment>
                             <Divider type="vertical"></Divider>
                             <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(text, record)}>
                                 <a href="javascript:;">Delete</a>
                             </Popconfirm>
                         </div>
                     },
                 },
            ],
        };

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        // this.handleStateChange = this.handleStateChange.bind(this);
        this.handleChangeState = this.handleChangeState.bind(this);
        this.showModal = this.showModal.bind(this);
        this.onChangeTime = this.onChangeTime.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount(){
        // this.handleSearch(this.state.pageNum, this.state.pageSize);
    }

    // 修改页码参数
    handleChangePageParams(pageNum, pageSize) {
        this.setState(
            {
                pageNum,
                pageSize,
            },
            () => {
                this.handleSearch();
            }
        )
    }


    // 弹出新增/修改项目模态窗
    showModal = record => {
        if(record._id){
            const { dispatch } = this.props;
            const params = {
                id: record._id,
            };
            new Promise(resolve => {
                dispatch({
                    type: 'project/getProjectDetail',
                    payload: {
                        resolve,
                        params,
                    },
                });
            }).then(res => {
                if(res.code === 0){
                    this.setState({
                        visible: true,
                        changeType: true,
                        stateComponent: res.data.state,
                        title: res.data.title,
                        img: res.data.img,
                        url: res.data.url,
                        content: res.data.content,
                    });
                } else {
                    notification.error({
                        message: res.message,
                    });
                }
            });
        } else {
            this.setState({
                visible: true,
                changeType: false,
                stateComponent: '',
                title: '',
                img: '',
                url: '',
                content: '',
            });
        }
    };


    //模态框确认
    handleOk = () => {
        this.handleSubmit();
    }


    //提交
    handleSubmit = () => {
        console.log('onSubmit');
        const { dispatch } = this.props;
        const { projectDetail } = this.props.project;
        if(this.state.changeType){
            const params = {
                id: projectDetail._id,
                state: this.state.stateComponent,
                title: this.state.title,
                img: this.state.img,
                url: this.state.url,
                content: this.state.content,
                start_time: this.state.start_time,
                end_time: this.state.end_time,
            };
            new Promise(resolve => {
                dispatch({
                    type: 'project/updateProject',
                    payload: {
                        resolve,
                        params,
                    },
                });
            }).then(res => {
                if(res.code === 0){
                    notification.success({
                        message: res.message,
                    });
                    this.setState({
                        visible: false,
                        changeType: false,
                    });
                    this.handleSearch(this.state.pageNum, this.state.pageSize);
                }else {
                    notification.error({
                        message: res.message,
                    });
                }
            });
        }else {
            const params = {
                state: this.state.stateComponent,
                title: this.state.title,
                img: this.state.img,
                url: this.state.url,
                content: this.state.content,
                start_time: this.state.start_time,
                end_time: this.state.end_time,
            };
            new Promise(resolve => {
                dispatch({
                    type: 'project/addProject',
                    payload:{
                        resolve,
                        params,
                    },
                });
            }).then(res => {
                if(res.code === 0){
                    notification.success({
                        message: res.message,
                    });
                    this.setState({
                        visible: false,
                        changeType: false,
                    });
                    this.handleSearch(this.state.pageNum, this.state.pageSize);
                }else {
                    notification.error({
                        message: res.message,
                    });
                }
            });
        }
    }


    // 查询项目
    handleSearch = () => {
        this.setState({
          loading: true,
        });
        const { dispatch } = this.props;
        const params = {
          keyword: this.state.keyword,
          state: this.state.state,
          pageNum: this.state.pageNum,
          pageSize: this.state.pageSize,
        };
        new Promise(resolve => {
          dispatch({
            type: 'project/queryProject',
            payload: {
              resolve,
              params,
            },
          });
        }).then(res => {
          // console.log('res :', res);
          if (res.code === 0) {
            this.setState({
              loading: false,
            });
          } else {
            notification.error({
              message: res.message,
            });
          }
        });
      };
    

    //修改Input文本框内容
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }


    //改变项目状态 
    handleChangeState = (value) => {
        this.setState({
            stateComponent: value,
        })
    }

    // 取消新增或修改
    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }

    //修改发布时间
    onChangeTime = (data, dateString) => {
        this.setState({
            start_time: new Date(dateString[0]),
            end_time: new Date(dateString[1]),
        });
    }

    renderSimpleForm() {
        return (
            <Form layout='inline' style={{marginBottom: '20px'}}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={24} sm={24}>
                        <FormItem>
                            <Input 
                                name="keyword"
                                placeholder="项目 标题/内容"
                                value={this.state.keyword}
                                onChange={this.handleChange}></Input>
                        </FormItem>
                        <Select
                            style={{ width: 200, marginRight: 20 }}
                            placeholder="选择状态"
                            onChange={this.handleChangeState}>
                                {/* 状态1 已经完成  2正在进行 3没有完成  ''代表所有项目 */}
                                <Select.Option value="">所有</Select.Option>
                                <Select.Option value="1">已完成</Select.Option>
                                <Select.Option value="2">正在进行</Select.Option>
                                <Select.Option value="3">未完成</Select.Option>
                        </Select>
                        <span>
                            <Button 
                                onClick={this.handleSearch}
                                style={{ marginTop: '3px' }}
                                type="primary"
                                icon='search'>Search</Button>
                        </span>
                        <span>
                            <Button
                                onClick={this.showModal}
                                style={{ marginTop: '3px', marginLeft: '10px' }}
                                type="primary">新增</Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        )
    }

    render(){
        const { projectList, total } = this.props.project;
        console.log('projectList:', projectList);
        console.log('projectList的type:', typeof(projectList));
        const { pageNum, pageSize } = this.state;
        const pagination = {
            total,
            defaultCurrent: pageNum,
            pageSize,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
                this.handleChangePageParams(current, pageSize);
            },
            onChange: (current, pageSize) => {
                this.handleChangePageParams(current, pageSize);
            }
        } 

        return (
            <div>
                <Card bordered={false}>
                <div className="">
                    <div className="">{this.renderSimpleForm()}</div>
                    <Table
                    pagination={pagination}
                    loading={this.state.loading}
                    pagination={pagination}
                    rowKey={record => record._id}
                    columns={this.state.columns}
                    bordered
                    dataSource={projectList}
                    />
                </div>
                </Card>
                <ProjectComponent
                    changeType={this.state.changeType}
                    title={this.state.title}
                    img={this.state.img}
                    url={this.state.url}
                    content={this.state.content}
                    state={this.state.stateComponent}
                    visible={this.state.visible}
                    handleOk={this.handleOk}
                    handleChange={this.handleChange}
                    handleStateChange={this.handleChangeState}
                    handleCancel={this.handleCancel}
                    onChangeTime={this.onChangeTime}></ProjectComponent>
            </div>
        );
    }
}

export default TableList;
