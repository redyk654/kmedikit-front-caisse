import React from 'react';
import Loader from "react-loader-spinner";

export default function CustomLoader({styles, color, height, width}) {
  return (
    <div className="loader" style={styles}>
        <Loader type="TailSpin" color={color} height={height} width={width}/>
        <p>
            patientez...
        </p>
    </div>
  )
}
