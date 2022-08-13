import axios from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Block, ClientMessageType, TableTitle } from 'socket/index.declare';
import { serverHost } from 'utils/variables';
import BlockTable from 'components/table';
import useClientStorage from 'hooks/socket/useClientStorage';

export interface ReturnBlocks {
    limit: number;
    page: number;
    result: Block[];
    total: number;
}

const Blocks: NextPage = () => {
    const router = useRouter();

    const [network] = useClientStorage(ClientMessageType.network);

    const [data, setData] = useState<ReturnBlocks>({ limit: 0, page: 0, result: [], total: 0 });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let query: string = '';

        if (router.query.page) query += `&page=${router.query.page}`;
        if (router.query.limit) query += `&limit=${router.query.limit}`;

        axios
            .get(`${serverHost}/block?network=${network}${query}`)
            .then((res) => setData(res.data))
            .catch(console.error);
    }, [router.query]);

    return (
        <BlockTable
            data={data}
            table={[
                { th: TableTitle.block, width: 13 },
                { th: TableTitle.age, width: 20 },
                { th: TableTitle.totalTx, width: 17 },
                { th: TableTitle.proposer, width: 25 },
                { th: TableTitle.reward, width: 13, style: { textAlign: 'right' } },
                { th: TableTitle.size, width: 13, style: { textAlign: 'right' } },
            ]}
        />
    );
};

export default Blocks;
