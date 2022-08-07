import axios from 'axios';
import BlockTable from 'components/table';
import useClientStorage from 'hooks/socket/useClientStorage';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ReturnBlocks } from 'pages/blocks';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { ClientMessageType, TableTitle } from 'socket/index.declare';
import { serverHost } from 'utils/variables';

const Txs: NextPage = () => {
    const wss = useSelector((state: RootState) => state.networkReducer.wss);
    const router = useRouter();

    const [network] = useClientStorage(ClientMessageType.network);

    const [data, setData] = useState<ReturnBlocks>({ limit: 0, page: 0, result: [], total: 0 });

    useEffect(() => {
        if (typeof window === 'undefined' || !wss) return;

        let query = '';

        if (router.query.page) query += `&page=${router.query.page}`;
        if (router.query.limit) query += `&limit=${router.query.limit}`;

        console.log(query);

        axios
            .get(`${serverHost}/block/txs?network=${network}${query}`)
            .then((res) => setData(res.data))
            .catch(console.error);
    }, [router.query]);

    return (
        <BlockTable
            data={data}
            table={[
                { th: TableTitle.txHash, width: 15 },
                { th: TableTitle.block, width: 9 },
                { th: TableTitle.age, width: 10 },
                { th: TableTitle.fromTo, width: 28 },
                { th: TableTitle.methodSig, width: 10 },
                { th: TableTitle.txType, width: 13 },
                { th: TableTitle.amount, width: 11, style: { textAlign: 'right' } },
                { th: TableTitle.txFee, width: 11, style: { textAlign: 'right' } },
            ]}
        />
    );
};

export default Txs;
