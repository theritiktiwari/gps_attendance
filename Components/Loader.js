import React from 'react';
import { Watch } from 'react-loader-spinner'

const Loader = ({ color }) => {
    return (
        <div className='loader'>
            <Watch
                height="80"
                width="80"
                radius="48"
                color={color}
                ariaLabel="watch-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
            />
        </div>
    )
}

export default Loader