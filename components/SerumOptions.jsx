/* global chrome */
import React from 'react';

import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/github';

const DefaultTemplate = require('./DefaultTemplate');

const SerumOptionsEntryField = require('./SerumOptionsEntryField');
const SerumOptionsStatus = require('./SerumOptionsStatus');

const SerumOptions = React.createClass({

  getInitialState:function(){
    return {
      gitRepo: '',
      gitUser: '',
      gitBranch: 'master',
      draftsDir: '_drafts',
      postsDir: '_posts',
      extension: 'markdown',
      token: '',
      template: DefaultTemplate,
      status: ''
    };
  },

  componentDidMount: function(){
    chrome.storage.sync.get({
      gitUser: '',
      gitRepo: '',
      gitBranch: 'master',
      draftsDir: '_drafts',
      postsDir: '_posts',
      extension: 'markdown',
      token: '',
      template: DefaultTemplate
    },
      function(item) {
        this.setState({
          gitUser: item.gitUser,
          gitRepo: item.gitRepo,
          gitBranch: item.gitBranch,
          draftsDir: item.draftsDir,
          postsDir: item.postsDir,
          extension: item.extension,
          token: item.token,
          template: item.template
        });
      }.bind(this));
  },

  render: function(){
    return (
      <div>

        <div className='row'>

          <div className='col-sm-6'>

            <div id='welcome'>
              <p>
              <b>Welcome to Serum </b>, the easiest way to link post to
              our Github-hosted Jekyll blog.
              </p>
              <p>
              Before you can start using <b>Serum</b> you have to configure
              at least your Github details.
              </p>
              <p><a href='release_notes.html' target='_blank'>Read Release Notes</a>.</p>
            </div>
          </div>

          <div className='col-sm-6' >
            <a
              className='btn btn-success status'
              onClick={this.saveChanges}>
              <span
                className='glyphicon glyphicon-cog'
                aria-hidden='true'>
              </span> save changes
            </a>
            <SerumOptionsStatus status={this.state.status} />
          </div>

        </div>





        <form className='form-horizontal'>

          <div className='panel panel-default'>
            <div className='panel-heading'>
              <h3 className='panel-title'>Github Details and Authentication</h3>
            </div>

            <div className='panel-body'>


        <SerumOptionsEntryField
          label='GitHub User'
          configValue={this.state.gitUser}
          description='Your Github.com username'
          onChange={this.setGitUser} />

        <SerumOptionsEntryField
          label='GitHub Repo'
          configValue={this.state.gitRepo}
          description='The name of the repository with your Jekyll site source'
          onChange={this.setGitRepo} />

          <SerumOptionsEntryField
            label='Repo Branch'
            configValue={this.state.gitBranch}
            description='The name of the branch that contains your Jekyll site source'
            onChange={this.setGitBranch} />

        <SerumOptionsEntryField
          label='Access Token'
          configValue={this.state.token}
          description='Your Github Access Token'
          onChange={this.setToken} />

      </div>
    </div>

    <div className='panel panel-default'>
      <div className='panel-heading'>
        <h3 className='panel-title'>Posting Configuration</h3>
      </div>

      <div className='panel-body'>
        <SerumOptionsEntryField
          label='Drafts Directory'
          configValue={this.state.draftsDir}
          description='The sub-directory of your repo where draft posts are kept. Usually _drafts'
          onChange={this.setDraftsDir} />

        <SerumOptionsEntryField
          label='Posts Directory'
          configValue={this.state.postsDir}
          description='The sub-directory of your repo where published posts are kept. Usually _posts'
          onChange={this.setPostsDir} />

          <SerumOptionsEntryField
            label='File extension'
            configValue={this.state.extension}
            description='The file extension to use for each post.'
            onChange={this.setExtension} />


      </div>
    </div>

</form>

    <div className='panel panel-default'>
      <div className='panel-heading'>
        <h3 className='panel-title'>Post Template</h3>
      </div>
      <div className='panel-body'>

        <div className='row'>
          <div className='col-md-6'>
            <AceEditor
              mode='markdown'
              theme='github'
              onChange={this.setTemplate}
              value={this.state.template}
              editorProps={{$blockScrolling: true}}
              wrapEnabled={true}
              height='300px'
              width='auto'
              />
            <br/>
            <a id='restoreBtn' className='btn btn-info btn-sm status' onClick={()=>{ this.setTemplate(DefaultTemplate);}}>
              <span className='glyphicon glyphicon-cog' aria-hidden='true'></span> Restore Default Template
            </a>
          </div>

          <div className='col-md-6'>
            <p>
              This is the template for a new post. It contains several placeholders indicated by the by <b>&lt;&lt;</b> and <b>&gt;&gt;</b> characters. These characters are replaced by the appropriate values for the page you are on when you activate
              Serum.
            </p>
            <dl>
              <dt>&lt;&lt;title&gt;&gt;</dt>
              <dd>The title of the current page.</dd>
              <dt>&lt;&lt;date&gt;&gt;</dt>
              <dd>The current date.</dd>
              <dt>&lt;&lt;time&gt;&gt;</dt>
              <dd>The current time.</dd>
              <dt>&lt;&lt;url&gt;&gt;</dt>
              <dd>The URL of the current page.</dd>
              <dt>&lt;&lt;quote&gt;&gt;</dt>
              <dd>The currently selected text of the page (if any) with each line prefixed with <b>&gt;</b> character (ie a markdown blockquote)</dd>
            </dl>

          </div>

        </div>

      </div>
    </div>

</div>
);
  },

  saveChanges: function(){
    this.setState({ status: 'saving'});

    chrome.storage.sync.set({
      gitUser: this.state.gitUser,
      gitRepo: this.state.gitRepo,
      gitBranch: this.state.gitBranch,
      DraftsDir: this.state.draftsDir,
      postsDir: this.state.postsDir,
      extension: this.state.extension,
      token: this.state.token,
      template: this.state.template
    }, function() {
      // Update status to let user know options were saved.
      setTimeout(function () {
        this.setState({ status: 'saved'});
      }.bind(this), 1000);

      setTimeout(function () {
        this.setState({ status: ''});
      }.bind(this), 2000);

    }.bind(this));

  },

  setGitRepo: function(value){
    this.setState({ gitRepo: value, status: 'unsaved' });
  },

  setGitBranch: function(value){
    this.setState({ gitBranch: value, status: 'unsaved' });
  },

  setGitUser: function(value){
    this.setState({ gitUser: value, status: 'unsaved' });
  },

  setDraftsDir: function(value){
    this.setState({ draftsDir: value, status: 'unsaved' });
  },

  setPostsDir: function(value){
    this.setState({ postsDir: value, status: 'unsaved' });
  },

  setExtension: function(value){
    this.setState({ extension: value, status: 'unsaved' });
  },

  setToken: function(value){
    this.setState({ token: value, status: 'unsaved' });
  },

  setTemplate: function(value){
    this.setState({ template: value, status: 'unsaved' });
  }

});

module.exports = SerumOptions;
