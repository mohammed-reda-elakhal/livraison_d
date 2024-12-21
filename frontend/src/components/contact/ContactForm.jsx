import React , { useState } from 'react'
import { InfoCircleOutlined, UserOutlined , PhoneOutlined , MailOutlined } from '@ant-design/icons';
import { Input , Tooltip , Flex , Button } from 'antd';
const { TextArea } = Input;

const formatNumber = (value) => new Intl.NumberFormat().format(value);
const NumericInput = (props) => {
  const { value, onChange } = props;
  const handleChange = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
      onChange(inputValue);
    }
  };

  // '.' at the end or only '-' in the input box.
  const handleBlur = () => {
    let valueTemp = value;
    if (value.charAt(value.length - 1) === '.' || value === '-') {
      valueTemp = value.slice(0, -1);
    }
    onChange(valueTemp.replace(/0*(\d+)/, '$1'));
  };
  const title = value ? (
    <span className="numeric-input-title">{value !== '-' ? formatNumber(Number(value)) : '-'}</span>
  ) : (
    'Tél Exemple : 0655124822 '
  );
  return (
    <Tooltip trigger={['focus']} title={title} placement="topLeft" overlayClassName="numeric-input">
      <Input
        {...props}
        size='large'
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Numéro"
        maxLength={10}
        prefix={
            <PhoneOutlined
            style={{
                color: 'rgba(0,0,0,.25)',
            }}
            />
        }
        suffix={
            <Tooltip title="Entrer votre Numéro de telephone">
            <InfoCircleOutlined
                style={{
                color: 'rgba(0,0,0,.45)',
                }}
            />
            </Tooltip>
        }
      />
    </Tooltip>
  );
};

function ContactForm() {
    const [number, setNumber] = useState('');
    const [nom , setNom] = useState('');
    const [email , setEmail] = useState('');
    const [message , setMessage] = useState('');

    const handleSubmit = () =>{
      console.log(nom , email , number , message);
    }

  return (
    <div className='contact-form'>
        <p>Veauillez remplir tous les champs ...!</p>
        <form>
            <div className="contact-form-inputs">
                <Input
                    placeholder="Nom et Prénom"
                    size='large'
                    value={nom}
                    onChange={(e)=>setNom(e.target.value)}
                    prefix={
                        <UserOutlined
                        style={{
                            color: 'rgba(0,0,0,.25)',
                        }}
                        />
                    }
                    suffix={
                        <Tooltip title="Entrer votre nom et prénom">
                        <InfoCircleOutlined
                            style={{
                            color: 'rgba(0,0,0,.45)',
                            }}
                        />
                        </Tooltip>
                    }
                />
                <Input 
                    size="large" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    prefix={
                        <MailOutlined
                        style={{
                            color: 'rgba(0,0,0,.25)',
                        }}
                        />
                    }
                    suffix={
                        <Tooltip title="Entrer votre Email">
                        <InfoCircleOutlined
                            style={{
                            color: 'rgba(0,0,0,.45)',
                            }}
                        />
                        </Tooltip>
                    }
                />
                <NumericInput
                    value={number}
                    onChange={setNumber}
                />
                <TextArea
                    size='large'
                    showCount
                    maxLength={300}
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    placeholder="Votre message"
                    style={{
                        height: 120,
                        resize: 'none',
                    }}
                />
                <button onClick={handleSubmit}  className='submit-btn'>
                    Envoyer
                </button>

            </div>
        </form>
    </div>
  )
}

export default ContactForm