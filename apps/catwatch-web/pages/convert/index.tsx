import { ChangeEvent, useState } from 'react';
import { NextPage } from 'next';

import { withAuth } from '@catstack/catwatch/features/auth';
import { Button, FileDropZone, Input } from '@catstack/shared/vanilla';

import { MainLayout } from '../../components/layout';

import { createFFmpeg } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({
  log: true,
  corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
});

const initialCommand: string[] = ['-i', 'test.avi', 'test.mp4'];

const ConvertContainer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [command, setCommand] = useState<string[]>(initialCommand);

  const handleCommandChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value.split(' '));
  };

  const handleFileDrop = (file: File) => {
    setFile(file);
  };

  const handleConvertClick = async () => {
    console.log('Command:', command);
    // if (!file) return;

    await ffmpeg.load();

    // ffmpeg.FS('writeFile', 'test.avi', await fetchFile('./test.avi'));
    // await ffmpeg.run(...command);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
      <div className="flex flex-col gap-4">
        <Input
          label="Command"
          onChange={handleCommandChange}
          value={command.join(' ')}
        />
        <FileDropZone onFileDrop={handleFileDrop} />
        <Button onClick={handleConvertClick}>Convert</Button>
      </div>
    </div>
  );
};

const ConvertPage: NextPage = () => {
  return (
    <MainLayout>
      <div className="grid place-items-center h-full w-full">
        <ConvertContainer />
      </div>
    </MainLayout>
  );
};

export default withAuth(ConvertPage)();
