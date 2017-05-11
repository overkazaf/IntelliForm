import { Component } from 'react';
import { 
    Tabs,
    Switch,
    Form,
    Row,
    Col,
    Collapse,
    Select,
    Input,
    Icon,
    Radio,
    Button,
    InputNumber,
    Tag,
    Popover,
} from 'antd';

import { 
  TwitterPicker,
  GithubPicker,
  CirclePicker,
} from 'react-color';

import { connect } from 'react-redux';

import IFDynamicForm from './IFDynamicForm.js';
import IFTransfer from './IFTransfer.js';
import IFEventTransfer from './IFEventTransfer.js';
import BasicProps from './BasicProps/BasicProps.js';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;

const children = [];
for (let i = 10; i < 16; i++) {
  children.push(<Option key={i.toString(16) + i}>组件{i}</Option>);
}

const getEventPopoverContent = () => {
  return (
    <div>
      <b>事件表达式说明：</b>
      <ul>
        <li>以 <Tag color='#df2311'>_$组件id</Tag>代替组件值, 如<Tag color='green'>_$comp1</Tag></li>
        <li>程序会对表达式进行合法性校验</li>
      </ul>
      <hr />
      <div>
        样例： _$comp1 * _$comp2
      </div>
    </div>
  );
};

let getActionTypes = () => {
  let types = [];
  let actionDict = {
    'SHOW_ELEM': '显示元素',
    'HIDE_ELEM': '隐藏元素',
    'MATH_CALC': '数学运算',
    'BRING_DATA_SOURCE': '携带数据源',
    'UPDATE_VALUE': '更新值',
    'LOCK_ELEM': '锁定元素',
    'UNLOCK_ELEM': '解锁元素',
    'VALIDATE_FORM': '校验表单',
    'SUBMIT_FORM': '提交表单',
    'JUMP_TO_LINK': '跳转链接',
    'DAIL': '拨打电话',
    'SEND_EMAIL': '发送邮件',
    'ALERT': '警告信息',
    'NOTIFICATION': '通知信息',
    'MESSAGE': '提醒消息',
  };
  
  Object.keys(actionDict).map((key, index) => {
    types.push(<Option key={`ACTION-${key}`}>{actionDict[key]}</Option>);
  });

  return types;
}


class ConfigTable extends Component {
    
    constructor(props) {
      super(props);
    
      this.state = {
        dataSourceRadioValue: 2,
        activeConfigTabKey: "2",
      };
    }

    handleDataSourceRadioChange = () => {
      this.setState({
        dataSourceRadioValue: this.state.dataSourceRadioValue == 1 ? 2 : 1,
      }, () => {
        console.log('this.state in handleDataSourceRadioChange', this.state);
      });
    };

    onChange(activeConfigTabKey) {
      console.log('activeConfigTabKey', activeConfigTabKey);
      this.setState({
        activeConfigTabKey,
      });
    }

    __getActiveConfigTabKey() {
      return this.state.activeConfigTabKey;
    }

    __getDataModel() {
      const tabIndex = +this.state.activeConfigTabKey;

      const getDataModelByTabIndex = [
        (refs) => {
          let dataModel = {};
          let basicProps = refs['basicProps'];
          Object.keys(basicProps.refs).map((refKey) => {
            dataModel[refKey] = basicProps.refs[refKey].getFieldsValue();
          });

          return dataModel;
        },
        (refs) => {
          let rawModels = Object.keys(refs).map((refKey) => {
            return refs[refKey].getFieldsValue();
          })[0];

          let dataSource = rawModels.labels.map((label) => {
            const labelValue = rawModels[`labels-${label}`];
            const valueValue = rawModels[`values-${label}`];
            return {
              label: `${labelValue}`,
              value: `${valueValue}`,
            }
          });
          
          return dataSource;
        }
      ];

      console.log('tabIndex-1', tabIndex);
      console.log(getDataModelByTabIndex[tabIndex-1](this.refs));

      return getDataModelByTabIndex[tabIndex-1](this.refs);
    }

