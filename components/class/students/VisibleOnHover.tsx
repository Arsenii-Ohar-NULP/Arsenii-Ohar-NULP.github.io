import React, {ReactNode} from 'react';

interface VisibleOnHoverProps {
    children: ReactNode;
    isHover: boolean;
}

export const VisibleOnHover = ({children, isHover}: VisibleOnHoverProps) => {
    return <div className={!isHover && 'invisible'} data-testid={'invisible-button'}>
        {children}
    </div>;
}