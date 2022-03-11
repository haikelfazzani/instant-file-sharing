export default function FileTable ({ file }){
  if (file) {
    return <table className="w-100 br7 mb-3 mt-3">
      <thead><tr><th>file name</th><th>size</th></tr></thead>
      <tbody>
        <tr>
          <td>{file.name}</td>
          <td>{parseInt(file.size / 1024, 10)} kb</td>
        </tr>
      </tbody>
    </table>
  }
  else return <></>
}