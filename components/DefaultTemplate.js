var DefaultTemplate = '---\n' +
  'layout: post\n' +
  'title: "<<title>>"\n' +
  'date: <<date>> <<time>>\n' +
  'link: <<url>>\n' +
  '---\n\n' +
  '[<<title>>](<<url>>)\n' +
  '\n' +
  '<<quote>>\n\n';

module.exports = DefaultTemplate;
