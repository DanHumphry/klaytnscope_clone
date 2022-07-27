import Header from 'components/Layout/Header';
import SideBar from 'components/Layout/Sidebar';
import React, { useState } from 'react';

import css from 'components/Layout/index.module.scss';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [selectedPath, setSelectedPath] = useState('/Home');

    return (
        <div>
            <SideBar selectedPath={selectedPath} setSelectedPath={setSelectedPath} />
            <div className={css.Layout_main}>
                <Header />
                {children}
            </div>
        </div>
    );
};

export default Layout;
