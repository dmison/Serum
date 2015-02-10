'use strict';

CodeMirror.defineMode('templateMP', function(config) {
  return CodeMirror.multiplexingMode(
    CodeMirror.getMode(config, 'gfm'),
  {open: /^---$/, close: /^---$/,
  mode: CodeMirror.getMode(config, 'text/x-yaml'),
  delimStyle: 'delimit'}
  // .. more multiplexed styles can follow here
);
});
