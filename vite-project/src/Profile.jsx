import React from "react";
import { Chip } from "@material-tailwind/react";

export default function Profile( ) {
    return (
        <>
        <div className="text-center">
      <Chip
        variant="ghost"
        className={"font-normal text-${theme}  text-xl"}
        color="cyan"
        value="To be Displayed after complete or partial Create"
      />
    </div>
        </>
    )
}