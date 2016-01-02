(function(){

  var React = require('react');
  var brace = require('brace');
  var AceEditor = require('react-ace');
  require('brace/mode/markdown');
  require('brace/theme/github');

  var SerumEditor = React.createClass({

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
      );
    },

    updateArticleContent: function(content){

      this.props.onChange(content);
    }

  });

  module.exports = SerumEditor;

})();
