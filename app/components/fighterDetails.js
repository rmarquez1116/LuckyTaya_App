
import React from "react"
import Image from 'next/image';

function FighterDetail({ data, type = 1 }) {
    const title = data?.side == 1 ? "Meron" : "Wala"
    const color = data?.side == 1 ? "meronColor" : "walaColor"
    const renderBody = () => {
        if (type == 1) {
            return <div className="grid grid-cols-3 grid-rows-1 gap-4 bg-dark-no-border p-3 rounded-[20px]">
                <div className='col-span-2'>
                    <div>
                        Entry Name
                    </div>
                    <div>
                        Owner : {data.owner}
                    </div>
                    <div>
                        Weight : {data.weight}
                    </div>
                    <div>
                        {data.tag}
                    </div>
                </div>
                <div ><Image alt="playerPicture" src={data.picture}/></div>
            </div>
        }
        else {
            return <div className="grid grid-cols-3 grid-rows-1 gap-4 bg-dark-no-border p-3 rounded-[20px]">
                <div ><Image  alt="playerPicture" src={data.picture}/></div>
                <div className='col-span-2'>
                   
                    <div>
                        NAME : {data.owner}
                    </div>
                    <div>
                        WEIGHT : {data.weight}
                    </div>
                    <div>
                       BILLIARD :  {data.tag}
                    </div>
                </div>
            </div>
        }
    }
    return <React.Fragment>

        {type == 1 && <div className='inline-flex gap-2 justify-center w-full'>
            <div className={`${color} rounded-full h-5 w-5  text-center`}></div>
            {title}
        </div>
        }

        {renderBody()}
        <br />
    </React.Fragment>
}

export default FighterDetail;