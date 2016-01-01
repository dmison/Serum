(function(){

  var React = require('react');
  var brace = require('brace');
  var AceEditor = require('react-ace');
  require('brace/mode/markdown');
  require('brace/theme/github');

  var SerumEditorTest = React.createClass({

    render: function(){
      return (
        <div>
            <AceEditor
              mode='markdown'
              theme='github'
              onChange={this.updateArticleContent}
              value={this.props.content}
              editorProps={{$blockScrolling: true}}
              wrapEnabled={true}
              />
        </div>
      )
    },

    updateArticleContent: function(event){
      this.props.onChange(event.target.value)
    }

  });

  module.exports = SerumEditorTest;

})();
