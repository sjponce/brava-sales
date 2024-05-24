// import React from 'react';
// import { Form, Input, Checkbox } from 'antd';
// import { UserOutlined, LockOutlined } from '@ant-design/icons';

// export default function LoginForm() {
//   return (
//     <div>
//       <Form.Item
//         label={'Correo electrónico'}
//         name="email"
//         rules={[
//           {
//             required: true,
//           },
//           {
//             type: 'email',
//           },
//         ]}
// >
//         <Input
//           prefix={<UserOutlined className="site-form-item-icon" />}
//           placeholder={'correo electrónico'}
//           type="email"
//           size="large" 
//         />
//       </Form.Item>
//       <Form.Item
//         label={'Contraseña'}
//         name="password"
//         rules={[
//           {
//             required: true,
//           },
//         ]}
//       >
//         <Input.Password
//           prefix={<LockOutlined className="site-form-item-icon" />}
//           placeholder={'contraseña'}
//           size="large"
//         />
//       </Form.Item>

//       <Form.Item>
//         <Form.Item name="remember" valuePropName="checked" noStyle>
//           <Checkbox>{'Mantener la sesión iniciada'}</Checkbox>
//         </Form.Item>
//         <a className="login-form-forgot" href="/forgetpassword">
//           {'Olvidé mi contraseña'}
//         </a>

//       </Form.Item>
//     </div>
//   );
// }

import React from 'react';
import { TextField, Checkbox, FormControlLabel, Link, Box, Typography, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

export default function LoginForm( {register} ) {
  return (
    <Box display='flex' flexDirection='column'>
      <TextField
        label="Correo electrónico"
        name="email"
        type="email"
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon color='disabled' />
            </InputAdornment>
          )
        }}
        {...register('email', { required: true })}
        variant="outlined"
        size="large"
        fullWidth
        sx={{ mb: 3 }}
      />
      <TextField
        label="Contraseña"
        type="password"
        name="password"
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon color='disabled' />
            </InputAdornment>
          ),
        }}
        inputProps={{ minLength: 8 }}
        {...register('password', { required: true })}
        variant="outlined"
        size="large"
        fullWidth
      />

      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <FormControlLabel
          control={<Checkbox name="remember"/>}
          label={<Typography variant="subtitle2">Recuérdame</Typography>}
        />
        <Link href="/forgetpassword">
          <Typography variant="subtitle2" >Olvidé mi contraseña</Typography>
        </Link>
      </Box>
    </Box>
  );
}