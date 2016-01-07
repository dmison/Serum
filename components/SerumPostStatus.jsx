(function(){

  var React = require('react');

  var SerumPostStatus = (props) => {
    var output = <label></label>;

    if (props.status === 'error'){
      return (
        <label className='alert alert-danger post-status-panel'>
          {props.message}
        </label>
      );
    }

    if (props.status === 'success'){
      return (
        <label className='alert alert-success post-status-panel'>
          {props.message}
        </label>
      );
    }

    if (props.status === 'posting'){
      return (
        <label className='alert alert-info post-status-panel'>
          <i className="fa fa-circle-o-notch fa-spin"></i> {props.message}
        </label>
      );
    }


    return output;

  };

  module.exports = SerumPostStatus;

})();
