/* global Github, chrome  */

const React = require('react');

const moment = require('moment');
const Github = require('github-api');

const SerumPopupError = require('./SerumPopupError');
const SerumEditor = require('./SerumEditor');
const DefaultTemplate = require('./DefaultTemplate');
const SerumFilenameBox = require('./SerumFilenameBox');
const DirectorySelector = require('./DirectorySelector');
const SerumPostStatus = require('./SerumPostStatus');

const PostFormatter = require('./PostFormatter');

class SerumApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
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
      windowHeight: 600,
      status: '',
      statusMessage: ''
    };
    this.setContent = this.setContent.bind(this);
    this.setDirectory = this.setDirectory.bind(this);
    this.setFilename = this.setFilename.bind(this);
    this.postArticle = this.postArticle.bind(this);
    this.determineCommitMessage = this.determineCommitMessage.bind(this);
  }

  // ======================================================== LIFECYCLE
  componentWillMount() {
    if (this.state.postDirectory === '') {
      this.setState({postDirectory: this.state.configDraftsDir});
    }
  }

  componentDidMount() {

    window.onresize = () => {
      this.setState( { windowHeight: window.outerHeight });
    };

    chrome.runtime.onMessage.addListener(function(data) {
      const today = new moment();
      const date = today.format('YYYY-MM-DD');
      const time = today.format('HH:mm');
      const extension = this.state.configExtension;
      const filename = PostFormatter.formatFilename(data.title, date, extension);
      const content = PostFormatter.processTemplate(this.state.configTemplate, data.title, date, time, data.url, data.quote);
      this.setState({
      postQuote: data.quote,
      postTitle: data.title,
      postUrl: data.url,
      postDate: date,
      postTime: time,
      postFilename: filename,
      postContent: content,
      postDirectory: this.state.configDraftsDir,
      windowHeight: window.outerHeight
      });
    }.bind(this));

    chrome.storage.sync.get({
      gitUser: '',
      gitRepo: '',
      draftsDir: '_drafts',
      postsDir: '_posts',
      extension: 'markdown',
      gitBranch: 'master',
      token: '',
      template: DefaultTemplate
    }, function(item) {
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
  }

  render() {
    if (this.state.configGitUser === '' || this.state.configGitRepo === '' || this.state.configToken === '') {
      return (<div><SerumPopupError/></div>);
    } else {
      return (
        <div className='container'>
          <SerumEditor content={this.state.postContent} onChange={this.setContent} parentHeight={this.state.windowHeight}/>
          <div className="form-group controls">
            <div className="row">
              <div className="col-xs-3 post-label">
                <label>Post as:</label>
              </div>
              <div className="col-xs-2 directory-selector">
                <DirectorySelector selected={this.state.postDirectory} draftsDir={this.state.configDraftsDir} postsDir={this.state.configPostsDir} onChange={this.setDirectory}/>
              </div>
              <div className="col-xs-1 seperator-text">/</div>
              <div className="col-xs-6 filename-box">
                <SerumFilenameBox onChange={this.setFilename} filename={this.state.postFilename}/>
              </div>
            </div>
          </div>
          <div className="row controls statusView">
            <div className="col-xs-10">
              <SerumPostStatus status={this.state.status} message={this.state.statusMessage}/>
            </div>
            <button className='col-xs-2 btn btn-info btn-md post-button' onClick={this.postArticle}>Post</button>
          </div>
        </div>
      );
    }
  }

  // ======================================================== BEHAVIOUR
  setContent(newContent) {
    this.setState({postContent: newContent});
  }

  setDirectory(newDirectory) {
    this.setState({postDirectory: newDirectory});
  }

  setFilename(newFilename) {
    this.setState({postFilename: newFilename});
  }

  postArticle() {
    this.setState({status: 'posting', statusMessage: 'Posting...'});

    const github = new Github({token: this.state.configToken, auth: 'oauth'});

    const user = this.state.configGitUser;
    const repoName = this.state.configGitRepo;
    const branch = this.state.configGitBranch;
    const path = this.state.postDirectory + '/' + this.state.postFilename;
    const content = this.state.postContent;
    const commitMsg = this.determineCommitMessage(this.state.postDirectory, this.state.configDraftsDir, this.state.configPostsDir);

    const repo = github.getRepo(user, repoName);

    repo.writeFile(branch, path, content, commitMsg, {}).then(() => {
      this.setState({status: 'success', statusMessage: 'SUCCESS: Post committed successfully'});
    }).catch((err) => {
      this.setState({
        status: 'error',
        statusMessage: 'ERROR ' + err.response.status + ':' + err.response.statusText
      });
    });
  }

  determineCommitMessage(directory, draftDir, postDir) {
    var msg = 'adding content';
    if (directory === draftDir) {
      msg = 'Adding draft: ' + this.state.postTitle;
    }
    if (directory === postDir) {
      msg = 'Publishing: ' + this.state.postTitle;
    }
    return msg;
  }

}

module.exports = SerumApp;
