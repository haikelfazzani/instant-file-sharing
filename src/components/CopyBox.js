import React, { useState } from 'react'

export default function CopyBox({ text, onCopy }) {

  const [textCopy, setTextCopy] = useState('Copy')

  const onCopyLink = () => {
    const input = document.createElement('textarea');
    input.innerHTML = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    setTextCopy('Copied')
    onCopy();
  }

  return <div className="w-100 bg-yellow d-flex justify-between align-center box">
    <p onClick={onCopyLink} className="m-0 text-truncate">{text}</p>
    <button onClick={onCopyLink} className="bg-dark">
      <i className='fa fa-copy mr-1'></i>{textCopy}
    </button>
  </div>
}
