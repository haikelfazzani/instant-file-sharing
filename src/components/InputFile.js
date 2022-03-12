import React from 'react';
import './InputFile.css';

function InputFile({ onChange }) {
  return <div className="w-100 file-drop-area bordred br7">
    <div className='mb-2 display-1'><i className='fa fa-file-download'></i></div>

    <div className='w-100'>
      <span className="btn bg-gray"><i className='fa fa-file-export mr-1'></i>Choose file</span>
      <p className="mb-0">or drag and drop files here</p>
      <input onChange={onChange} type="file" name='file' accept=".gif,.jpg,.jpeg,.png,.doc,.docx" required />
    </div>
  </div>
}

export default InputFile