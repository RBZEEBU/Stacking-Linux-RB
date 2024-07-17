/* import React from "react";
import { CircularProgress, Box, BoxProps } from "@mui/material";

const Loader = (props: BoxProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        zIndex: 1300,
        my: 10,
        padding: 0,
        overflow: "hidden",
        ...props.sx,
      }}
      {...props}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
 */
import React from 'react'

export default function Loader({ message = '' }) {
  return (
    <div className='container-loader'>
      <div className="loader"><span></span></div>
      <div className="loader"><span></span></div>

      <div className="loader one"><i></i></div>
      <div className="loader two"><i></i></div>
      {message !== '' && <div className='loadernote'>{message}</div>}
    </div>
  )
}
