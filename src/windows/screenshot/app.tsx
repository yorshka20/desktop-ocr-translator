import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  border: 1px solid red;
  box-sizing: border-box;
  margin: 5px;

  background-color: transparent;

  width: 100vw;
  height: 100vh;
`;

export default function App() {
  const [imgData, setImgData] = useState('');

  const handleClick = async () => {};

  useEffect(() => {
    async function screenshot(): Promise<void> {
      const result = await window.electronApi.ipcRenderer.invoke(
        'check-screen'
      );
      console.log('check screen ', result);

      // systemPreferences.askForMediaAccess(mediaType);

      try {
        const dataUrl = await window.electronApi.ipcRenderer.invoke(
          'screenshot'
        );
        const img = document.getElementById('screenshot') as HTMLImageElement;
        if (img) {
          img.src = dataUrl;
        }
      } catch (error) {
        console.log('ereror', error);
      }
    }

    screenshot();
  }, []);

  return (
    <Container>
      <img src="" id="screenshot" />
    </Container>
  );
}
