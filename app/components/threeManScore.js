import React from 'react'

function ThreeManScore({ data }) {
   
    return (
        <React.Fragment>

            <br /><br />
            <div className="w-full grid grid-cols-3 grid-rows-1 gap-1">
                <div className="card p-2 rounded-[20px] border-transparent  text-center text-l">
                    <div
                        className={`text-center  flex justify-self-center`}
                    >
                        {data?.player1} {data?.player1HasHandicap ? "(H)" : ""}
                    </div>
                    {data?.player1Score}
                </div>

                <div className="card p-2 rounded-[20px] border-transparent  text-center text-l">
                    <div
                        className={`text-center flex justify-self-center`}
                    >
                        {data?.player2} {data?.player2HasHandicap ? "(H)" : ""}
                    </div>
                    {data?.player2Score}
                </div>
                <div className="card p-2 rounded-[20px] border-transparent  text-center text-l">
                    <div
                        className={`text-center flex justify-self-center`}
                    >
                        {data?.player3} {data?.player3HasHandicap ? "(H)" : ""}
                    </div>
                    {data?.player3Score}
                </div>
            </div>

        </React.Fragment>
    )
}

export default ThreeManScore