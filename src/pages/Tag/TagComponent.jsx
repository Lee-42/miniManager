import React from 'react';
import { extend } from 'umi-request';
import { Tag } from 'antd';

class TagComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        return (
            <div>This is TagComponent</div>
        )
    }
}

export default TagComponent;