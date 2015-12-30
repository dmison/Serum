(function(){
  var React = require('react');

  var SerumFilenameBox = React.createClass({
    render: function(){
      return (
        <div>
          <input onChange={this.textChanged} value={this.props.filename} />
        </div>
      )
    },

    textChanged: function(event){
        this.props.onChange(event.target.value);
    }
  });

  module.exports = SerumFilenameBox;

})();
