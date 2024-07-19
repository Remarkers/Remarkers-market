import React from "react";
import Identicon from '@polkadot/react-identicon';

export default function Profile( ) {
  const Account = (JSON.parse(localStorage.getItem("Account")))
  const theme = JSON.parse(localStorage.getItem("theme"))
    return (
        <>
        <br />
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Identicon
        value={Account && Account?.address}
        size={100}
        theme="polkadot"
        className='icon-float-center'
    />
    </div>
    <br />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',  fontSize: '25px'}}>
    <span style={{ marginLeft: '8px', textAlign: 'center' }} className={``}>
        {Account && Account?.address}
    </span>
</div>


        </>
    )
}