const React = require('react');

const SerumFilenameBox = (props)=>{
  return (
    <input className='form-control' onChange={ (event)=>{ props.onChange(event.target.value); } } value={props.filename} />
  );
};

module.exports = SerumFilenameBox;
