import React from 'react';

import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/github';

const SerumEditor = (props)=>{

  return (
    <AceEditor
      mode='markdown'
      theme='github'
      onChange={ (content)=>{ props.onChange(content);} }
      value={props.content}
      editorProps={{$blockScrolling: true}}
      wrapEnabled={true}
      width='auto'
      height={''+props.parentHeight - 150+'px'}
      />
  );

};

module.exports = SerumEditor;
