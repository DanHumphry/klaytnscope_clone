import axios from 'axios';
import Index from 'components/table';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { Block, TableTitle } from 'socket/index.declare';
import { serverHost } from 'utils/variables';

const Blocks: NextPage = () => {
    const wss = useSelector((state: RootState) => state.networkReducer.wss);
    const router = useRouter();

    const [blocks, setBlocks] = useState<Block<TableTitle>[]>([]);

    useEffect(() => {
        if (typeof window === 'undefined' || !wss) return;

        let query = '';

        if (router.query.page) query += `&page=${router.query.page}`;
        if (router.query.limit) query += `&limit=${router.query.limit}`;

        axios
            .get(`${serverHost}/block?network=${wss.getNetwork().selected}${query}`)
            .then((res) => {
                console.log(res.data.result.length);
                setBlocks(res.data.result);
            })
            .catch(console.log);
    }, [router.query]);

    return (
        <Index
            data={blocks}
            table={[
                { title: TableTitle.block, width: 13 },
                { title: TableTitle.age, width: 20 },
                { title: TableTitle.totalTx, width: 17 },
                { title: TableTitle.proposer, width: 25 },
                { title: TableTitle.reward, width: 13 },
                { title: TableTitle.size, width: 13 },
            ]}
        />
    );
};

export default Blocks;
