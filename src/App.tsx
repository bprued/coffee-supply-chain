import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CalculatorOutlined,
  DownloadOutlined,
  UnorderedListOutlined,
  TagOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';
import Import from './components/Import';
import Parties from './components/Parties';
import TaxCal from './components/TaxCal';
import Trade from './components/Trade';
import './App.scss'


const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState('1');
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  const renderContent = (current: string) => {
    switch(current){
      case '1':
        return <Trade />
      case '2':
        return <Import />
      case '3':
        return <Parties />
      case '4':
        return <TaxCal />
    }
  }

  return (
    <Layout className="App">
      <Sider collapsible trigger={null} collapsed={collapsed}>
        <div className="logo">LOGO</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          selectedKeys={[current]}
          onClick={onClick}
          items={[
            {
              key: '1',
              icon: <TagOutlined />,
              label: 'Trade',
            },
            {
              key: '2',
              icon: <DownloadOutlined />,
              label: 'Import',
            },
            {
              key: '3',
              icon: <UnorderedListOutlined />,
              label: 'Parties',
            },
            {
              key: '4',
              icon: <CalculatorOutlined />,
              label: 'Tax Calculate',
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {renderContent(current)}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;