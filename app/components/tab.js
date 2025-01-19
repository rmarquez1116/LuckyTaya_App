// components/Tabs.js
import React, { useState } from 'react';

const Tabs = ({tabs}) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full mx-auto">
      <div className="border-b border-gray-300">
        <ul className="flex justify-around">
          {tabs.map((tab, index) => (
            <li
              key={index}
              className={`cursor-pointer pb-2 px-4 ${
                activeTab === index ? 'text-yellow' : 'text-blue'
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="">
        {/* Render content of the active tab */}
        <div>{tabs[activeTab].content}</div>
      </div>
    </div>
  );
};

export default Tabs;
