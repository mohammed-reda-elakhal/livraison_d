import React, { useEffect, useState } from 'react';
import TableDashboard from '../../../global/TableDashboard';
import { Button, Switch, Drawer, Form, Input, Space } from 'antd';
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { getNotification, createNotification, updateNotification, deleteNotification } from '../../../../redux/apiCalls/notificationApiCalls';
import { notificationActions } from '../../../../redux/slices/notificationSlice';

function NotificationGlobale({ theme }) {
    const dispatch = useDispatch();
    const { notification } = useSelector((state) => state.notification);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editingNotification, setEditingNotification] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(getNotification());
        window.scrollTo(0, 0);
    }, [dispatch]);

    const handleToggleVisibility = (id) => {
        const notif = notification.find(n => n._id === id);
        if (notif) {
            dispatch(updateNotification(id, { visibility: !notif.visibility }));
        }
    };

    const handleAddNotification = () => {
        setEditingNotification(null);
        form.resetFields();
        setDrawerVisible(true);
    };

    const handleEditNotification = (notification) => {
        setEditingNotification(notification);
        setDrawerVisible(true);
        setTimeout(() => {
            form.setFieldsValue({ 
                message: notification.message, 
                visibility: notification.visibility 
            });
        }, 0);
    };

    const handleDeleteNotification = (id) => {
        // Optimistically remove the notification from the state
        const updatedNotifications = notification.filter(notif => notif._id !== id);
        dispatch(notificationActions.setNotification(updatedNotifications)); // Update state locally

        // Call the delete action
        dispatch(deleteNotification(id));
    };

    const handleFormSubmit = (values) => {
        if (editingNotification) {
            // Update existing notification
            dispatch(updateNotification(editingNotification._id, { message: values.message, visibility: values.visibility }));
        } else {
            // Add new notification
            dispatch(createNotification({ message: values.message, visibility: values.visibility }));
        }
        setDrawerVisible(false);
        form.resetFields();
    };

    const handleCloseDrawer = () => {
        setDrawerVisible(false);
        form.resetFields();
    };

    const columns = [
        {
            title: 'Notification',
            dataIndex: 'message',
            key: 'message'
        },
        {
            title: 'Visibility',
            dataIndex: 'visibility',
            key: 'visibility',
            render: (text, record) => (
                <Switch
                    checked={record.visibility}
                    onChange={() => handleToggleVisibility(record._id)}
                />
            )
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => (
                <div className='action_user'>
                    <Button 
                        type='primary'
                        icon={<FaPenToSquare />}
                        onClick={() => handleEditNotification(record)}
                    />
                    <Button 
                        type='primary'
                        danger
                        icon={<MdDelete />}
                        onClick={() => handleDeleteNotification(record._id)}
                    />
                </div>
            )
        }
    ];

    return (
        <>
            <Button 
                type='primary'
                icon={<FaPlus />}
                onClick={handleAddNotification}
            >   
                Ajouter Notification
            </Button>
            <TableDashboard theme={theme} id="_id" column={columns} data={notification} />

            <Drawer
                title={editingNotification ? 'Edit Notification' : 'Add Notification'}
                width={320}
                onClose={handleCloseDrawer}
                visible={drawerVisible}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <Form
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    form={form}
                    initialValues={{ message: '', visibility: true }} // Adjust initial values
                >
                    <Form.Item
                        name="message"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter a description' }]}
                    >
                        <Input placeholder="Enter notification description" />
                    </Form.Item>
                    <Form.Item
                        name="visibility"
                        label="Visibility"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                    <Space>
                        <Button onClick={handleCloseDrawer}>Cancel</Button>
                        <Button type="primary" htmlType="submit">
                            {editingNotification ? 'Update' : 'Add'}
                        </Button>
                    </Space>
                </Form>
            </Drawer>
        </>
    );
}

export default NotificationGlobale;
