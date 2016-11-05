const React = require('react');

const SerumOptionsStatus = (props) => {

  var label = <label></label>;
  if (props.status === 'saving') { label = <label><i className="fa fa-circle-o-notch fa-spin"></i> Saving changes ...</label>; }
  if (props.status === 'saved') { label = <label><i className="fa fa-check"></i> Changes saved.</label>; }
  if (props.status === 'unsaved') { label = <label><i className="fa fa-exclamation"></i> There are unsaved changes.</label>; }

  const style = {
    paddingLeft: 10
  }

  return <span style={style}>{label}</span>;
};

module.exports = SerumOptionsStatus;
