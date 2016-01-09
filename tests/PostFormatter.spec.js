/* global describe it */
(function(){
  var expect = require('expect');

  var PostFormatter = require('../components/PostFormatter');

  describe('PostFormatter', function(){

    it('filename is created correctly from date and title', () => {
      var date = '2016-01-03';
      var title = 'Some cool example post';
      var extension = 'markdown';
      var expectedFilename = '2016-01-03-Some-cool-example-post.markdown';
      var actualFilename = PostFormatter.formatFilename(title, date, extension);

      expect(expectedFilename).toEqual(actualFilename);

    });

  });


})();
