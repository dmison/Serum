/* global chrome */

const React = require('react');

const SerumPopupError = (props) => {

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
        <button id="optionslink" className="btn btn-info btn-sm" onClick={()=> { window.open(chrome.extension.getURL('options.html')); }}>
          <span className="glyphicon glyphicon-cog" aria-hidden="true" /> Options
        </button>
      </div>
    </div>
  );

};

module.exports = SerumPopupError;
