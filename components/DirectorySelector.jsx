(function(){

  var React = require('react');

  var DirectorySelector = React.createClass({

    render: function(){
      console.log('selector', this.props.draftsDir);

      return (
        <select value={this.props.selected} onChange={this.selectionChanged}>
          <option value={this.props.draftsDir}>{this.props.draftsDir}</option>
          <option value={this.props.postsDir}>{this.props.postsDir}</option>
        </select>
      );

    },

    selectionChanged: function(event){
      this.props.onChange(event.target.value);
    }

  });

  module.exports = DirectorySelector;

})();
