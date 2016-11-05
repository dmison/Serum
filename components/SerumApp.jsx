/* global Github, chrome  */

const React = require('react');

const moment = require('moment');

const SerumPopupError = require('./SerumPopupError');
const SerumEditor = require('./SerumEditor');
const DefaultTemplate = require('./DefaultTemplate');
const SerumFilenameBox = require('./SerumFilenameBox');
const DirectorySelector = require('./DirectorySelector');
const SerumPostStatus = require('./SerumPostStatus');

const PostFormatter = require('./PostFormatter');

const SerumApp = React.createClass({

  getInitialState: function() {
    return {
      postContent: '',
      postTitle: '',
      postDate: '',
      postTime: '',
      postQuote: '',
      postUrl: '',
      postFilename: '',
      postDirectory: '',
      configGitRepo: '',
      configGitBranch: 'master',
      configGitUser: '',
      configDraftsDir: '_drafts',
      configPostsDir: '_posts',
      configExtension: 'markdown',
      configToken: '',
      configTemplate: DefaultTemplate,
      windowHeight: 800,
      status: '',
      statusMessage: ''
    };
  },

  componentWillMount: function(){

    if (this.state.postDirectory === ''){
      this.setState({postDirectory: this.state.configDraftsDir});
    }

  },

  render: function() {

    if( this.state.configGitUser === '' ||
        this.state.configGitRepo === '' ||
        this.state.configToken === '' ) {
      return (
        <div>
          <SerumPopupError />
        </div>
      );
    } else {
      return (
        <div>
          <SerumEditor
            content={this.state.postContent}
            onChange={this.setContent}
            parentHeight={this.state.windowHeight}/>


          <div className="form-group controls">
            <div className="row">
              <div className="col-xs-3 post-label">
                <label>Post as:</label>
              </div>
              <div className="col-xs-2 directory-selector">
                <DirectorySelector
                  selected={this.state.postDirectory}
                  draftsDir={this.state.configDraftsDir}
                  postsDir={this.state.configPostsDir}
                  onChange={this.setDirectory} />
              </div>
              <div className="col-xs-1 seperator-text">/</div>
              <div className="col-xs-6 filename-box">
                <SerumFilenameBox
                  onChange={this.setFilename}
                  filename={this.state.postFilename} />
              </div>
            </div>
          </div>
          <div className="row controls statusView">
            <SerumPostStatus status={this.state.status} message={this.state.statusMessage} />
            <button className='btn btn-info btn-md post-button' onClick={this.postArticle}>Post</button>
          </div>
        </div>

      );
    }

  },

  // ======================================================== BEHAVIOUR
  setContent: function(newContent){
    this.setState({ postContent: newContent} );
  },

  setDirectory: function(newDirectory){
    this.setState({postDirectory: newDirectory});
  },

  setFilename: function(newFilename){
    this.setState({postFilename: newFilename});
  },

  postArticle: function(){

    this.setState({
      status: 'posting',
      statusMessage: 'Posting...'
    });

    const github = new Github({
      token: this.state.configToken,
      auth: 'oauth'
    });

    const user = this.state.configGitUser;
    const repoName = this.state.configGitRepo;
    const branch = this.state.configGitBranch;
    const path = this.state.postDirectory+'/'+this.state.postFilename;
    const content = this.state.postContent;
    const commitMsg = this.determineCommitMessage(this.state.postDirectory,
      this.state.configDraftsDir,
      this.state.configPostsDir);

    const repo = github.getRepo(user, repoName);

    repo.write(branch, path, content, commitMsg, {}, function(err){
      if (err) {
        this.setState({
          status: 'error',
          statusMessage: 'ERROR ' + err.request.status + ':' + err.request.statusText
        });
      } else {
        this.setState({
          status: 'success',
          statusMessage: 'SUCCESS: Post committed successfully'
        });
      }

    }.bind(this));

  },

  determineCommitMessage: function(directory, draftDir, postDir){
    var msg = 'adding content';

    if (directory === draftDir){
      msg = 'Adding draft: '+this.state.postTitle;
    }

    if (directory === postDir){
      msg = 'Publishing: '+this.state.postTitle;
    }

    return msg;

  },

  // ======================================================== LIFECYCLE
  componentDidMount: function() {

    chrome.storage.sync.get({
      gitUser: '',
      gitRepo: '',
      draftsDir: '_drafts',
      postsDir: '_posts',
      extension: 'markdown',
      gitBranch: 'master',
      token: '',
      template: DefaultTemplate
    },
      function(item) {
        this.setState({
          configGitRepo: item.gitRepo,
          configGitUser: item.gitUser,
          configDraftsDir: item.draftsDir,
          configPostsDir: item.postsDir,
          configExtension: item.extension,
          configGitBranch: item.gitBranch,
          configToken: item.token,
          configTemplate: item.template
        });
      }.bind(this));

    // [todo] - how do I ensure that this won't happen until after config has been loaded (without nesting?)
    // [todo] - how to handle if there is no valid config?
    chrome.tabs.query({
      active: true, currentWindow: true
    }, function(tabs) {

      chrome.tabs.sendMessage(tabs[0].id, {
        method: 'getSelection'
      }, function(response) {

        const today = new moment();
        const date = today.format('YYYY-MM-DD');
        const time = today.format('HH:mm');

        const extension = this.state.configExtension;

        const filename = PostFormatter.formatFilename(response.title, date, extension);
        const content = PostFormatter.processTemplate(this.state.configTemplate, response.title, date, time, response.url, response.quote);

        this.setState({
          postQuote: response.quote,
          postTitle: response.title,
          postUrl: response.url,
          postDate: date,
          postTime: time,
          postFilename: filename,
          postContent: content,
          postDirectory: this.state.configDraftsDir,
          windowHeight: response.height
        });

      }.bind(this));

    }.bind(this));
  }

});

module.exports = SerumApp;
