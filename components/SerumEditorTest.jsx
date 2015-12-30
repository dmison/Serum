(function(){

  var React = require('react');

  var SerumEditorTest = React.createClass({

    render: function(){
      return (
        <div>
          <textarea value={this.props.content} cols="80" rows="19" onChange={this.updateArticleContent}></textarea>
        </div>
      )
    },

    updateArticleContent: function(event){
      this.props.onChange(event.target.value)
    }

  });

  module.exports = SerumEditorTest;

})();
