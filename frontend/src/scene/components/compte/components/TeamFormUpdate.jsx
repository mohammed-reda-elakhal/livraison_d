import React, { useEffect, useState } from 'react';
import { Form, Input, Button , Select , Switch  } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams , useNavigate , useLocation } from 'react-router-dom';
import { getProfile, updateProfile } from '../../../../redux/apiCalls/profileApiCalls';
import tarifData from '../../../../data/tarif.json';

const { Option } = Select;

function TeamFormUpdate() {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { id } = useParams(); // Get the userId from the URL parameters
    const { profile, error } = useSelector((state) => state.profile); // Assuming profile is stored in the profile state
    const navigate = useNavigate();
    const location = useLocation();
    const [previousRoute, setPreviousRoute] = useState(null);

    // Map tarifData to the format expected by Select component
    const options = tarifData.map((city) => ({
        value: city.nom, // Use city name as value for multiple selection
        label: city.nom, // Use city name as label for display
    }));

    useEffect(() => {
        // Store the previous route
        if (location.state?.from) {
            setPreviousRoute(location.state.from);
        }
    }, [location]);

    // Fetch profile data when the component mounts
    useEffect(() => {
        if (id) {
            dispatch(getProfile(id, 'team')); // Fetch profile data based on userId and role 'livreur'
        }
    }, [dispatch, id]);

    // Update form values when profile data is loaded
    useEffect(() => {
        if (profile) {
            form.setFieldsValue({
                nom: profile.nom,
                prenom: profile.prenom,
                username: profile.username,
                email: profile.email,
                tele: profile.tele,
                ville: profile.ville,
                adresse: profile.adresse,
                cin: profile.cin,
                active: profile.active, // Set active status from profile
            });
        }
    }, [profile, form]);

    // Handle form submission
    const onFinish = (values) => {
        dispatch(updateProfile(id, 'team', values));
        if (previousRoute) {
            navigate(previousRoute);
        } else {
            navigate('/dashboard/home'); // Default fallback
        }
    };

    if (error) {
        return <p>Error loading profile: {error}</p>;
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <Form.Item
                label="Nom"
                name="nom"
                rules={[{ required: true, message: "S'il vous plaît entrez le nom du livreur!", min: 2 }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Prénom"
                name="prenom"
                rules={[{ required: true, message: "S'il vous plaît entrez le prénom du livreur!", min: 2 }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "S'il vous plaît entrez le userName du Team!", min: 2 }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: "S'il vous plaît entrez l'email du livreur!" },
                    { type: 'email', message: "S'il vous plaît entrez un email valide!" },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Téléphone"
                name="tele"
                rules={[{ required: false, message: 'Veuillez entrer le numéro de téléphone!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Ville"
                name="ville"
                rules={[{ required: false, message: 'Veuillez entrer la ville!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Adresse"
                name="adresse"
                rules={[{ required: false, message: 'Veuillez entrer l’adresse!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="CIN"
                name="cin"
                rules={[{ required: false, message: 'Veuillez entrer la CIN!' }]}
            >
                <Input />
            </Form.Item>

            {/* Active status (Switch) */}
            <Form.Item
                label="Actif"
                name="active"
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Modifier Team
                </Button>
            </Form.Item>
        </Form>
    );
}

export default TeamFormUpdate;