    render() {
      let { dispatch } = this.props;
      console.log('dispatch', dispatch);

        return (
          <Tabs 
            onChange={this.onChange.bind(this)}
            type="card" 
            activeKey={this.state.activeConfigTabKey}>
            <TabPane tab="基础设置" key="1">
              <BasicProps dispatch={dispatch} ref="basicProps"/>
            </TabPane>
            <TabPane tab="数据源" key="2">
              <RadioGroup onChange={this.handleDataSourceRadioChange} value={this.state.dataSourceRadioValue}>
                <Radio value={1}>选择已有数据源</Radio>
                <Radio value={2}>自定义字典</Radio>
              </RadioGroup>

              <div style={{ marginTop: '10px' }}>
                {
                  this.state.dataSourceRadioValue == 1 ?
                    <IFTransfer ref="dataSource"  dispatch={dispatch}/>:
                    <IFDynamicForm ref="dataSource" dispatch={dispatch}/>
                }
              </div>
            </TabPane>
            <TabPane tab="过滤规则" key="3">
              <Row>
                <Col span={12}>
                  KeyTree
                </Col>
                <Col span={12}>
                  <Row gutter={6} style={{ marginBottom: 10}}>
                    <Col span={4}>
                      <Button type="default">GT</Button>
                    </Col>
                    <Col span={4}>
                      <Button type="default">EQ</Button>
                    </Col>
                    <Col span={4}>
                      <Button type="default">LT</Button>
                    </Col>
                    <Col span={4}>
                      <Button type="default">GTE</Button>
                    </Col>
                    <Col span={4}>
                      <Button type="default">LTE</Button>
                    </Col>
                    <Col span={4}>
                      <Button type="default">NE</Button>
                    </Col>
                  </Row>
                  <Row gutter={6}>
                    <Col span={4}>
                    <Button type="default">IN</Button>
                    </Col>
                    <Col span={4}>
                    <Button type="default">nIN</Button>
                    </Col>
                    <Col span={4}>
                    <Button type="default">MOD</Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: 10}}>
              <Col span={24}>
                <b>样例：</b>
                <ul>
                  <li>
                    <b>过滤出数据源IFTesting的value值小于10的所有集合</b>
                    <Tag color="#2b2b2b">IFTesting.value</Tag>
                    <Tag color="#2db7f5">LT</Tag>
                    <Tag color="#2b2b2b">10</Tag>
                  </li>
                  <li>
                    <b>过滤出数据源IFTesting的value值小于10的所有集合</b>
                    <Tag color="#2b2b2b">IFTesting.value</Tag>
                    <Tag color="#2db7f5">LT</Tag>
                    <Tag color="#2b2b2b">10</Tag>
                  </li>
                  <li>
                    <b>过滤出数据源IFTesting的value值小于10的所有集合</b>
                    <Tag color="#2b2b2b">IFTesting.value</Tag>
                    <Tag color="#2db7f5">LT</Tag>
                    <Tag color="#2b2b2b">10</Tag>
                  </li>
                  <li>
                    <b>过滤出数据源IFTesting的value值小于10的所有集合</b>
                    <Tag color="#2b2b2b">IFTesting.value</Tag>
                    <Tag color="#2db7f5">LT</Tag>
                    <Tag color="#2b2b2b">10</Tag>
                  </li>
                </ul>
              </Col>
              </Row>
            </TabPane>
            <TabPane tab="高级设置" key="4">
              <Collapse defaultActiveKey={['2']}>
                <Panel header="事件设置" key="1">
                  <IFEventTransfer />
                </Panel>
                <Panel header="动作设置" key="2">
                  <Row gutter={8}>
                    <div>
                      <b>onLoad -- (加载完成事件)</b>
                      <Popover
                        placement="right" 
                        content={getEventPopoverContent()} 
                        title="配置提示"
                      >                  
                        <Icon type="question-circle" />
                      </Popover>
                    </div>
                    <Col span={4}>
                    　<FormItem label="动作类型">
                        <Select
                          mode="select"
                          size={'large'}
                          placeholder="Please select action type"
                          defaultValue={[]}
                          style={{ width: '100%' }}
                        >
                          {getActionTypes()}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={6} offset={1}>
                    　<FormItem label="事件表达式">
                        <Input placeholder="表达式" />
                      </FormItem>
                    </Col>
                    <Col span={6} offset={1}>
                   　　<FormItem label="目标元素">  
                        <Select
                          mode="tags"
                          size={'large'}
                          placeholder="Please select target complments"
                          defaultValue={[]}
                          style={{ width: '100%' }}
                        >
                          {children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={4} offset={1}>
                    　<FormItem label="操作">
                        <Select
                          size={'large'}
                          placeholder="select operation"
                          defaultValue={[]}
                          style={{ width: '100%' }}
                        >
                          {
                            [
                              <Option key="option-add">新增动作</Option>,
                              <Option key="option-remove">移除动作</Option>,
                            ]
                          }
                        </Select>
                      </FormItem>
                    </Col>
                  </Row>
                  
                  <Row gutter={6}>
                    <Col span={4}>
                      <Button type="primary">
                        应用事件设置
                      </Button>
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
            </TabPane>
            
            <TabPane tab="校验规则" key="6">
              <Row gutter={6}>
                <Col span={6}>
                    <FormItem label={"允许全空白字符"}>
                        <Switch checkedChildren={'是'} unCheckedChildren={'否'} defaultChecked={true} />
                    </FormItem>
                </Col>
                <Col span={18}>
                    <FormItem label={"格式检验"}>
                        <RadioGroup onChange={null} value={1}>
                            <Radio value={1}>无</Radio>
                            <Radio value={2}>手机</Radio>
                            <Radio value={3}>邮箱</Radio>
                            <Radio value={4}>整数</Radio>
                            <Radio value={5}>小数</Radio>
                        </RadioGroup>
                    </FormItem>
                </Col>
              </Row>
              <Row gutter={8}>
              　<Col span={6}>
                   <FormItem label={"最小长度"}>
                     <InputNumber min={0}　value="0"/>
                   </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={"不足最小长度错误提示信息"}>
                        <Input type="text"/>
                    </FormItem>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={6}>
                    <FormItem label={"最大长度"}>
                        <InputNumber max={24}　value="10"/>
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={"超出最大长度错误提示信息"}>
                        <Input type="text"/>
                    </FormItem>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={6}>
                    <FormItem label={"小数位数"}>
                        <InputNumber min={0} max={4}　value="2"/>
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={"小数位数错误提示信息"}>
                        <Input type="text"/>
                    </FormItem>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={6}>
                    <FormItem label={"正则表达式"}>
                        <Input　placeholder="输出待校验的正则表达式"/>
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={"正则校验失败的提示信息"}>
                        <Input type="text"/>
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem label={"新增正则"}>
                        <Button type="dashed" onClick={null} style={{ width: '60%' }}>
                            <Icon type="plus" />
                        </Button>
                    </FormItem>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={6}>
                    <Button type="primary" onClick={null} style={{ width: '60%' }}>
                        应用校验配置
                    </Button>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="下推方案" key="7">
                表单特有的配置项
            </TabPane>
          </Tabs> 
        )
    }
}

const mapStateToProps = (store) => {
  return store.get('configReducer').toJS();
};

export default ConfigTable;
// export default connect(mapStateToProps)(ConfigTable);