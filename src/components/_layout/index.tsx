import Header from 'components/_layout/Header';
import SideBar from 'components/_layout/Sidebar';
import React, { useState } from 'react';

import css from 'components/_layout/index.module.scss';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [selectedPath, setSelectedPath] = useState('/');

    return (
        <div>
            <SideBar selectedPath={selectedPath} setSelectedPath={setSelectedPath} />
            <div className={selectedPath === '/' ? css.Layout_main_home : css.Layout_main_other}>
                <Header selectedPath={selectedPath} />
                {children}
            </div>
        </div>
    );
};

export default Layout;
