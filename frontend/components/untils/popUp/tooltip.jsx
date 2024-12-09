import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import React, { useState } from 'react';

const tooltipUntils = ({ text }) => {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  ); 

  return (
    <OverlayTrigger placement="top" overlay={renderTooltip}>
        <i type="button" className="ps-1 text-danger bi bi-exclamation-circle-fill"></i>
    </OverlayTrigger>
  );
};

export default tooltipUntils;
