(function(){
  var React = require('react');

  var SerumFilenameBox = React.createClass({
    render: function(){
      return (
        <input className='form-control' onChange={this.textChanged} value={this.props.filename} />
      );
    },

    textChanged: function(event){
      this.props.onChange(event.target.value);
    }
  });

  module.exports = SerumFilenameBox;

})();