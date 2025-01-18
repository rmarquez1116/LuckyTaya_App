import React from 'react'

function Trend({ data, items }) {
    let previousWinner = -1;
    let columnIncrement = 0;
    let rowIncrement = -1;
    const rows = 5;
    const cols = 10;
    const trendArray = Array.from({ length: rows }, () => Array(cols).fill(<div className="text-center"></div>));
    const player1 = data.find(x => x.side == 1)
    const player2 = data.find(x => x.side == 0)

    for (let index = 0; index < items.length; index++) {
        const element = items[index];
        const color = element.winSide == 1 ? "meronColor" : element.winSide == 0 ? "walaColor" : "cancelColor"

        rowIncrement++;

        if (rowIncrement >= rows) {
            columnIncrement += 1;
            rowIncrement = 0;
        }

        try {
            trendArray[rowIncrement][columnIncrement] =
                <div className={`${color} rounded-full h-5 w-6  m-auto text-center`}>
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
                <div className="overflow-x-auto">
                    <table className="table-fixed w-full border-collapse border border-gray-300">
                        <tbody>
                            {trendArray.map((row, rowIndex) => (
                                <tr key={`row-${rowIndex}`}>
                                    {row.map((item, colIndex) => (
                                        <td
                                            key={`cell-${rowIndex}-${colIndex}`}
                                            className="border border-gray-300 text-center p-2  h-[40px] w-[40px]" // Set fixed width for each cell
                                        >
                                            {item}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Trend