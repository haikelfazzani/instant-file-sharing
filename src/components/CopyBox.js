import React, { useState } from 'react'

export default function CopyBox({ text }) {

  const [textCopy, setTextCopy] = useState('Copy')

  const onCopyLink = () => {
    const input = document.createElement('textarea');
    input.innerHTML = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    setTextCopy('Copied')
    setTimeout(() => { setTextCopy('Copy') }, 2000);
  }

  return <div className="w-100 d-flex justify-between align-center box">
    <p onClick={onCopyLink} className="m-0 text-truncate">{text}</p>
    <button onClick={onCopyLink} className="bg-pistachio">
      <i className='fa fa-copy mr-1'></i>{textCopy}
    </button>
  </div>
}
