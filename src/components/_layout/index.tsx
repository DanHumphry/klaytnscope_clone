import Header from 'components/_layout/Header';
import SideBar from 'components/_layout/Sidebar';
import React, { useEffect, useState } from 'react';

import css from 'components/_layout/index.module.scss';
import { Networks } from 'socket/index.declare';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [selectedPath, setSelectedPath] = useState('/'); // init value router path 사용해야될지도 ?

    useEffect(() => {
        return () => {
            localStorage.setItem('network', Networks.Baobab);
        };
    }, []);

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
