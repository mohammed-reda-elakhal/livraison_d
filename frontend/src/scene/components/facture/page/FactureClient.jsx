import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../../ThemeContext';
import '../facture.css';
import Menubar from '../../../global/Menubar';
import Topbar from '../../../global/Topbar';
import RecData from '../../../../data/reclamation.json';
import Title from '../../../global/Title';
import FactureClientTable from '../components/FactureClientTable';


const onChange = (key) => {
    console.log(key);
  }; 


function FactureClient() {
    const { theme } = useContext(ThemeContext);
    const [data, setData] = useState(RecData);

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
                        <Title nom='Facture Client' />
                    </div>
                    <div
                        className="content"
                        style={{
                            backgroundColor: theme === 'dark' ? '#001529' : '#fff',
                        }} 
                    >
                        <FactureClientTable  theme={theme}/>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default FactureClient;
