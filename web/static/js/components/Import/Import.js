import React from 'react'
import Dropzone from 'react-dropzone'
import { ofx } from 'utils'

export default class Import extends React.Component {
  handleDrop = (files) => {
    const reader = new FileReader()

    reader.onload = (e) => ofx.importOFX(e.target.result)

    reader.readAsText(files[0])
  };

  render() {
    return (
      <div>
        <Dropzone onDrop={this.handleDrop}>
          <div>Drop an OFX file here</div>
        </Dropzone>
      </div>
    )
  }
}
