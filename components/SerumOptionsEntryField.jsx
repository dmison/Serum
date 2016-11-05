var React = require('react');

var SerumOptionsEntryField = React.createClass({

  render: function() {
    return (
      <div className='form-group'>
        <label className='col-sm-2 control-label'>{this.props.label}</label>
        <div className='col-sm-4'>
          <input className='form-control' onChange={this.textChanged} value={this.props.configValue}/>
        </div>
        <div className='col-sm-6 helptext'>
        <p>
          {this.props.description}
        </p>
      </div>
      </div>
    );
  },

  textChanged: function(event) {
    this.props.onChange(event.target.value);
  }

});

module.exports = SerumOptionsEntryField;
