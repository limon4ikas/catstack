import { intervalToDuration } from 'date-fns';

export { cva, cx } from 'class-variance-authority';

export const downloadFile = (fileName: string, fileUrl: string) => {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.setAttribute('download', fileName);
  link.classList.add('hidden');
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};

export const prettyBytes = (num: number) => {
  const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const neg = num < 0;
  if (neg) num = -num;
  if (num < 1) return (neg ? '-' : '') + num + ' B';
  const exponent = Math.min(
    Math.floor(Math.log(num) / Math.log(1000)),
    units.length - 1
  );
  const unit = units[exponent];
  num = Number((num / Math.pow(1000, exponent)).toFixed(2));
  return (neg ? '-' : '') + num + ' ' + unit;
};

export const getRemainingTime = (timeRemaining: number) => {
  let remaining = '';

  const rawSeconds = timeRemaining / 1000;
  const duration = intervalToDuration({ start: 0, end: rawSeconds * 1000 });
  const hours = duration.hours?.toString().padStart(2, '0');
  const minutes = duration.minutes?.toString().padStart(2, '0');
  const seconds = duration.seconds?.toString().padStart(2, '0');
  remaining = `${hours}:${minutes}:${seconds}`;

  return remaining;
};
