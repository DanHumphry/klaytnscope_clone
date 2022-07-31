import axios from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { serverHost } from 'utils/variables';

const Blocks: NextPage = () => {
    const wss = useSelector((state: RootState) => state.networkReducer.wss);
    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined' || !wss) return;

        let query = '';

        if (router.query.page) query += `&page=${router.query.page}`;
        if (router.query.limit) query += `&limit=${router.query.limit}`;

        axios
            .get(`${serverHost}/block?network=${wss.getNetwork().selected}${query}`)
            .then(console.log)
            .catch(console.log);
    }, [router.query]);

    return <div></div>;
};

export default Blocks;
