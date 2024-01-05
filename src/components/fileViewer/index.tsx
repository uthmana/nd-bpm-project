import React from 'react';

export default function FileViewer({ file }) {
  const imageType = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'svg'];
  const videoType = ['mp3', 'mp4', 'mov', 'ogg', 'mpg', 'mpeg'];
  if (!file) return;
  const fileType = file.split('.')[-1];

  if (imageType.includes(fileType)) {
    return (
      <a href={`/uploads/${file}`} target="_blank">
        <img className="w-[40px]" src={`/uploads/${file}`} />
      </a>
    );
  }

  if (videoType.includes(fileType)) {
    return (
      <a href={`/uploads/${file}`} target="_blank">
        <video width="320" height="240" controls>
          <source src={`/uploads/${file}`} type={`video/${fileType}`} />
        </video>
      </a>
    );
  }

  return (
    <a href={`/uploads/${file}`} target="_blank" download>
      <object data={`/uploads/${file}`} width="100%" height="100%"></object>
    </a>
  );
}
