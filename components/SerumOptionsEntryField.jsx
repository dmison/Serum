const React = require('react');

const SerumOptionsEntryField = (props) => {

  return (
    <div className='form-group'>
      <label className='col-sm-2 control-label'>{props.label}</label>
      <div className='col-sm-4'>
        <input className='form-control' onChange={ (event)=>{ props.onChange(event.target.value); } } value={props.configValue}/>
      </div>
      <div className='col-sm-6 helptext'>
      <p>
        {props.description}
      </p>
    </div>
    </div>
  );

};

module.exports = SerumOptionsEntryField;
