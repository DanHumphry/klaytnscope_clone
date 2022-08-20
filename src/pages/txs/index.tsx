import axios from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { ClientMessageType, TableTitle, Txs } from 'socket/index.declare';
import { HOST_SERVER } from 'utils/variables';
import BlockTable from 'components/table';
import useClientStorage from 'hooks/socket/useClientStorage';

export interface ReturnTXS {
    limit: number;
    page: number;
    result: Txs[];
    total: number;
}

const Txs: NextPage = () => {
    const router = useRouter();
    
    const [network] = useClientStorage(ClientMessageType.network);

    const [data, setData] = useState<ReturnTXS>({ limit: 0, page: 0, result: [], total: 0 });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let query = '';

        if (router.query.page) query += `&page=${router.query.page}`;
        if (router.query.limit) query += `&limit=${router.query.limit}`;

        axios
            .get(`${HOST_SERVER}/block/txs?network=${network.selected}${query}`)
            .then((res) => setData(res.data))
            .catch(console.error);
    }, [router.query]);

    return (
        <BlockTable
            title="Transactions"
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
