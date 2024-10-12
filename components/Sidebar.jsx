import React from 'react';

const TailwindSidebar = ({ activeSection }) => {
  const linkClasses = (id) =>
    `block px-4 py-2 text-table hover:hover-bg dark:text-white hover:rounded-md ${
      activeSection === id ? 'link-bg rounded-md' : ''
    }`;

  return (
    <div className="flex">
      <div
        className="fixed inset-y-0 left-0 w-64 shadow-lg bg-light-background dark:bg-dark-background text-table"
        id="sidebar"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h5 className="text-lg font-semibold">Dashboards</h5>
          <h6>Sez @ TokenLogic</h6>
          {/* <button
            type="button"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            aria-label="Close"
          >
            &times;
          </button> */}
        </div>
        <div className="p-3">
          <div className="mt-1">
            <ul className="mt-2 space-y-1">
            {/* <li>
              <a href="#AaveDash" className={linkClasses('AaveDash')}>
                AAVE stkBPT APR
              </a>
            </li> */}
            <li>
              <a href="#AaveDash7" className={linkClasses('AaveDash7')}>
              Balancer 20wstETH-80AAVE Pool TVL and APR
              </a>
            </li>
            <li>
              <a href="#AaveDash2" className={linkClasses('AaveDash2')}>
                AAVE stkBPT $100k Investment Analysis
              </a>
            </li>
            <li>
              <a href="#AaveDash3" className={linkClasses('AaveDash3')}>
                AAVE stkBPT Composition
              </a>
            </li>
            <li>
              <a href="#AaveDash4" className={linkClasses('AaveDash4')}>
                AAVE stkBPT Average Duration Between Claims
              </a>
            </li>
            <li>
              <a href="#AaveDash5" className={linkClasses('AaveDash5')}>
                AAVE stkBPT Daily Stakes and Unstakes
              </a>
            </li>
            <li>
              <a href="#AaveDash6" className={linkClasses('AaveDash6')}>
                20wstETH-80AAVE Balancer Pool Deposits and Withdrawals
              </a>
            </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex-1 ml-64 p-4">
        {/* Main content goes here */}
      </div>
    </div>
  );
};

export default TailwindSidebar;