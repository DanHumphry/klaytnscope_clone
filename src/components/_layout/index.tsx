import Header from 'components/_layout/Header';
import SideBar from 'components/_layout/Sidebar';
import React, { useState } from 'react';

import css from 'components/_layout/index.module.scss';

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
