const formatFilename = function(title, date, extension){
  //if extension starts with a . then remove the .
  extension = extension.replace(/^\./g, '');

  return (date + '-' + title).replace(/\W+/g, '-') + '.'+extension;
};

const formatBlockPost = function(quote){
  const blockquote = quote.split('\n').map(function(line) {
    return '> ' + line;
  }).join('\n');
  return blockquote;
};

const processTemplate = function(template, title, date, time, url, quote){
  var content = template;

  content = content.replace(/<<title>>/g, title);
  content = content.replace(/<<date>>/g, date);
  content = content.replace(/<<time>>/g, time);
  content = content.replace(/<<url>>/g, url);
  content = content.replace(/<<quote>>/g, formatBlockPost(quote));

  return content;

};

module.exports = {
  formatFilename: formatFilename,
  formatBlockPost: formatBlockPost,
  processTemplate: processTemplate
};
