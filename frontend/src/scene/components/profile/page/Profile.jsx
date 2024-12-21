import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../../ThemeContext';
import '../profile.css'
import Menubar from '../../../global/Menubar';
import Topbar from '../../../global/Topbar';
import Title from '../../../global/Title';
import { Image, Tabs } from 'antd';
import { FaRegUser , FaStore } from "react-icons/fa";
import { IoDocumentAttach } from "react-icons/io5";
import { MdPayment , MdOutlineSecurity } from "react-icons/md";
import ProfileInfo from '../components/ProfileInfo';
import PayementProfile from '../components/PayementProfile';


function Profile() {
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
                    <div
                        className="content"
                        style={{
                            backgroundColor: theme === 'dark' ? '#001529' : '#fff',
                        }} 
                    >
                        <div className="container-profile">
                            <ProfileInfo theme={theme} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Profile;
