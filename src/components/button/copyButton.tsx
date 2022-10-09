import React, { useRef } from 'react';

const CopyButton = ({ data }: { data: string }) => {
    const ref = useRef<HTMLButtonElement>(null);

    const withCopyHandler = (data: string): void => {
        if (ref.current) {
            const _ref = { ...ref.current.style };

            ref.current.style.color = '#fff';
            ref.current.style.background = 'none';
            ref.current.style.backgroundColor = 'rgb(106, 209, 186)';
            ref.current.style.border = 'none';
            ref.current.style.padding = '0px';
            if (ref.current.firstChild) ref.current.firstChild.textContent = 'COPIED!';

            setTimeout(() => {
                if (ref.current) {
                    ref.current.style.color = _ref.color;
                    ref.current.style.background = _ref.background;
                    ref.current.style.backgroundColor = _ref.backgroundColor;
                    ref.current.style.border = _ref.border;
                    ref.current.style.padding = _ref.padding;
                    if (ref.current.firstChild) ref.current.firstChild.textContent = 'COPY';
                }
            }, 1000);
        }

        const t = document.createElement('textarea');
        document.body.appendChild(t);
        t.value = data;
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
    };

    return (
        <button
            className="Button withCopyButtonTitle withCopyButton__button"
            type="button"
            onClick={() => withCopyHandler(data)}
            ref={ref}
        >
            <span>COPY</span>
        </button>
    );
};

export default CopyButton;
