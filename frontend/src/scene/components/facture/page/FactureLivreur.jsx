import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../../ThemeContext';
import '../facture.css';
import Menubar from '../../../global/Menubar';
import Topbar from '../../../global/Topbar';
import Title from '../../../global/Title';
import FactureLivreurTable from '../components/FactureLivreurTable';


const onChange = (key) => {
    console.log(key);
  }; 


function FactureLivreur() {
    const { theme } = useContext(ThemeContext);

    return (
        <div className='page-dashboard'>
            <Menubar />
            <main className="page-main">
                <Topbar />
                <div
                    className="page-content"
                    style={{
                        backgroundColor: theme === 'dark' ? '#002242' : 'var(--gray1)',
                        color: theme === 'dark' ? '#fff' : '#002242',
                    }}
                >
                    <div className="page-content-header">
                        <Title nom='Facture Livreur' />
                    </div>
                    <div
                        className="content"
                        style={{
                            backgroundColor: theme === 'dark' ? '#001529' : '#fff',
                        }} 
                    >
                        <FactureLivreurTable  theme={theme}/>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default FactureLivreur;
