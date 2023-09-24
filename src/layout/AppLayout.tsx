import routes from '@renderer/routers';
import { Layout, Spin } from 'antd';
import { Suspense } from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import styled from 'styled-components';

import SideMenu from './components/SideMenu';

const { Content, Sider } = Layout;

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

function AppLayout(): JSX.Element {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible theme="light">
        <SideMenu />
      </Sider>
      <Content style={{ overflow: 'auto', maxHeight: '100vh', padding: 20 }}>
        <Suspense
          fallback={
            <CenterDiv>
              <Spin size="large" tip="Loading..." />
            </CenterDiv>
          }
        >
          {useRoutes(routes as RouteObject[])}
        </Suspense>
      </Content>
    </Layout>
  );
}

export default AppLayout;
