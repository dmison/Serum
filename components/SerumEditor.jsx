import React from 'react';

import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/github';

const SerumEditor = (props)=>{

  var height = 450;
  if(props.parentHeight < 650){
    height = props.parentHeight - 150;
  }

  return (
    <AceEditor
      mode='markdown'
      theme='github'
      onChange={ (content)=>{ props.onChange(content);} }
      value={props.content}
      editorProps={{$blockScrolling: true}}
      wrapEnabled={true}
      width='auto'
      height={''+height+'px'}
      />
  );

};

module.exports = SerumEditor;
