import React from 'react';
import { Input, Select, Button, notification } from 'antd';
import { connect } from 'dva';
import SimpleMDE from 'simplemde';
import marked from 'marked';
import highlight from 'highlight.js';
import 'simplemde/dist/simplemde.min.css';

@connect(({ article, tag, category }) => ({
  article,
  tag,
  category,
}))
class ArticleCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smde: null,
      loading: false,
      keywordCom: '',
      pageNum: 1,
      pageSize: 10,
      changeType: false,
      title: '',
      author: 'Lee',
      keyword: '',
      content: '',
      desc: '',
      img_url: '',
      origin: 0, //0 原创, 1 转载, 2 混合
      state: 1, //文章状态, 0 草稿  1已发布
      type: 1, // 文章类型   1普通文章, 2简历  3管理员介绍
      tags: '',
      category: '',
      tagDefault: [],
      categoryDefault: [],
    };
    this.handleSearchTag = this.handleSearchTag.bind(this);
    this.handleSearchCategory = this.handleCategoryChange.bind(this);
    this.getSmdeValue = this.getSmdeValue.bind(this);
    this.setSmdeValue = this.setSmdeValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
    this.handleChangeOrigin = this.handleChangeOrigin.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // 页面挂载的时候,查询本文章具有的标签和分类
    // this.handleSearchTag();
    // this.handleSearchCategory();

    this.state.smde = new SimpleMDE({
      element: document.getElementById('editor').childElementCount,
      autofocus: true,
      autosave: true,
      previewRender: function(plainText) {
        return marked(plainText, {
          renderer: new marked.Renderer(),
          gfm: true,
          pedantic: false,
          sanitize: false,
          tables: true,
          breaks: true,
          smartLists: true,
          smartypants: true,
          highlight: function(code) {
            return highlight.highlightAuto(code).value;
          },
        });
      },
    });
  }

  //方法
  // 1.输入框值变化
  handleChange(event) {
    this.setState({
      // 每项  title、author、keyword、desc、img_url
      [event.target.name]: event.target.value,
    });
  }

  // 2.设置文章发布状态
  handleChangeState(value) {
    this.setState({
      state: value,
    });
  }

  // 3.设置文章类型
  handleChangeType(value) {
    this.setState({
      type: value,
    });
  }

  // 4.设置文章来源
  handleChangeOrigin(value) {
    this.setState({
      origin: value,
    });
  }

  // 5.设置本文章拥有的标签
  handleTagChange(value) {
    const tags = value.join();
    console.log('tags: ', tags);
    this.setState({
      tagDefault: value, //用于展示
      tags,
    });
  }

  // 4.设置文章拥有的分类
  handleCategoryChange(value) {
    const category = value.join();
    console.log('caategory: ', category);
    this.setState({
      categoryDefault: value, //用于展示
      category,
    });
  }

  // 5.完成文章编辑之后的提交操作
  handleSubmit() {
    // console.log("submit")
    const { dispatch } = this.props;
    const { articleDetail } = this.props.article;
    if (!this.state.title) {
      notification.error({
        message: '文章标题不能为空',
      });
      return;
    }
    if (!this.state.keyword) {
      notification.error({
        message: '文章关键字不能为空',
      });
      return;
    }
    if (!this.state.smde.value()) {
      notification.error({
        message: '文章内容不能为空',
      });
      return;
    }
    this.setState({
      loading: true,
    });

    //修改
    if (this.state.changeType) {
      const params = {
        id: articleDetail._id,
        title: this.state.title,
        author: this.state.author,
        desc: this.state.desc,
        keyword,
        content: this.state.content,
        img_url: this.state.img_url,
        origin: this.state.origin,
        state: this.state.state,
        type: this.state.state.type,
        tags: this.state.tags,
        category: this.state.category,
      };
      new Promise(resolve => {
        dispatch({
          type: 'article/updateArticle',
          payload: {
            resolve,
            params,
          },
        });
      }).then(res => {
        if (res.code === 0) {
          notification.success({
            message: res.message,
          });
          this.setState({
            visible: false,
            changeType: false,
            title: '',
            author: 'Lee',
            keyword: '',
            content: '',
            desc: '',
            img_url: '',
            origin: 0, // 0 原创，1 转载，2 混合
            state: 1, // 文章发布状态 => 0 草稿，1 已发布
            type: 1, // 文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍
            tags: '',
            category: '',
            tagsDefault: [],
            categoryDefault: [],
          });
          this.handleSearch(this.state.pageNum, this.state.pageSize);
        } else {
          notification.erroe({
            message: res.message,
          });
        }
      });
    } else {
      //添加
      const params = {
        title: this.state.title,
        author: this.state.author,
        desc: this.state.desc,
        keyword: this.state.keyword,
        content: this.state.smde.value(),
        img_url: this.state.img_url,
        origin: this.state.origin,
        state: this.state.state,
        type: this.state.type,
        tags: this.state.tags,
        category: this.state.category,
      };
      new Promise(resolve => {
        dispatch({
          type: 'article/addArticle',
          payload: {
            resolve,
            params,
          },
        });
      }).then(res => {
        if (res.code === 0) {
          notification.success({
            message: res.message,
          });
          this.setState({
            loading: false,
            changeType: false,
          });
        } else {
          notification.error({
            message: res.message,
          });
        }
      });
    }
  }

  // 6.获取编辑器内容
  getSmdeValue() {
    // console.log(this.state.smde.value());
    return this.state.smde.value();
  }

  // 7.设置编辑器内容
  setSmdeValue(value) {
    this.state.smde.value(value);
  }

  // 8.查询本文章具有的标签
  handleSearchTag() {
    //查询还没有结果, 就要显示加载
    this.setState({
      loading: true,
    });
    const { dispatch } = this.props;
    const params = {
      keyword: this.state.keyword,
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
    };
    new Promise(resolve => {
      dispatch({
        type: 'tag/queryTag',
        payload: {
          resolve,
          params,
        },
      });
    }).then(res => {
      // console.log('res: ', res);
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
  }

  //9.查询本文章具有的分类
  handleSearchCategory() {
    //查询还没有结果, 就要显示加载
    this.setState({
      loading: true,
    });
    const { dispatch } = this.props;
    const params = {
      keyword: this.state.keyword,
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
    };
    new Promise(resolve => {
      dispatch({
        type: 'category/queryCategory ',
        payload: {
          resolve,
          params,
        },
      });
    }).then(res => {
      // console.log('res: ', res);
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
  }

  // 10.

  render() {
    const { tagList } = this.props.tag;
    const { categoryList } = this.props.category;
    const tagChildren = [];
    const categoryChildren = [];
    // 生成文章标签选项
    for (let i = 0; i < tagList.length; i++) {
      const e = tagList[i];
      tagChildren.push(
        <Select.Option key={e._id} value={e._id}>
          {e.name}
        </Select.Option>,
      );
    }
    //生成文章分类选项
    for (let i = 0; i < categoryList.length; i++) {
      const e = categoryList[i];
      categoryChildren.push(
        <Select.Option key={e._id} value={e._id}>
          {e.name}
        </Select.Option>,
      );
    }

    let originDefault = '原创';
    let stateDefault = '发布'; // 文章发布状态 => 0 草稿，1 发布
    const typeDefault = '普通文章'; // 文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍
    let categoryDefault = [];
    let tagsDefault = [];

    const normalCenter = {
      marginBottom: 7,
    };

    return (
      <div>
        <Input
          style={normalCenter}
          addonBefore="标 题"
          size="default"
          placeholder="标题"
          name="title"
          value={this.state.title}
          onChange={this.handleChange}
        />
        <Input
          style={normalCenter}
          addonBefore="作 者"
          size="default"
          placeholder="作者"
          name="author"
          value={this.state.author}
          onChange={this.handleChange}
        />
        <Input
          style={normalCenter}
          addonBefore="关键字"
          size="default"
          placeholder="关键字"
          name="keyword"
          value={this.state.keyword}
          onChange={this.handleChange}
        />
        <Input
          style={normalCenter}
          addonBefore="描 述"
          size="default"
          placeholder="描述"
          name="desc"
          value={this.state.desc}
          onChange={this.handleChange}
        />
        <Input
          style={normalCenter}
          addonBefore="封面链接"
          size="default"
          placeholder="封面链接"
          name="img_url"
          value={this.state.img_url}
          onChange={this.handleChange}
        />

        <Select
          style={{ width: 150, marginBottom: 20, marginRight: 5 }}
          placeholder="选择发布状态"
          defaultValue={stateDefault}
          onChange={this.handleChangeState}
        >
          {/* 0 草稿   1 发布 */}
          <Select.Option value="0">草稿</Select.Option>
          <Select.Option value="1">发布</Select.Option>
        </Select>

        <Select
          style={{ width: 150, marginBottom: 20, marginRight: 5 }}
          placeholder="选择文章类型"
          defaultValue={typeDefault}
          onChange={this.handleChangeType}
        >
          {/* 文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍 */}
          <Select.Option value="1">普通文章</Select.Option>
          <Select.Option value="2">简历</Select.Option>
          <Select.Option value="3">管理员介绍</Select.Option>
        </Select>

        <Select
          style={{ width: 150, marginBottom: 20, marginRight: 5 }}
          placeholder="选择文章转载状态"
          defaultValue={originDefault}
          onChange={this.handleChangeOrigin}
        >
          {/* 0 原创，1 转载，2 混合 */}
          <Select.Option value="0">原创</Select.Option>
          <Select.Option value="1">转载</Select.Option>
          <Select.Option value="2">混合</Select.Option>
        </Select>

        <Select
          allowClear
          mode="multiple"
          style={{ width: 200, marginBottom: 20, marginLeft: 10 }}
          placeholder="文章标签(暂无)"
          defaultValue={tagsDefault}
          value={this.state.tagsDefault}
          onChange={this.handleTagChange}
        >
          {tagChildren}
        </Select>

        <Select
          allowClear
          mode="multiple"
          style={{ width: 200, marginBottom: 10, marginLeft: 10 }}
          placeholder="文章分类(暂无)"
          defaultValue={categoryDefault}
          value={this.state.categoryDefault}
          onChange={this.handleCategoryChange}
        >
          {categoryChildren}
        </Select>

        <div>
          <Button
            onClick={() => {
              this.handleSubmit();
            }}
            loading={this.state.loading}
            style={{ marginBottom: '10px' }}
            type="primary"
          >
            提交
          </Button>
        </div>

        <div title="添加与修改文章" width="1200px">
          <textarea
            id="editor"
            style={{ marginBottom: 10, width: 800 }}
            size="large"
            rows={10}
          ></textarea>
        </div>
      </div>
    );
  }
}

export default ArticleCreate;
