/* global chrome */

var React = require('react');

var SerumPopupError = React.createClass({
  render: function(){

    return (
        <div id="warning" className="panel panel-default panel-danger">
          <div className="panel-heading">
            <h3 className="panel-title"> WARNING: Configuration Missing! </h3>
          </div>
          <div className="panel-body">
            <p>
            You need to go to the options page and configure the following items:
            </p>
            <ul>
              <li> Your Github username </li>
              <li> The Github repo for your Jekyll site </li>
              <li>The directory to publish to (Default: <code>_drafts</code>)</li>
              <li> A Github authentication token </li>
            </ul>
            <button id="optionslink" className="btn btn-info btn-sm" onClick={this.clickedOptions}>
              <span className="glyphicon glyphicon-cog" aria-hidden="true" /> Options
            </button>
          </div>
        </div>
      );

  },

  clickedOptions: function(){
    window.open(chrome.extension.getURL('options.html'));
  }
});

module.exports = SerumPopupError;
