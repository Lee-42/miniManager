import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
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
    Switch,
    Tag,
    Select,
} from 'antd';
import MessageComponent from './MessageComponent';
import moment from 'moment';

const FormItem = Form.Item;

@connect(({message}) => ({
    message,
}))
@Form.create()
class TableList extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            loading: false,
            keyword: '',
            state: '',  // 状态0是未处理, 1是已处理, ‘’代表所有留言
            pageNum: 1,
            pageSize: 10,
            columns: [
                {
                    title: '用户名',
                    dataIndex: 'name',
                },
                {
                    title: 'email',
                    dataIndex: 'email',
                },
                {
                    title: '头像',
                    dataIndex: 'avatar',
                },
                {
                    title: 'phone',
                    dataIndex: 'phone',
                },
                // {
                //     title: '用户介绍',
                //     dataIndex: 'introduce',
                // }
                {
                    title: '内容',
                    width: 300,
                    dataIndex: 'content',
                },
                {
                    title: '状态',
                    dataIndex: 'state',
                    render: val => (val ? <Tag color="green">已经处理</Tag> : <Tag color="red">未处理</Tag>),
                },
                {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    sorter: true,
                    render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
                },
                {
                    title: '操作',
                    width: 150,
                    render: (text, record) => (
                        <div>
                            <Fragment>
                                <a onClick={() => this.showReplyModal(true, record)}>回复</a>
                            </Fragment>
                            <Divider type="vertical"></Divider>
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(text, record)}>
                                <a href="javascript:;">Delete</a>
                            </Popconfirm>
                        </div>
                    )
                }
            ]
        };

        this.handleChangeKeyword = this.handleChangeKeyword.bind(this);
        this.handleChangePageParams = this.handleChangePageParams.bind(this);
        this.handleSearch = this.handleSerach.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }

    componentDidMount(){
        this.handleSearch(this.state.pageNum, this.state.pageSize);
    }

    //改变关键字
    handleChangeKeyword(event) {
        this.setState({
            keyword: event.target.value,
        })
    } 

    //改变页码参数
    handleChangePageParams(pageNum, pageSize) {
        this.setState(
            {
                pageNum,
                pageSize,
            },
            () => {
                this.handlesearch();
            }
        )
    }


    // 删除留言
    handleDelete = (text, record) => {
        // console.log('text: ', text);
        // console.log('record: ', record);
        const { dispatch } = this.props;
        const params = {
            id: record._id,
        };
        new Promise(resolve => {
            dispatch({
                type: 'message/delMessage',
                payload: {
                    resolve,
                    params,
                },
            });
        }).then(res => {
            // console.log('res: ', res);
            if(res.code === 0){
                notification.success({
                    message: res.message,
                });
                this.handleSearch(this.state.pageNum, this.state.pageSize);
            }else {
                notification.error({
                    message: res.message,
                })
            }
        })
    }


    // 获取留言
    handleSerach = () => {
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
                type: 'message/queryMessage',
                payload: {
                    resolve,
                    params,
                },
            });
        }).then(res => {
            console.log('res: ', res);
            if(res.code === 0){
                this.setState({
                    loading: false,
                });
            }else {
                notification.error({
                    message: res.message,
                });
            }
        });
    };


    // 弹出回复留言Modal
    showReplyModal = (text, record) => {
        console.log('onShowReplyModal');
        const { dispatch } = this.props;
        const params = {
            id: record._id,
        };
        new Promise(resolve => {
            dispatch({
                type: 'message/getMessageDetail',
                payload: {
                    resolve,
                    params,
                },
            });
        }).then(res => {
            console.log('res: ', res);
            if(res.code === 0){
                this.setState({
                    visible: true,
                });
            }else {
                notification.error({
                    message: res.message,
                });
            }
        });
    };

    // 取消并隐藏Modal
    handleCancel(){
        this.setState({
            visible: false,
        })
    }

    //确认并隐藏Modal
    handleOk(){
        this.setState({
            visible: false,
        })
    }


    renderSimpleForm(){
        return (
            <Form layout='inline' style={{ marginBottom: '20px' }}>
                <Row gutter={{ md: 8, lg: 24, xl : 48 }}>
                    <Col md={24} sm={24}>
                        <FormItem>
                            <Input placeholder='留言内容'
                                   value={this.state.keyword}
                                   onChange={this.handleChangeKeyword}></Input>
                        </FormItem>
                        <Select style={{ width: 200, marginRight: 20 }}
                                placeholder='选择状态'
                                onChange={this.handleChangeState}>
                            <Select.Option value="">所有</Select.Option>
                            <Select.Option value="1">未处理</Select.Option>
                            <Select.Option value="2">已处理</Select.Option>
                        </Select>
                        <span>
                            <Button onClick={this.handleSearch}
                                    style={{ marginTop: '3px' }}S
                                    type="primary"
                                    icon="search">Search</Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        const { messageList, total } = this.props.message;
        // console.log('messageList', messageList);
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
            },
        };

        return (
            <div>
                <Card bordered={false}>
                    <div className="">
                        <div className="">{this.renderSimpleForm()}</div>
                        <Table pagination={pagination}
                               loading={this.state.loading}
                               pagination={pagination}
                               rowKey={record => record._id}
                               columns={this.state.columns}
                               bordered
                               dataSource={messageList}></Table>
                    </div>
                </Card>
                <MessageComponent visible={this.state.visible}
                                  handleOk={this.handleOk}
                                  handleCancel={this.handleCancel}></MessageComponent>
            </div>
        ) 
    }
} 

export default TableList;