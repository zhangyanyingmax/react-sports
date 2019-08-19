import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from 'prop-types';

//引入样式
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


export default class RichTextEditor extends Component {

  static propTypes = {
    onEditorChange: PropTypes.func.isRequired
  };


  state = {
    editorState: EditorState.createEmpty(),
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });

    //子组件更改了数据要告诉父组件
    const text = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.props.onEditorChange(text);

  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          // wrapperClassName="demo-wrapper"
          editorClassName="product-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}