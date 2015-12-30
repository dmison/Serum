(function() {
  var React = require('react');

  var moment = require('moment');

  var SerumEditorTest = require('./SerumEditorTest');
  var DefaultTemplate = require('./DefaultTemplate');
  var SerumFilenameBox = require('./SerumFilenameBox');
  var DirectorySelector = require('./DirectorySelector');

  var PostFormatter = require('./PostFormatter');

  var SerumApp = React.createClass({

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
        configGitUser: '',
        configDraftsDir: '_drafts',
        configPostsDir: '_posts',
        configToken: '',
        configTemplate: DefaultTemplate,
        windowHeight: 800,
        status: 'none'
      }
    },

    componentWillMount: function(){

      if (this.state.postDirectory === ''){
        this.setState({postDirectory: this.state.configDraftsDir});
      }

    },

    render: function() {

      console.log('app', this.state);
      return (
        <div>
          <SerumEditorTest
            content={this.state.postContent}
            onChange={this.setContent} />

          <DirectorySelector
            selected={this.state.postDirectory}
            draftsDir={this.state.configDraftsDir}
            postsDir={this.state.configPostsDir}
            onChange={this.setDirectory} />

          <SerumFilenameBox
            onChange={this.setFilename}
            filename={this.state.postFilename} />

          <button onClick={this.postArticle}>Post</button>

        </div>
      )
    },

    // ======================================================== BEHAVIOUR
    setContent: function(newContent){
      this.setState({ postContent: newContent} );
    },

    setDirectory: function(newDirectory){
      console.log('setDirectory: ', newDirectory);

      this.setState({postDirectory: newDirectory});
    },

    setFilename: function(newFilename){
      this.setState({postFilename: newFilename});
    },

    postArticle: function(){

      // [todo] set posting status

      var github = new Github({
        token: this.state.configToken, // 'bbc5d9e0985c1a05757ba790864076a78d171ceb',
        auth: 'oauth'
      });

      var user = this.state.configGitUser;
      var repo = this.state.configGitRepo;
      var path = this.state.postDirectory+'/'+this.state.postFilename;
      var content = this.state.postContent;
      var commitMsg = this.determineCommitMessage(this.state.postDirectory,
        this.state.configDraftsDir, 
        this.state.configPostsDir);
      var repo = github.getRepo(user, repo);

      repo.write('master', path, content, commitMsg, {}, function(err){
        if (err) {
          // [todo] set error status and message
          console.log(err);
        } else {
          console.log('done');
          // [todo] set success status and message
        }

     });

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
          token: '',
          template: DefaultTemplate
        },
        function(item) {
          this.setState({
              configGitRepo: item.gitRepo,
              configGitUser: item.gitUser,
              configDraftsDir: item.draftsDir,
              configPostsDir: item.postsDir,
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

          var today = new moment();
          date = today.format('YYYY-MM-DD');
          time = today.format('HH:mm');

          var filename = PostFormatter.formatFilename(response.title, date);
          var content = PostFormatter.processTemplate(this.state.configTemplate, response.title, response.date, response.time, response.url, response.quote);

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

})();
