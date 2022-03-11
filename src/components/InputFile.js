import React from 'react';
import './InputFile.css';

function InputFile({ onChange }) {
  return <div className="w-100 file-drop-area br7">
    <span className="btn">Choose file</span>
    <p className="mb-0">or drag and drop files here</p>
    <input onChange={onChange} type="file" name='file' accept=".gif,.jpg,.jpeg,.png,.doc,.docx" required />
  </div>
}

export default InputFile