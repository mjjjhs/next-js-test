import React, { ReactElement } from 'react';
import styles from '../styles/Spinner.module.scss';

const CommonSpinner: React.FC = (): ReactElement => {
    return (
        <div style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '1rem 2rem 2rem'}}>
            <div className={styles.spinner}></div>
        </div>
    )
};

export default CommonSpinner;
