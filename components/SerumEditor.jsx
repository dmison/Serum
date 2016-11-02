import React from 'react';

import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/github';

var SerumEditor = React.createClass({

  render: function(){
    var height = 450;
    if(this.props.parentHeight < 650){
      height = this.props.parentHeight - 150;
    }
    return (
      <AceEditor
        mode='markdown'
        theme='github'
        onChange={this.updateArticleContent}
        value={this.props.content}
        editorProps={{$blockScrolling: true}}
        wrapEnabled={true}
        width='auto'
        height={''+height+'px'}
        />
    );
  },

  updateArticleContent: function(content){

    this.props.onChange(content);
  }

});

module.exports = SerumEditor;
