import axios from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { ReturnBlocks } from 'pages/blocks';
import { ClientMessageType, TableTitle } from 'socket/index.declare';
import { serverHost } from 'utils/variables';
import BlockTable from 'components/table';
import useClientStorage from 'hooks/socket/useClientStorage';

const Txs: NextPage = () => {
    const router = useRouter();

    const [network] = useClientStorage(ClientMessageType.network);

    const [data, setData] = useState<ReturnBlocks>({ limit: 0, page: 0, result: [], total: 0 });

    useEffect(() => {
        if (typeof window === 'undefined') return;

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
