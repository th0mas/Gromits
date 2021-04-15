import React, {Children} from 'react';

const InfoHolder = ({children}) => {
  console.log(Children.toArray(children))
  let statusColour = Children.toArray(children)[0] === "" ? "bg-green-500" : "bg-yellow-500"
  return <div className="absolute z-20 bottom-0 left-5 bg-white w-1/6 rounded-t-2xl shadow-xl">
    <div className="p-2 flex flex-col-reverse space-y-2">
      <div className="flex flex-row items-center space-x-1 pt-2">
        <p className="font-bold">Ocean Gromits</p>
        <div className="flex-grow"></div>
        <p className="text-sm font-light text-gray-400">status</p>
        <span className={`rounded-full h-4 w-4 ${statusColour}`}></span>
      </div>
      {children}
    </div>
  </div>
}

export default InfoHolder