const React = require('react');

const DirectorySelector = (props) => {
  return (
    <select className='form-control' value={props.selected} onChange={(event)=>{ props.onChange(event.target.value); }}>
      <option value={props.draftsDir}>{props.draftsDir}</option>
      <option value={props.postsDir}>{props.postsDir}</option>
    </select>
  );
};

module.exports = DirectorySelector;
