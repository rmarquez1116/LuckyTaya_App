import React from 'react'

function Trend({ data, items }) {
    let previousWinner = -1;
    let columnIncrement = -1;
    let rowIncrement = -1;
    const rows = 6;
    const cols = 10;
    const trendArray = Array.from({ length: rows }, () => Array(cols).fill(<div className="text-center"></div>));
    const player1 = data.find(x => x.side == 1)
    const player2 = data.find(x => x.side == 0)

    for (let index = 0; index < items.length; index++) {
        const element = items[index];
        const color = element.winSide == 1 ? "meronColor" : element.winSide == 0 ? "walaColor" : "cancelColor"
        if (previousWinner == -1) {
            previousWinner = element.winSide;
            rowIncrement = 0
            columnIncrement = 0
        } else {

            if (previousWinner != element.winSide && element.winSide < 3) {
                columnIncrement += 1
                rowIncrement = 0
            } else {
                ++rowIncrement
            }
            previousWinner = element.winSide;
        }

        if (rowIncrement > rows) {
            rowIncrement = 0
            columnIncrement += 1
        }
        if (columnIncrement > cols)
            break;
        try {
            console.log('hello')
            trendArray[rowIncrement][columnIncrement] =
                <div className={`${color} rounded-full h-6 w-6  text-center`}>
                    {element.fightNum}
                </div>
        } catch (error) {

        }
    }
    return (
        <React.Fragment>

            <br /><br />
            <div className="w-full grid grid-cols-3 grid-rows-1 gap-4">
                <div className="card p-2 rounded-[20px] border-transparent  text-center">
                    <div className={`meronColor rounded-full h-10 w-10 mt-[-20]  flex justify-self-center`}>
                    </div>
                    {`${player1?.owner} ${player1?.breed}`}
                </div>

                <div className="card p-2 rounded-[20px] border-transparent  text-center">
                    <div className={`walaColor rounded-full h-10 w-10 mt-[-20]  flex justify-self-center`}>
                    </div>

                    {`${player2?.owner} ${player2?.breed}`}
                </div>
                <div className="card p-2 rounded-[20px] border-transparent  text-center">
                    <div className={`cancelColor rounded-full h-10 w-10 mt-[-20] flex justify-self-center`}>
                    </div>
                    Cancel
                </div>
            </div>
            <div className='border-2 mt-2 p-4 border-yellow-200 rounded-[20] w-full'>
                <div className="grid grid-cols-10 grid-rows-6  h-[300]">
                    {trendArray.map((row, rowIndex) => (
                        row.map((item, colIndex) => (
                            <div key={`trend-${rowIndex}-${colIndex}`} className="border  text-center flex justify-center items-center">
                                {item}
                            </div>
                        ))
                    ))}

                </div>
            </div>
        </React.Fragment>
    )
}

export default Trend