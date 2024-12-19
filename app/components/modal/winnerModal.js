import React from 'react'
import meronWin from '../../../public/images/meronWins.png'
import walaWin from '../../../public/images/walaWins.png'
import Image from 'next/image'

function WinnerModal({ winnerSide, data, onClose }) {
    const getWinnerImage = () => {
        return winnerSide == 1 ? meronWin : walaWin
    }

    const renderDetails = () => {
        var findWinner = data.findIndex(x => x.side == winnerSide)
        var findNotWinner = data.findIndex(x => x.side != winnerSide)
        return <div className="grid grid-cols-1 grid-rows-2 gap-4 w-full">
            <div ><FighterDetail data={data[findWinner]}></FighterDetail></div>
            <div ><FighterDetail data={data[findNotWinner]}></FighterDetail></div>
        </div>
    }

    return (
        <div className='z-50 absolute flex justify-center items-center flex w-full  h-full overflow-hidden backdrop-blur'>
            <div className="flex flex-col items-center  w-full max-w-sm card gap-10 p-6 bg-white rounded-3xl shadow">
                <Image alt="resultImage" src={getWinnerImage()} />

                {renderDetails()}
                <button onClick={onClose} className='primary w-full'>Okay</button>
            </div>
        </div>
    )
}

function FighterDetail({ data }) {
    const title = data.side == 1 ? "Pula" : "Asul"
    const color = data.side == 1 ? "meronColor" : "walaColor"
    return <React.Fragment>
        <div className='inline-flex gap-2 justify-center w-full z-40'>
            <div className={`${color} rounded-full h-5 w-5  text-center label-header1`}></div>
            {data.owner} {data.breed}
        </div>

        {/* <div className="grid grid-cols-2 grid-rows-1 gap-4 bg-dark-no-border p-3 rounded-[20px]">

            <div className='col-span-2 font-bold'>
                Entry Name
            </div>
            <div className='col-span-2 font-bold'>
                Player Name : {data.owner} {data.breed}
            </div>
        </div> */}
        <br />
    </React.Fragment>
}

export default WinnerModal