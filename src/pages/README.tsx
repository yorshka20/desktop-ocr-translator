import { Divider, Input, Button, Typography } from 'antd';

import { ChangeEvent } from 'react';
import styled from 'styled-components';

const { Title, Paragraph, Text } = Typography;

const Ul = styled.ul`
  list-style: circle;
  li {
    list-style: circle;
  }
`;

const Div = styled.div`
  display: flex;
  align-items: center;
`;

const CodeBlock = styled.pre`
  color: #cccccc !important;
  background: #282c34 !important;
`;

function Home(): JSX.Element {
  const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    console.log('e', value);
    window.api.store.set('api-key', value);
  };

  const handleClick = async () => {
    // const result = window.api.systemPreferences.getMediaAccessStatus('screen');
    // console.log('systempreference', result);

    const result = await window.electronApi.ipcRenderer.invoke('check-screen');
    console.log('check screen ', result);

    // systemPreferences.askForMediaAccess(mediaType);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: 'screen1:0',
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720,
          },
        },
      });
      if (stream) {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (canvas) {
          const context = canvas.getContext('2d');
          context?.drawImage(stream, 0, 0);
        }
      }
    } catch (error) {
      console.log('ereror', error);
    }
  };

  return (
    <Typography style={{ overflowY: 'scroll' }}>
      <Title>Google Cloud Translate API KEY</Title>
      <Input width={200} onChange={handleInput} />
      <Divider />
      <Button onClick={handleClick}>screenshot</Button>
      <Title level={2}>🚀Feature</Title>
      <Paragraph>
        <Ul>
          <li>Develop by react and build by vite.</li>
          <li>Format code style by prettier and eslint.</li>
          <li>Configured electron-builder and husky and commitlint.</li>
        </Ul>
      </Paragraph>
      <Title level={2}>📖Usage</Title>
      <Title level={3}>Dev</Title>
      <Paragraph>
        Install
        <CodeBlock>yarn</CodeBlock>
        Start
        <CodeBlock>yarn dev</CodeBlock>
      </Paragraph>
      <Title level={4}>Package</Title>
      <CodeBlock>yarn build:[platform]</CodeBlock>
      <Paragraph></Paragraph>
    </Typography>
  );
}

export default Home;
